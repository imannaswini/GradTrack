#  GradTrack: Career and Graduation Tracking Application

GradTrack is a comprehensive application designed to help users manage and track their progress toward career goals, graduation requirements, and job applications. It consists of a robust Node.js backend and a multi-page HTML/JavaScript frontend.

##  Overview

The application is split into two main components:

| Component | Technology | Role |
| :--- | :--- | :--- |
| **BackEnd** | Node.js, Express, MySQL | Manages user data, handles authentication, processes quiz scores, and stores application/progress submissions. |
| **FrontEnd** | HTML, Vanilla JavaScript | Provides the user interface for registration, navigating resources, taking quizzes, and submitting forms. |

-----

## I. ⚙️ Backend Setup and Configuration

The backend is an Express server responsible for all data operations.

### Tech Stack

  * **Language**: JavaScript (Node.js)
  * **Framework**: Express (`express@^5.1.0`)
  * **Database**: MySQL (`mysql2@^3.14.1`)
  * **Dependencies**: `cors`, `body-parser`
  * **Dev Tool**: `nodemon` (`^3.1.10`) for live reloading during development.

### Database Configuration

1.  Ensure a MySQL server is running.
2.  Create a database named `gradtrack`.
3.  The backend is configured to connect with the following default credentials in `BackEnd/index.js`:
      * **Host**: `localhost`
      * **User**: `root`
      * **Password**: `Mannas24`
      * **Database**: `gradtrack`
4.  The application requires the following tables in the `gradtrack` schema: `users`, `quiz_scores`, `applications`, `answers`, and `progress_checklist` to support all API routes.

### Installation and Start

1.  Navigate to the `BackEnd` directory.
2.  Install dependencies:
    ```bash
    cd BackEnd
    npm install
    ```
3.  Start the server (using nodemon for development):
    ```bash
    nodemon index.js
    ```

The server runs on port `3000` (`http://127.0.0.1:3000`).

### API Endpoints

All API endpoints are accessible via `http://127.0.0.1:3000`.

| Method | Endpoint | Description | Request Body Parameters |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/signup` | Registers a new user. | `name`, `email`, `password` |
| **POST** | `/submit-quiz` | Records a user's quiz score. | `user_email`, `domain_name`, `score`, `total_questions` |
| **POST** | `/api/apply` | Submits a job/course application form. | `name`, `email`, `phone`, `dob`, `college`, `resume` (link), `message` |
| **POST** | `/api/submit` | Saves user answers and checklist items for goal tracking. | `email`, `checklist` (array of strings), `answers` (array of 5 strings for Q1-Q5) |

-----

## II. 🖼️ Frontend Structure

The frontend is a collection of static HTML pages with client-side JavaScript for interactivity and communication with the backend.

### Tech Stack

  * **Markup**: HTML
  * **Scripting**: Vanilla JavaScript (uses `fetch` for API calls)

### Key Pages

The project structure implies the following core user flow pages (all assumed to be within a `FrontEnd` directory):

  * **`index.html`** / **`index1.html`**: Landing or main entry points.
  * **`signup.html`**: User registration form.
  * **`signin.html`**: User login interface.
  * **`dashboard.html`** / **`profile.html`**: The main user area after a successful login.
  * **`quiz.html`**: Interface for users to attempt quizzes.
  * **`apply.html`**: The job/course application form interface.
  * **`jobs.html`**: Likely a listing of job opportunities.
  * **`guide.html`**: Career guidance or resource center.
  * **`interview.html`**: Interview preparation resources.
  * **`connect.html`**: Networking or support contact page.
  * **`res.html`**: Resume-related resources.

### Frontend API Communication Example

The `signup.js` script handles user registration by sending a `POST` request to the backend:

```javascript
fetch('http://127.0.0.1:3000/api/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password })
})
// ...handles response and redirects to dashboard.html on success.
```
