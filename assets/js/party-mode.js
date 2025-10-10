// Party Mode Easter Egg
(function() {
  let typedKeys = '';
  let partyModeActive = false;
  let strobeInterval = null;
  let discoBall = null;

  // Listen for keypress to detect "party"
  document.addEventListener('keydown', function(e) {
    // Only listen if party mode is not already active
    if (partyModeActive) return;

    // Add the key to our typed string
    typedKeys += e.key.toLowerCase();

    // Keep only the last 5 characters
    if (typedKeys.length > 5) {
      typedKeys = typedKeys.slice(-5);
    }

    // Check if "party" was typed
    if (typedKeys === 'party') {
      activatePartyMode();
      typedKeys = ''; // Reset
    }
  });

  function activatePartyMode() {
    partyModeActive = true;

    // Start strobe effect
    startStrobeEffect();

    // Drop disco ball
    createDiscoBall();

    // Trigger confetti after disco ball descends
    setTimeout(function() {
      triggerConfetti();
    }, 1500);

    // Auto-deactivate after 10 seconds
    setTimeout(function() {
      deactivatePartyMode();
    }, 10000);
  }

  function startStrobeEffect() {
    const colors = [
      '#FF006E', // Hot Pink
      '#8338EC', // Purple
      '#3A86FF', // Blue
      '#FFBE0B', // Yellow
      '#FB5607', // Orange
      '#06FFA5', // Mint
    ];

    let colorIndex = 0;
    const originalBg = document.body.style.backgroundColor;

    strobeInterval = setInterval(function() {
      document.body.style.backgroundColor = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length;
    }, 200);

    // Store original background to restore later
    document.body.dataset.originalBg = originalBg || '';
  }

  function createDiscoBall() {
    // Create chain/line
    const chain = document.createElement('div');
    chain.id = 'disco-chain';
    chain.style.cssText = `
      position: fixed;
      top: -250px;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 200px;
      background: linear-gradient(to bottom, #888, #555);
      box-shadow: 0 0 5px rgba(255,255,255,0.3);
      z-index: 9999;
      pointer-events: none;
    `;

    // Create the disco ball wrapper
    const ballWrapper = document.createElement('div');
    ballWrapper.id = 'disco-ball-wrapper';
    ballWrapper.style.cssText = `
      position: fixed;
      top: -50px;
      left: 50%;
      margin-left: -50px;
      width: 100px;
      height: 100px;
      z-index: 9999;
      pointer-events: none;
      perspective: 1000px;
      background: transparent;
    `;

    // Animate them down together
    setTimeout(function() {
      chain.style.transition = 'top 1.5s ease-out';
      chain.style.top = '0px';
      ballWrapper.style.transition = 'top 1.5s ease-out';
      ballWrapper.style.top = '200px';
    }, 10);

    // Create the 3D disco ball element
    discoBall = document.createElement('div');
    discoBall.id = 'discoBall';
    discoBall.style.cssText = `
      transform-style: preserve-3d;
      width: 100px;
      height: 100px;
      position: absolute;
      animation: rotateDiscoBall 8s linear infinite;
    `;

    // Create disco ball light effect
    const light = document.createElement('div');
    light.style.cssText = `
      width: 100px;
      height: 100px;
      position: absolute;
      border-radius: 100%;
      background-color: white;
      opacity: 0.2;
      filter: blur(20px);
    `;

    // Create the middle sphere
    const middle = document.createElement('div');
    middle.id = 'discoBallMiddle';
    middle.style.cssText = `
      width: 100px;
      height: 100px;
      border-radius: 100%;
      background: transparent;
      position: absolute;
      animation: rotateDiscoBallMiddle 8s linear infinite;
    `;

    // Generate mirror tiles
    var radius = 50;
    var squareSize = 6.5;
    var prec = 19.55;
    var fuzzy = 0.001;
    var inc = (Math.PI - fuzzy) / prec;

    for (var t = fuzzy; t < Math.PI; t += inc) {
      var z = radius * Math.cos(t);
      var currentRadius = Math.abs((radius * Math.cos(0) * Math.sin(t)) - (radius * Math.cos(Math.PI) * Math.sin(t))) / 2.5;
      var circumference = Math.abs(2 * Math.PI * currentRadius);
      var squaresThatFit = Math.floor(circumference / squareSize);
      var angleInc = (Math.PI * 2 - fuzzy) / squaresThatFit;

      for (var i = angleInc / 2 + fuzzy; i < (Math.PI * 2); i += angleInc) {
        var square = document.createElement('div');
        var squareTile = document.createElement('div');

        squareTile.style.width = squareSize + 'px';
        squareTile.style.height = squareSize + 'px';
        squareTile.style.transformOrigin = '0 0 0';
        squareTile.style.transform = 'rotate(' + i + 'rad) rotateY(' + t + 'rad)';

        if ((t > 1.3 && t < 1.9) || (t < -1.3 && t > -1.9)) {
          squareTile.style.backgroundColor = randomColor('bright');
        } else {
          squareTile.style.backgroundColor = randomColor('any');
        }

        square.appendChild(squareTile);
        square.className = 'square';
        square.style.cssText = `
          transform-style: preserve-3d;
          position: absolute;
          top: 50px;
          left: 50px;
          width: 6px;
          height: 6px;
        `;

        squareTile.style.animation = 'reflect 2s linear infinite';
        squareTile.style.animationDelay = String(randomNumber(0, 20) / 10) + 's';
        squareTile.style.backfaceVisibility = 'hidden';

        var x = radius * Math.cos(i) * Math.sin(t);
        var y = radius * Math.sin(i) * Math.sin(t);

        square.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(' + z + 'px)';
        discoBall.appendChild(square);
      }
    }

    // Add animation keyframes
    if (!document.getElementById('party-mode-styles')) {
      const style = document.createElement('style');
      style.id = 'party-mode-styles';
      style.textContent = `
        @keyframes rotateDiscoBall {
          0% { transform: rotateX(90deg) rotateZ(0deg) rotate(0deg); }
          100% { transform: rotateX(90deg) rotateZ(360deg) rotate(0deg); }
        }

        @keyframes rotateDiscoBallMiddle {
          0% { transform: rotateX(90deg) rotateY(0deg) rotate(0deg); }
          100% { transform: rotateX(90deg) rotateY(-360deg) rotate(0deg); }
        }

        @keyframes reflect {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    ballWrapper.appendChild(light);
    ballWrapper.appendChild(middle);
    ballWrapper.appendChild(discoBall);
    document.body.appendChild(chain);
    document.body.appendChild(ballWrapper);

    // Store references for cleanup
    discoBall.ballWrapper = ballWrapper;
    discoBall.chain = chain;
  }

  function randomColor(type) {
    var c;
    if (type == 'bright') {
      c = randomNumber(130, 255);
    } else {
      c = randomNumber(110, 190);
    }
    return 'rgb(' + c + ',' + c + ',' + c + ')';
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function triggerConfetti() {
    // Load confetti library dynamically
    if (typeof confetti === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
      script.onload = function() {
        launchConfetti();
      };
      document.head.appendChild(script);
    } else {
      launchConfetti();
    }
  }

  function launchConfetti() {
    // Multiple confetti bursts
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from different positions
      confetti(Object.assign({}, defaults, {
        particleCount: particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount: particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  }

  function deactivatePartyMode() {
    // Stop strobe
    if (strobeInterval) {
      clearInterval(strobeInterval);
      strobeInterval = null;
    }

    // Restore original background
    const originalBg = document.body.dataset.originalBg || '';
    document.body.style.backgroundColor = originalBg;

    // Remove disco ball, wrapper, and chain
    if (discoBall) {
      const wrapper = discoBall.ballWrapper;
      const chain = discoBall.chain;

      if (wrapper) {
        wrapper.style.transition = 'all 0.5s ease-in';
        wrapper.style.opacity = '0';
        wrapper.style.top = '-300px';

        setTimeout(function() {
          if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
          }
        }, 500);
      }

      if (chain) {
        chain.style.transition = 'all 0.5s ease-in';
        chain.style.opacity = '0';
        chain.style.top = '-400px';

        setTimeout(function() {
          if (chain && chain.parentNode) {
            chain.parentNode.removeChild(chain);
          }
        }, 500);
      }

      discoBall = null;
    }

    partyModeActive = false;
  }

  // Allow manual deactivation with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && partyModeActive) {
      deactivatePartyMode();
    }
  });
})();
