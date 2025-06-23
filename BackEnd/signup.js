const signupForm = document.getElementById('signup-form');
const msgDiv = document.getElementById('message');

signupForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  fetch('http://127.0.0.1:3000/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Signup successful!') {
        msgDiv.style.color = 'green';
        msgDiv.textContent = data.message;

        setTimeout(() => {
          window.location.href = 'dashboard.html'; // Redirect to dashboard
        }, 1500);
      } else {
        msgDiv.style.color = 'red';
        msgDiv.textContent = data.message || 'Signup failed.';
      }
    })
    .catch(error => {
      console.error('Signup error:', error);
      msgDiv.style.color = 'red';
      msgDiv.textContent = 'An error occurred. Please try again.';
    });
});
