// Main JavaScript file - combines tabs and theme toggle functionality

// Function to switch to a specific tab
function switchToTab(tabId) {
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

  // Add active class to target button
  var targetButton = document.querySelector('[data-tab="' + tabId + '"]');
  if (targetButton) {
    targetButton.classList.add('active');
  }

  // Add active class to target panel
  var targetPanel = document.getElementById(tabId);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }
}

// Tab functionality - click handler
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('tab-button')) {
    var targetTab = e.target.getAttribute('data-tab');
    switchToTab(targetTab);
    // Update URL hash without scrolling
    history.pushState(null, null, '#' + targetTab);
  }
});

// Handle hash navigation on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check if there's a hash in the URL
  var hash = window.location.hash.substring(1); // Remove the #
  if (hash && document.getElementById(hash)) {
    switchToTab(hash);
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