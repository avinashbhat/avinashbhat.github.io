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
    // The same row as spellcast, stopped at frame 5 — the arms are up and wide
    // by then, so it builds into a "look at this" and holds there.
    point:     { base: 20, frames: 6, fps: 10, loop: false },
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

  // How often a finished action turns into a detour to a news item, and how
  // long he holds the pose once he gets there.
  var POINT_CHANCE = 0.5;
  var POINT_HOLD = 3.2;
  var POINT_MAX = 80;      // characters; past this the bubble is a paragraph

  var LAND_WORDS = ['Sticking it', 'Nailed it', 'Ow, knees', 'Superhero landing'];

  var DANCE_WORDS = ['Boogieing', 'Grooving', 'Shimmying', 'Busting moves', 'Vibing'];

  var NORTH = 0, WEST = 1, SOUTH = 2, EAST = 3;
  var SPEED = { walk: 42, run: 105 };
  var ARRIVE = 6;          // px from the target that counts as arrived
  var RESTLESS = 0.55;     // chance of running rather than walking
  // Earth gravity, converted to pixels. He is a person, so his sprite height
  // is one person tall; that gives a pixels-per-metre scale, and 9.81 m/s^2
  // goes through it. Nudge SPRITE_METRES to make him heavier or lighter —
  // a smaller figure means more pixels per metre and a harder fall.
  var G = 9.81;            // m/s^2
  var SPRITE_METRES = 1.75;
  // The landing: a hard stop, a squash, then a slow rise out of the crouch.
  var LAND_HOLD = 0.75;    // seconds held in the crouch before he stands
  var SQUASH_FOR = 0.18;   // seconds of the squash itself
  var SQUASH = 0.45;       // how far he compresses at the moment of impact
  // The held landing pose. Frame 1 of the jump row is the anticipation squat —
  // knees bent, feet planted, arms low — which is the only crouch the sheet
  // has. 0 stands, 2 pushes off, 3 and 4 are airborne.
  var LAND_FRAME = 1;

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

    // The ring of dust under his feet. One element, restarted by taking the
    // class off, forcing a reflow, and putting it back — otherwise the second
    // landing would not replay the animation.
    var shock = document.createElement('span');
    shock.className = 'walker-shock';
    shock.setAttribute('aria-hidden', 'true');
    el.appendChild(shock);

    function shockwave() {
      shock.classList.remove('is-active');
      void shock.offsetWidth;
      shock.classList.add('is-active');
    }

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
    var vy = 0;                 // vertical speed while falling
    var falling = false;
    var downFor = 0;            // seconds left lying on the floor
    var landClock = 0;          // seconds since impact
    var impact = 1;             // 0..1, how fast he was going when he hit
    var heading = null;         // the news item he is walking towards
    var noticed = null;         // the news item he is pointing at
    var lockFrame = -1;         // held frame, or -1 to animate normally
    var dancing = false;
    var danceClock = 0;
    var danceStep = -1;

    function maxX() { return Math.max(0, window.innerWidth - W); }
    // The floor. He only ever rests here; a drag can lift him off it, gravity
    // puts him back.
    function maxY() { return Math.max(0, window.innerHeight - H); }

    function draw() {
      // The sheet is COLS wide and ROWS tall, so each step is one slot along
      // each axis. Percentages are of (image - box), hence the -1 divisors.
      var row = ANIMS[anim].base + facing;
      el.style.backgroundPosition =
        (frame / (COLS - 1)) * 100 + '% ' + (row / (ROWS - 1)) * 100 + '%';
      var move = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      if (landClock > 0 && landClock < SQUASH_FOR) {
        // Squash and stretch: he compresses into the floor on contact and
        // springs back out of it. transform-origin is his feet, so the
        // compression happens downward instead of around his waist.
        var t = landClock / SQUASH_FOR;
        var give = SQUASH * impact * (1 - t) * (1 - t);
        move += ' scale(' + (1 + give * 0.6).toFixed(3) + ',' + (1 - give).toFixed(3) + ')';
      }
      if (dancing) {
        // The transform is written here every frame, so a CSS animation would
        // simply be overwritten; the bounce rides along instead. Kept small,
        // since the sprite's own limbs are now doing the work.
        var beat = (Math.PI * 2) / BEAT;
        var hop = Math.abs(Math.sin(danceClock * beat / 2)) * -5;
        var sway = Math.sin(danceClock * beat / 2) * 3;
        move += ' translateY(' + hop.toFixed(1) + 'px) rotate(' + sway.toFixed(1) + 'deg)';
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
      speak(seconds, words[i] + '…', false);
    }

    // Split out so a news headline, which is neither random nor short, can go
    // through the same bubble.
    function speak(seconds, text, wide) {
      bubble.textContent = text;
      bubble.classList.toggle('is-wide', !!wide);
      bubble.classList.add('is-visible');
      sayFor = seconds;
    }

    // Only the news tab, only while it is the open one, and only items actually
    // on screen: he stands on the viewport floor, so an item scrolled out of
    // sight is one he would be pointing through.
    function visibleNews() {
      var items = document.querySelectorAll('#news.active .content-item');
      var out = [];
      for (var i = 0; i < items.length; i++) {
        var r = items[i].getBoundingClientRect();
        if (r.height && r.top < window.innerHeight - H && r.bottom > 0) out.push(items[i]);
      }
      return out;
    }

    function forgetNews() {
      if (!noticed) return;
      noticed.classList.remove('is-noticed');
      noticed = null;
    }

    // Walks to stand under the item rather than pointing from across the page,
    // which only reads as pointing at the whole column.
    function pickNews() {
      var list = visibleNews();
      if (!list.length) return false;
      var item = list[Math.floor(Math.random() * list.length)];
      var r = item.getBoundingClientRect();
      forgetNews();
      heading = item;
      tx = clamp(r.left + r.width / 2 - W / 2, maxX());
      ty = maxY();
      moving = true;
      setAnim('walk');
      return true;
    }

    // He is already pointing at the item, so the bubble does not need to say
    // that he is — it says the title verbatim. The title exists only to be
    // spoken and is rendered nowhere, so nothing here trims it to taste;
    // POINT_MAX is a guard against one long enough to tile the page, not an
    // editor.
    function headline(item) {
      // data-headline is the news title, which the list no longer renders;
      // the other lists still show a preview line, so that is the fallback.
      var el = item.querySelector('.content-item-preview');
      var text = item.getAttribute('data-headline') ||
        (el ? el.textContent : 'This one');
      text = text.trim().replace(/\s+/g, ' ');
      if (text.length > POINT_MAX) text = text.slice(0, POINT_MAX - 1).trim() + '…';
      return text;
    }

    function startPoint() {
      moving = false;
      noticed = heading;
      heading = null;
      noticed.classList.add('is-noticed');
      facing = NORTH;
      setAnim('point');
      holdFor = POINT_HOLD;
      speak(POINT_HOLD, headline(noticed), true);
    }

    function pickTarget() {
      forgetNews();
      if (Math.random() < POINT_CHANCE && pickNews()) return;
      tx = Math.random() * maxX();
      ty = maxY();
      heading = null;
      moving = true;
      setAnim(Math.random() < RESTLESS ? 'run' : 'walk');
      if (Math.random() < 0.5) say(2 + Math.random() * 1.5);
    }

    function pickAction() {
      moving = false;
      heading = null;
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
      if (lockFrame >= 0) { frame = lockFrame; return; }
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
        if (heading) startPoint(); else pickAction();
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
      } else if (falling) {
        vy += (G * (H / SPRITE_METRES)) * dt;
        y += vy * dt;
        if (y >= maxY()) {
          y = maxY();
          falling = false;
          // How hard he hit, as a fraction of a fall from the top of the
          // viewport. A short drop gets a small squash.
          impact = Math.min(1, vy / Math.sqrt(2 * G * (H / SPRITE_METRES) * maxY()));
          landClock = 0.0001;
          downFor = LAND_HOLD;
          facing = SOUTH;
          lockFrame = LAND_FRAME;
          shockwave();
          say(1.4, LAND_WORDS);
        }
      } else if (downFor > 0) {
        // The crouch is held long enough to be a pose rather than a stumble;
        // the rise out of it is the rest of the jump animation playing on.
        landClock += dt;
        downFor -= dt;
        if (downFor <= 0) {
          landClock = 0;
          lockFrame = -1;
          setAnim('idle');
          frame = 0;
          holdFor = 0.5;
        }
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
      forgetNews();
      heading = null;
      falling = false;
      downFor = 0;
      landClock = 0;
      lockFrame = -1;
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
      // Dropped in mid-air he falls; dropped on the floor he carries on.
      if (y < maxY() - 1) {
        falling = true;
        vy = 0;
        facing = SOUTH;
        setAnim('jump');
      } else {
        pickAction();
      }
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
      x = Math.min(x, maxX());
      if (!dragging && !falling) y = maxY();
      tx = Math.min(tx, maxX()); ty = maxY();
      draw();
    });

    // The item moves under him when the page scrolls, so the gesture stops
    // meaning anything; he gives up on it rather than pointing at empty space.
    window.addEventListener('scroll', function () {
      if (!noticed && !heading) return;
      forgetNews();
      heading = null;
      if (!moving) holdFor = 0;
    }, { passive: true });

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
