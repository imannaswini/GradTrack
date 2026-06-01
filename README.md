# GradTrack 🎓

GradTrack is a comprehensive career progression and readiness platform designed to help students and recent graduates track job applications, take practice quizzes, monitor skill progress, and prepare for interviews.

## ✨ Features

- **Dashboard**: Get a personalized overview of your placement readiness, skill progress, and recent activity.
- **Authentication**: Secure user signup, signin, and JWT-based session management.
- **Profile Management**: Update your skills, portfolio links (GitHub, LinkedIn), and track your profile completion.
- **Job Applications**: Explore upcoming hiring opportunities and submit job applications directly through the platform.
- **Quizzes & Assessments**: Take practice quizzes (Data Structures, Web Development, Aptitude) and track your scores.
- **Modern UI**: A responsive, glassmorphism-inspired UI built with Bootstrap 5 and custom CSS.

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Bootstrap 5.3
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/imannaswini/GradTrack.git
   cd GradTrack
   ```

2. **Database Setup:**
   - Open your MySQL client or use the provided `localhost.session.sql` file (if available) to set up the database schema.
   - Create a database named `gradtrack`.
   - Update the database credentials (username and password) in `BackEnd/index.js` to match your local MySQL configuration.

3. **Backend Setup:**
   - Navigate to the Backend folder:
     ```bash
     cd BackEnd
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```
   - Start the backend server:
     ```bash
     node index.js
     ```
   - The server will run on `http://127.0.0.1:3000`.

4. **Frontend Setup:**
   - Open the `FrontEnd` directory.
   - Serve the HTML files using an extension like Live Server in VS Code, or simply open `index.html` (or `signin.html`) in your web browser.

## 📁 Project Structure

- `FrontEnd/`: Contains all HTML, CSS, and vanilla JS for the client-side UI.
- `BackEnd/`: Contains the Express.js server (`index.js`), package configuration, and API routes.

## 📄 License

This project is licensed under the ISC License.
