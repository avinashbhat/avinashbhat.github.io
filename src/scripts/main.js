// Main JavaScript file - combines tabs and theme toggle functionality

// Tab functionality
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('tab-button')) {
    var targetTab = e.target.getAttribute('data-tab');

    // Remove active class from all buttons
    var buttons = document.querySelectorAll('.tab-button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('active');
    }

    // Remove active class from all panels
    var panels = document.querySelectorAll('.tab-panel');
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.remove('active');
    }

    // Add active class to clicked button
    e.target.classList.add('active');

    // Add active class to target panel
    var targetPanel = document.getElementById(targetTab);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  }
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return; // Exit if no theme toggle on page

  const themeIcon = themeToggle.querySelector('i');

  // Get saved theme from localStorage or default to light
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply saved theme on page load
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
    themeIcon.className = 'fa-solid fa-sun';
  } else {
    document.documentElement.classList.remove('dark-theme');
    themeIcon.className = 'fa-solid fa-moon';
  }

  // Theme toggle click handler
  themeToggle.addEventListener('click', function() {
    const isDark = document.documentElement.classList.contains('dark-theme');

    if (isDark) {
      // Switch to light theme
      document.documentElement.classList.remove('dark-theme');
      themeIcon.className = 'fa-solid fa-moon';
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark theme
      document.documentElement.classList.add('dark-theme');
      themeIcon.className = 'fa-solid fa-sun';
      localStorage.setItem('theme', 'dark');
    }
  });
});