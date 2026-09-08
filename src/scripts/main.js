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

// Handle hash navigation on page load and on same-page hash links
function switchToHashTab() {
  var hash = window.location.hash.substring(1); // Remove the #
  if (hash && document.getElementById(hash)) {
    switchToTab(hash);
  }
}

document.addEventListener('DOMContentLoaded', switchToHashTab);
window.addEventListener('hashchange', switchToHashTab);

// Content items expand on hover for pointers. Make them reachable by click and
// keyboard too, so the same reveal works on touch and for keyboard users.
document.addEventListener('DOMContentLoaded', function() {
  var items = document.querySelectorAll('.content-item');

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (!item.querySelector('.content-item-details')) continue;
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-expanded', 'false');
  }
});

function toggleItem(item) {
  var open = item.classList.toggle('is-open');
  item.setAttribute('aria-expanded', open ? 'true' : 'false');
}

document.addEventListener('click', function(e) {
  // Let links inside an item do their own job.
  if (e.target.closest && e.target.closest('a')) return;
  var item = e.target.closest && e.target.closest('.content-item');
  if (item && item.hasAttribute('tabindex')) toggleItem(item);
});

document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  var item = e.target.classList && e.target.classList.contains('content-item') ? e.target : null;
  if (!item) return;
  e.preventDefault();
  toggleItem(item);
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
  function applyTheme() {
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
  }

  let themeTransitionTimer = null;

  themeToggle.addEventListener('click', function() {
    // The class enables colour transitions only while the swap is happening,
    // so ordinary rendering is never carrying a transition it doesn't need.
    document.documentElement.classList.add('theme-transition');
    applyTheme();

    clearTimeout(themeTransitionTimer);
    themeTransitionTimer = setTimeout(function() {
      document.documentElement.classList.remove('theme-transition');
    }, 450);
  });
});