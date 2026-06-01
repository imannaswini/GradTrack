const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'super-secret-gradtrack-key-2026'; // In production, use env variable

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mannas24',
  database: 'gradtrack'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- Routes ---

// Signup API endpoint
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to register user.' });
        
        // Issue JWT token
        const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ message: 'Signup successful!', token, user: { id: result.insertId, name, email } });
      }
    );
  });
}); 

// Signin API endpoint
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required.' });
  }

  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = results[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(200).json({
      message: 'Signin successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  });
});

// Get Profile API
app.get('/api/profile', authenticateToken, (req, res) => {
  db.query(
    'SELECT name, email, linkedin_url, github_url, portfolio_url, skills FROM users WHERE id = ?',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(404).json({ error: 'User not found' });
      
      res.status(200).json(results[0]);
    }
  );
});

// Update Profile API
app.put('/api/profile', authenticateToken, (req, res) => {
  const { name, linkedin_url, github_url, portfolio_url, skills } = req.body;
  
  db.query(
    'UPDATE users SET name = ?, linkedin_url = ?, github_url = ?, portfolio_url = ?, skills = ? WHERE id = ?',
    [name, linkedin_url, github_url, portfolio_url, skills, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(200).json({ message: 'Profile updated successfully' });
    }
  );
});

// Dashboard Stats API
app.get('/api/dashboard-stats', authenticateToken, (req, res) => {
  // Aggregate stats: recent quiz scores, number of applications
  const stats = {};
  
  db.query('SELECT COUNT(*) as appsCount FROM applications WHERE email = ?', [req.user.email], (err, appResults) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    stats.applicationsCount = appResults[0].appsCount;

    db.query('SELECT score, total_questions, domain_name FROM quiz_scores WHERE user_email = ? ORDER BY id DESC LIMIT 3', [req.user.email], (err, quizResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      stats.recentQuizzes = quizResults;

      // Calculate profile completion percentage based on users table fields
      db.query('SELECT name, linkedin_url, github_url, portfolio_url, skills FROM users WHERE id = ?', [req.user.id], (err, userResults) => {
         if (err) return res.status(500).json({ error: 'Database error' });
         let completion = 20; // Base completion for having an account
         if(userResults[0].name) completion += 20;
         if(userResults[0].linkedin_url) completion += 15;
         if(userResults[0].github_url) completion += 15;
         if(userResults[0].portfolio_url) completion += 10;
         if(userResults[0].skills) completion += 20;
         stats.profileCompletion = completion;

         res.status(200).json(stats);
      });
    });
  });
});

// Submit Quiz API
app.post('/submit-quiz', (req, res) => {
  const { user_email, domain_name, score, total_questions } = req.body;

  if (!user_email || !domain_name || score == null || total_questions == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO quiz_scores (user_email, domain_name, score, total_questions)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [user_email, domain_name, score, total_questions], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(200).json({ message: 'Score recorded successfully!' });
  });
});

// Application form
app.post('/api/apply', (req, res) => {
  const { name, email, phone, dob, college, resume, message } = req.body;

  if (!name || !email || !phone || !dob || !college || !resume || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    INSERT INTO applications (name, email, phone, dob, college, resume_link, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, dob, college, resume, message], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Application submitted successfully!' });
  });
});

// Submit answers/checklist
app.post('/api/submit', (req, res) => {
  const { email, checklist, answers } = req.body;
  if (!email || !checklist || !answers) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.query('SELECT id FROM users WHERE email = ?', [email], (err, userResults) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (userResults.length === 0) return res.status(404).json({ error: 'User not found' });
    const userId = userResults[0].id;

    const sql = 'INSERT INTO answers (user_email, q1, q2, q3, q4, q5) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [email, ...answers], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error saving answers' });

      if (checklist.length > 0) {
        const checklistValues = checklist.map(item => [userId, item]);
        const checklistSql = 'INSERT INTO progress_checklist (submission_id, item) VALUES ?';

        db.query(checklistSql, [checklistValues], (err2) => {
          if (err2) return res.status(500).json({ error: 'Error saving checklist' });
          res.status(200).json({ message: 'Submission saved successfully' });
        });
      } else {
        res.status(200).json({ message: 'Submission saved successfully' });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
