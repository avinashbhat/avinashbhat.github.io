// Pixel Avinash
//
// A sprite that wanders the page, walking or running to random spots and
// stopping to idle, jump or cheer. Drag him out of the way, or click to send
// him away.
//
// Frames are driven from JS rather than CSS keyframes: five animations with
// different lengths and speeds would need five keyframe sets, and the loop that
// moves him is already running.
//
// The sheet is 9 columns x 20 rows of 50x56 frames — five animations, each in
// four directions (north, west, south, east), short ones padded by holding
// their last frame.
(function () {
  if (typeof document === 'undefined') return;

  // Must match background-size in the .walker rule: 900% 2800%.
  var COLS = 9, ROWS = 28;

  // Size comes from the stylesheet's --walker-scale, so there is one number to
  // change and no chance of the CSS box and the JS bounds disagreeing.
  var W = 50, H = 56;

  // row = base + direction, where direction is 0 N, 1 W, 2 S, 3 E
  var ANIMS = {
    walk:  { base: 0,  frames: 9, fps: 9,  loop: true },
    run:   { base: 4,  frames: 8, fps: 13, loop: true },
    idle:  { base: 8,  frames: 2, fps: 2,  loop: true },
    jump:  { base: 12, frames: 5, fps: 9,  loop: false },
    cheer: { base: 16, frames: 3, fps: 5,  loop: false },
    // Only used for dancing: spellcast flings the arms up and wide, thrust is a
    // sharp rhythmic lunge. Neither is a "dance" in the sheet, but strung
    // together on a beat they read as choreography.
    spellcast: { base: 20, frames: 7, fps: 10, loop: true },
    thrust:    { base: 24, frames: 8, fps: 11, loop: true }
  };

  // One move per bar, cycled rather than random: repetition is what makes it
  // look choreographed instead of twitchy.
  var DANCE_MOVES = ['spellcast', 'cheer', 'thrust', 'jump'];
  var BEAT = 0.85;         // seconds per move

  // The vocabulary Claude Code uses while it thinks, plus a few of its cousins.
  var WORDS = [
    'Puttering', 'Marinating', 'Shimmying', 'Percolating', 'Noodling',
    'Simmering', 'Pondering', 'Finagling', 'Wrangling', 'Tinkering',
    'Ruminating', 'Cogitating', 'Schlepping', 'Brewing', 'Churning',
    'Mulling', 'Frolicking', 'Meandering', 'Spelunking', 'Vibing',
    'Whirring', 'Bamboozling', 'Concocting', 'Deliberating', 'Germinating',
    'Kneading', 'Levitating', 'Moseying', 'Orchestrating', 'Pontificating',
    'Reticulating', 'Synthesizing', 'Transmuting', 'Unfurling', 'Zhuzhing',
    'Discombobulating', 'Effervescing', 'Galumphing', 'Hornswoggling', 'Perusing'
  ];

  var DANCE_WORDS = ['Boogieing', 'Grooving', 'Shimmying', 'Busting moves', 'Vibing'];

  var NORTH = 0, WEST = 1, SOUTH = 2, EAST = 3;
  var SPEED = { walk: 42, run: 105 };
  var ARRIVE = 6;          // px from the target that counts as arrived
  var RESTLESS = 0.55;     // chance of running rather than walking

  document.addEventListener('DOMContentLoaded', function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var el = document.createElement('div');
    el.className = 'walker';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'A pixel-art Avinash wandering the page');
    el.setAttribute('title', 'Click to say goodbye');

    // aria-hidden: it is decorative chatter, and a screen reader announcing a
    // new word every few seconds would be miserable.
    var bubble = document.createElement('span');
    bubble.className = 'walker-bubble';
    bubble.setAttribute('aria-hidden', 'true');
    el.appendChild(bubble);

    document.body.appendChild(el);

    // Measured after it is in the document, so the scale set in CSS wins.
    function measure() {
      var box = el.getBoundingClientRect();
      if (box.width) { W = box.width; H = box.height; }
    }
    measure();

    var x = 0, y = 0, tx = 0, ty = 0;
    var facing = SOUTH;
    var anim = 'idle';
    var frame = 0, frameClock = 0;
    var holdFor = 0;         // seconds left in a stationary action
    var moving = false;
    var last = null, running = true;
    var sayFor = 0;          // seconds left on the current speech bubble
    var lastWord = -1;
    var dragging = false;
    var grabX = 0, grabY = 0;   // where inside the sprite he was grabbed
    var dragDistance = 0;       // used to tell a drag from a click
    var dancing = false;
    var danceClock = 0;
    var danceStep = -1;

    function maxX() { return Math.max(0, window.innerWidth - W); }
    function maxY() { return Math.max(0, window.innerHeight - H); }

    function draw() {
      // The sheet is COLS wide and ROWS tall, so each step is one slot along
      // each axis. Percentages are of (image - box), hence the -1 divisors.
      var row = ANIMS[anim].base + facing;
      el.style.backgroundPosition =
        (frame / (COLS - 1)) * 100 + '% ' + (row / (ROWS - 1)) * 100 + '%';
      var move = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      if (dancing) {
        // The transform is written here every frame, so a CSS animation would
        // simply be overwritten; the bounce rides along instead. Kept small,
        // since the sprite's own limbs are now doing the work.
        var beat = (Math.PI * 2) / BEAT;
        var hop = Math.abs(Math.sin(danceClock * beat / 2)) * -5;
        var tilt = Math.sin(danceClock * beat / 2) * 3;
        move += ' translateY(' + hop.toFixed(1) + 'px) rotate(' + tilt.toFixed(1) + 'deg)';
      }
      el.style.transform = move;
    }

    function setAnim(name) {
      if (anim === name) return;
      anim = name;
      frame = 0;
      frameClock = 0;
    }

    // Never the same word twice running, which is what makes a small list feel
    // bigger than it is.
    function say(seconds, list) {
      var words = list || WORDS;
      var i = Math.floor(Math.random() * words.length);
      if (words === WORDS && i === lastWord) i = (i + 1) % words.length;
      if (words === WORDS) lastWord = i;
      bubble.textContent = words[i] + '…';
      bubble.classList.add('is-visible');
      sayFor = seconds;
    }

    function pickTarget() {
      tx = Math.random() * maxX();
      ty = Math.random() * maxY();
      moving = true;
      setAnim(Math.random() < RESTLESS ? 'run' : 'walk');
      if (Math.random() < 0.5) say(2 + Math.random() * 1.5);
    }

    function pickAction() {
      moving = false;
      var roll = Math.random();
      if (roll < 0.2) {
        setAnim('cheer');
        holdFor = 1.2;
      } else if (roll < 0.4) {
        setAnim('jump');
        holdFor = 1.1;
      } else {
        setAnim('idle');
        holdFor = 1.2 + Math.random() * 2.6;
      }
      if (Math.random() < 0.8) say(Math.min(holdFor, 2.6));
    }

    function advanceFrames(dt) {
      var spec = ANIMS[anim];
      frameClock += dt;
      var step = 1 / spec.fps;
      while (frameClock >= step) {
        frameClock -= step;
        if (spec.loop || dancing) {
          frame = (frame + 1) % spec.frames;
        } else if (frame < spec.frames - 1) {
          frame++;
        }
      }
    }

    function move(dt) {
      var dx = tx - x, dy = ty - y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ARRIVE) {
        x = tx; y = ty;
        pickAction();
        return;
      }

      // He can only face four ways, so the larger axis decides which.
      facing = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? EAST : WEST)
        : (dy > 0 ? SOUTH : NORTH);

      var speed = SPEED[anim] || SPEED.walk;
      var travel = Math.min(speed * dt, distance);
      x += (dx / distance) * travel;
      y += (dy / distance) * travel;
    }

    function tick(now) {
      if (!running) return;
      if (last === null) last = now;
      // Clamped so a backgrounded tab can't teleport him on return.
      var dt = Math.min(now - last, 100) / 1000;
      last = now;

      advanceFrames(dt);

      if (sayFor > 0) {
        sayFor -= dt;
        if (sayFor <= 0) bubble.classList.remove('is-visible');
      }

      if (dancing) {
        danceClock += dt;

        // A new move each bar, and a turn each half-bar, so the direction
        // change lands on the off-beat rather than with the move.
        var step = Math.floor(danceClock / BEAT);
        if (step !== danceStep) {
          danceStep = step;
          setAnim(DANCE_MOVES[step % DANCE_MOVES.length]);
        }
        facing = Math.floor(danceClock / (BEAT / 2)) % 2 === 0 ? WEST : EAST;

        if (sayFor <= 0) say(3, DANCE_WORDS);
      } else if (dragging) {
        // Held: he keeps breathing, but the loop doesn't move him.
      } else if (moving) {
        move(dt);
      } else {
        holdFor -= dt;
        if (holdFor <= 0) pickTarget();
      }

      draw();
      requestAnimationFrame(tick);
    }

    function clamp(v, hi) { return v < 0 ? 0 : (v > hi ? hi : v); }

    el.addEventListener('pointerdown', function (e) {
      dragging = true;
      dragDistance = 0;
      grabX = e.clientX - x;
      grabY = e.clientY - y;
      // Keeps the events coming even if the pointer outruns the sprite.
      if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
      el.classList.add('is-held');
      moving = false;
      facing = SOUTH;
      setAnim('idle');
      say(1.6);
      e.preventDefault();
    });

    el.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var nx = clamp(e.clientX - grabX, maxX());
      var ny = clamp(e.clientY - grabY, maxY());
      dragDistance += Math.abs(nx - x) + Math.abs(ny - y);
      x = nx; y = ny;
      draw();
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('is-held');
      if (el.releasePointerCapture && e.pointerId !== undefined) {
        try { el.releasePointerCapture(e.pointerId); } catch (err) {}
      }
      // Carry on from wherever he was dropped.
      pickAction();
    }

    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);

    el.addEventListener('click', function () {
      // A drag ends in a click event too, so only a stationary press dismisses.
      if (dragDistance > 4) return;
      running = false;
      el.classList.add('is-leaving');
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 400);
    });

    window.addEventListener('resize', function () {
      measure();
      x = Math.min(x, maxX()); y = Math.min(y, maxY());
      tx = Math.min(tx, maxX()); ty = Math.min(ty, maxY());
      draw();
    });

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) last = null;
    });

    // Party mode announces itself; he does not need to know how it works.
    document.addEventListener('partymode', function (e) {
      if (e.detail && e.detail.active) {
        dancing = true;
        moving = false;
        danceClock = 0;
        danceStep = -1;
        setAnim(DANCE_MOVES[0]);
        say(9, DANCE_WORDS);
      } else {
        dancing = false;
        el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
        pickAction();
      }
    });

    x = Math.random() * maxX();
    y = maxY();
    pickAction();
    draw();
    requestAnimationFrame(tick);
  });
})();
