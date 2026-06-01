document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark/Light Mode)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 2. Determine Current Page and Auth State
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isActive = (page) => currentPage === page ? 'active' : '';
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // 2.5. Route Protection
  const authPages = ['signin.html', 'signup.html', 'frgtpass.html'];
  const isAuthPage = authPages.includes(currentPage);

  if (!isLoggedIn && !isAuthPage) {
    // Redirect unauthenticated users to sign in
    window.location.href = 'signin.html';
    return;
  }

  if (isLoggedIn && isAuthPage) {
    // Redirect authenticated users away from auth pages
    window.location.href = 'index.html';
    return;
  }

  // 3. Inject Layout Framework (Sidebar & Top Header)
  // We'll replace the old 'navbar-container' with our new layout components.
  const navbarContainer = document.getElementById('navbar-container');
  
  if (navbarContainer) {
    // Do not build sidebar for auth pages
    if (isAuthPage) {
      navbarContainer.remove();
      // Ensure main content is full width
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
        mainContent.style.padding = '0';
        mainContent.style.width = '100%';
        mainContent.style.minHeight = '100vh';
      }
    } else {
      // Build Sidebar
    const sidebarHTML = `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <a class="sidebar-brand" href="index.html">
            <div class="brand-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Logo"/>
            </div>
            GradTrack
          </a>
        </div>
        <nav class="sidebar-nav">
          <a href="index.html" class="nav-item ${isActive('index.html')}">
            <i>🏠</i> Dashboard
          </a>
          <a href="jobs.html" class="nav-item ${isActive('jobs.html')}">
            <i>💼</i> Jobs
          </a>
          <a href="quiz.html" class="nav-item ${isActive('quiz.html')}">
            <i>🧠</i> Quizzes
          </a>
          <a href="interview.html" class="nav-item ${isActive('interview.html')}">
            <i>🎯</i> Placement Prep
          </a>
          <a href="res.html" class="nav-item ${isActive('res.html')}">
            <i>📚</i> Resources
          </a>
          <a href="guide.html" class="nav-item ${isActive('guide.html')}">
            <i>🗺️</i> Career Guide
          </a>
          <a href="connect.html" class="nav-item ${isActive('connect.html')}">
            <i>🤝</i> Connect
          </a>
        </nav>
      </aside>
    `;

    // Build Top Header
    let authHeaderHTML = '';
    if (isLoggedIn) {
      authHeaderHTML = `
        <div class="profile-dropdown">
          <div class="profile-btn" id="profileBtn">
            <div class="profile-avatar">👤</div>
            <span>My Profile</span>
            <small>▼</small>
          </div>
          <div class="dropdown-menu-custom" id="profileMenu">
            <a href="profile.html" class="dropdown-item-custom">View Profile</a>
            <a href="#" class="dropdown-item-custom">Settings</a>
            <hr style="border-color: var(--border-color); margin: 0.5rem 0;">
            <a href="#" class="dropdown-item-custom" style="color: var(--danger);" id="logoutBtn">Logout</a>
          </div>
        </div>
      `;
    } else {
      authHeaderHTML = `
        <div class="d-flex gap-2">
          <a href="signin.html" class="btn-outline-custom text-decoration-none">Sign In</a>
          <a href="signup.html" class="btn-primary-custom text-decoration-none">Sign Up</a>
        </div>
      `;
    }

    const topHeaderHTML = `
      <header class="top-header">
        <div class="header-left">
          <button class="menu-toggle" id="menuToggle">☰</button>
        </div>
        <div class="header-right">
          <button class="theme-toggle" id="themeToggle" title="Toggle Theme">
            🌓
          </button>
          ${authHeaderHTML}
        </div>
      </header>
    `;

    // We restructure the DOM to fit the new layout
    // Replace navbarContainer with the sidebar, and create the main-wrapper
    const sidebarWrapper = document.createElement('div');
    sidebarWrapper.innerHTML = sidebarHTML;
    
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'main-wrapper';
    mainWrapper.innerHTML = topHeaderHTML;

    const mainContent = document.createElement('main');
    mainContent.className = 'main-content';

    // Move all siblings after navbarContainer into mainContent
    let sibling = navbarContainer.nextSibling;
    while (sibling) {
      const next = sibling.nextSibling;
      // Skip the footer container as we will handle it separately, or just move it in
      if (sibling.id !== 'footer-container' && sibling.tagName !== 'SCRIPT') {
         mainContent.appendChild(sibling);
      }
      sibling = next;
    }

    mainWrapper.appendChild(mainContent);
    
    // Insert new layout
    document.body.insertBefore(sidebarWrapper.firstElementChild, document.body.firstChild);
    document.body.insertBefore(mainWrapper, document.body.children[1]);
    
    // Remove the old container
    navbarContainer.remove();

    // Event Listeners for the new components
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }

    if (isLoggedIn) {
      const profileBtn = document.getElementById('profileBtn');
      const profileMenu = document.getElementById('profileMenu');
      const logoutBtn = document.getElementById('logoutBtn');

      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        if (profileMenu.classList.contains('show')) {
          profileMenu.classList.remove('show');
        }
      });

      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        window.location.href = "signin.html";
      });
    }
    } // End of !isAuthPage block
  }

  // 4. Inject Footer
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="text-center" style="padding: 2rem; border-top: 1px solid var(--border-color); margin-top: auto;">
        <div class="container">
          <p class="mb-2" style="font-weight: 500; color: var(--text-secondary);">© ${new Date().getFullYear()} GradTrack. All rights reserved.</p>
          <div>
            <a href="index.html" class="text-decoration-none" style="color: var(--text-secondary); margin: 0 10px;">Home</a>
            <a href="connect.html" class="text-decoration-none" style="color: var(--text-secondary); margin: 0 10px;">Contact</a>
          </div>
        </div>
      </footer>
    `;
    // Append footer to mainWrapper if it exists
    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) {
      mainWrapper.appendChild(footerContainer);
    }
  }
});

// Toast Notification System
window.showToast = function(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3500);
};
