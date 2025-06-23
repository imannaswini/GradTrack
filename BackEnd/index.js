const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
// exposes /api/progress/:email
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

// Signup API endpoint
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
    console.log('Attempting to insert user:', name, email); 
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }



  // Check if email exists
  db.query('SELECT id  FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Insert new user
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to register user.' });
        
        res.status(201).json({ message: 'Signup successful!' });
      }
    );
  });
}); 
    
//  Submit Quiz API — Now properly outside the signup route
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
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Score recorded successfully!' });
  });
});

 //Application form
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
    if (err) {
      console.error('Error inserting application:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({ message: 'Application submitted successfully!' });
  });
});

// Submit route
app.post('/api/submit', (req, res) => {
  const { email,checklist, answers } = req.body;
if (!email || !checklist || !answers) {
  return res.status(400).json({ error: 'Missing required fields' });
}
 // 1. First get the user's ID from their email
  db.query('SELECT id FROM users WHERE email = ?', [email], (err, userResults) => {
    if (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = userResults[0].id;


  const sql = 'INSERT INTO answers (user_email,q1, q2, q3, q4, q5) VALUES (?,?, ?, ?, ?, ?)';
  db.query(sql,[email,...answers], (err, result) => {
    if (err) {
      console.error('Error inserting answers:', err);
      //return res.status(500).send('Error saving answers');
      return res.status(500).json({ error: 'Error saving answers' });
    }

    const submissionId = userId;
    //const submissionId = userId; // where userId is the id from the users table


    // Insert checklist items  with USER ID (not answers ID)
    const checklistValues = checklist.map(item => [userId, item]);
    const checklistSql = 'INSERT INTO progress_checklist (submission_id, item) VALUES ?';

    db.query(checklistSql, [checklistValues], (err2) => {
      if (err2) {
        console.error('Error inserting checklist:', err2);
        return res.status(500).json({ error: 'Error saving checklist' });

        //return res.status(500).send('Error saving checklist');
      }
     res.status(200).json({ message: 'Submission saved successfully' });

     // res.status(200).json('Submission saved successfully');
    });
  });
});


});

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
