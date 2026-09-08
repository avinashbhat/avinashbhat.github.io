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
// Profile photo proximity. The photo lifts and tilts toward the pointer as it
// gets close, before any hover happens. JS only writes three numbers; the
// transform itself lives in the stylesheet.
document.addEventListener('DOMContentLoaded', function() {
  var frame = document.querySelector('.profile-image');
  if (!frame) return;

  var img = frame.querySelector('img');
  if (!img || !window.matchMedia) return;

  // Pointer proximity is meaningless on touch, and the whole effect is motion
  // for its own sake, so it is skipped when either is true.
  if (!window.matchMedia('(hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var REACH = 110;    // px of empty space around the photo that still counts as "close"
  var MAX_TILT = 9;   // degrees, reached at the photo's own edge

  var pointer = null;
  var queued = false;

  function clamp(n, min, max) {
    return n < min ? min : (n > max ? max : n);
  }

  function reset() {
    frame.style.setProperty('--proximity', '0');
    frame.style.setProperty('--tilt-x', '0');
    frame.style.setProperty('--tilt-y', '0');
  }

  function update() {
    queued = false;
    if (!pointer) return;

    var r = img.getBoundingClientRect();
    if (!r.width || !r.height) return;

    var dx = pointer.x - (r.left + r.width / 2);
    var dy = pointer.y - (r.top + r.height / 2);
    var distance = Math.sqrt(dx * dx + dy * dy);
    var falloff = REACH + Math.max(r.width, r.height) / 2;

    // Squared so the photo stays still until you are genuinely near it, rather
    // than drifting the whole time the pointer is anywhere on the page.
    var near = clamp(1 - distance / falloff, 0, 1);
    var proximity = near * near;

    if (proximity < 0.001) {
      reset();
      return;
    }

    frame.style.setProperty('--proximity', proximity.toFixed(3));

    // Offsets are normalised against the half-width and half-height, so the
    // pointer sitting on an edge gives a full 1 and the whole tilt range is
    // actually reachable. Dividing by the full width caps it at half.
    // The tilt uses the linear falloff rather than the squared one, so it ramps
    // in as you approach instead of only appearing on top of the photo.
    frame.style.setProperty('--tilt-y', (clamp(dx / (r.width / 2), -1, 1) * MAX_TILT * near).toFixed(2));
    frame.style.setProperty('--tilt-x', (clamp(-dy / (r.height / 2), -1, 1) * MAX_TILT * near).toFixed(2));
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('pointermove', function(e) {
    if (e.pointerType === 'touch') return;
    pointer = { x: e.clientX, y: e.clientY };
    schedule();
  }, { passive: true });

  // Scrolling moves the photo under a stationary pointer, so the last known
  // position has to be re-measured against the new layout.
  window.addEventListener('scroll', schedule, { passive: true });

  document.addEventListener('pointerleave', function() {
    pointer = null;
    reset();
  });

  reset();
});
