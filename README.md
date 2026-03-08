

```markdown
# 🎓 GradTrack – Student Skill Development Platform

GradTrack is a **full-stack career and graduation tracking platform** designed to help students organize their learning journey, track skill development, and discover career opportunities.

The platform allows students to **practice domain-based quizzes, monitor career progress, access learning resources, and apply for opportunities**, all in one place.

---

# 🚀 Key Features

- 👤 User registration and profile management  
- 🧠 Domain-based quizzes with score tracking  
- 📊 Career progress checklist for students  
- 💼 Job / course application submission system  
- 📚 Career guidance and interview preparation resources  
- 🔎 Centralized platform for student skill development  

---

# 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Tools | Git, GitHub, VS Code |

---

# 📂 Project Structure

```

GradTrack
│
├── BackEnd
│   ├── index.js
│   ├── package.json
│   └── routes
│
├── FrontEnd
│   ├── index.html
│   ├── signup.html
│   ├── signin.html
│   ├── dashboard.html
│   ├── quiz.html
│   ├── apply.html
│   └── scripts
│
├── screenshots
└── README.md

```
## 📸 Screenshots

### Dashboard
<img src="https://raw.githubusercontent.com/imannaswini/GradTrack/main/screenshots/dashboard.png" width="900"/>

### Quiz Page
![Quiz Page](https://raw.githubusercontent.com/imannaswini/GradTrack/main/screenshots/quiz-page.png)

# 📖 Overview

GradTrack consists of two main components:

| Component    | Technology              | Role                                                                                   |
| :----------- | :---------------------- | :------------------------------------------------------------------------------------- |
| **Backend**  | Node.js, Express, MySQL | Handles API requests, manages user data, processes quiz scores, and stores submissions |
| **Frontend** | HTML, CSS, JavaScript   | Provides the user interface for registration, quizzes, resources, and applications     |

---

# ⚙️ Backend Setup and Configuration

The backend is built using **Node.js and Express** and manages all data operations.

## Backend Tech Stack

* **Language:** JavaScript (Node.js)
* **Framework:** Express
* **Database:** MySQL
* **Dependencies:** cors, body-parser
* **Development Tool:** nodemon (for auto-restart during development)

---

# 🗄 Database Configuration

1. Ensure a **MySQL server** is running.

2. Create a database:

```
gradtrack
```

3. Configure the database connection inside `BackEnd/index.js`.

Example configuration:

```
Host: localhost
User: root
Password: YOUR_PASSWORD
Database: gradtrack
```

4. Required database tables:

* users
* quiz_scores
* applications
* answers
* progress_checklist

These tables store user data, quiz performance, application forms, and progress tracking information.

---

# ⚙️ Installation and Setup

Clone the repository:

```
git clone https://github.com/imannaswini/GradTrack.git
```

Navigate to backend directory:

```
cd GradTrack/BackEnd
```

Install dependencies:

```
npm install
```

Start the server:

```
nodemon index.js
```

Server will run at:

```
http://127.0.0.1:3000
```

---

# 🔗 API Endpoints

All APIs run on:

```
http://127.0.0.1:3000
```

| Method | Endpoint     | Description                         |
| ------ | ------------ | ----------------------------------- |
| POST   | /api/signup  | Register a new user                 |
| POST   | /submit-quiz | Save quiz score                     |
| POST   | /api/apply   | Submit job/course application       |
| POST   | /api/submit  | Save progress checklist and answers |

---

# 🖼 Frontend Structure

The frontend consists of **multiple static HTML pages** connected with JavaScript and backend APIs.

### Key Pages

* `index.html` – Landing page
* `signup.html` – User registration
* `signin.html` – User login
* `dashboard.html` – User dashboard
* `quiz.html` – Quiz interface
* `apply.html` – Job/course application form
* `jobs.html` – Job listings
* `guide.html` – Career guidance resources
* `interview.html` – Interview preparation content
* `connect.html` – Networking/contact page
* `res.html` – Resume resources

---

# 🔄 Frontend API Communication Example

Example request for user signup:

```javascript
fetch('http://127.0.0.1:3000/api/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

# 🔮 Future Improvements

* JWT authentication system
* AI-based career recommendation engine
* Student progress analytics dashboard
* Resume analyzer integration
* Cloud deployment (AWS / Vercel)

---

# 👩‍💻 Author

**Mannaswini P A**

GitHub: [https://github.com/imannaswini](https://github.com/imannaswini)
LinkedIn: [https://www.linkedin.com/in/mannaswini](https://www.linkedin.com/in/mannaswini)



```
