const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = SETTINGS.width;
canvas.height = SETTINGS.height;

const keys = {};
let frame = 0;
let score = 0;

const player = new Player(200, 200);
const enemies = [];
const missiles = [];

window.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key === " ") {
    player.shoot(missiles, enemies, findNearestEnemy);
  }

  if (e.key === "1") player.mode = "straight";
  if (e.key === "2") player.mode = "soft";
  if (e.key === "3") player.mode = "hard";
  if (e.key === "4") player.mode = "predict";
  if (e.key === "5") player.mode = "split";
});

window.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function spawnEnemy() {
  enemies.push(new Enemy(
    Math.random() * SETTINGS.width,
    -30
  ));
}

function findNearestEnemy() {
  let best = null;
  let dist = Infinity;

  enemies.forEach(e => {
    const d = Math.hypot(e.x - player.x, e.y - player.y);
    if (d < dist) {
      dist = d;
      best = e;
    }
  });

  return best;
}

function updateMissile(m) {
  if (!m.target || m.target.dead) {
    m.target = findNearestEnemy();
  }

  if (!m.target) {
    m.y -= 8;
    return;
  }

  const dx = m.target.x - m.x;
  const dy = m.target.y - m.y;

  if (m.type === "soft") {
    m.x += dx * 0.05;
    m.y += dy * 0.05;
  }

  if (m.type === "hard") {
    m.x += dx * 0.15;
    m.y += dy * 0.15;
  }

  if (m.type === "predict") {
    const fx = m.target.x + m.target.vx * 20;
    const fy = m.target.y;

    m.x += (fx - m.x) * 0.1;
    m.y += (fy - m.y) * 0.1;
  }

  if (m.type === "straight") {
    m.y -= 10;
  }
}

function update() {
  frame++;

  player.update(keys);

  if (frame % SETTINGS.spawnRate === 0) spawnEnemy();

  enemies.forEach(e => e.update(player, missiles));
  missiles.forEach(m => updateMissile(m));

  missiles.forEach(m => {
    enemies.forEach(e => {
      if (
        m.x < e.x + e.w &&
        m.x + m.w > e.x &&
        m.y < e.y + e.h &&
        m.y + m.h > e.y
      ) {
        e.dead = true;
        m.dead = true;
        score += 10;
      }
    });
  });

  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].dead || enemies[i].y > SETTINGS.height) {
      enemies.splice(i, 1);
    }
  }

  for (let i = missiles.length - 1; i >= 0; i--) {
    if (missiles[i].dead) missiles.splice(i, 1);
  }
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, SETTINGS.width, SETTINGS.height);

  player.draw(ctx);

  ctx.fillStyle = "orange";
  enemies.forEach(e => e.draw(ctx));

  ctx.fillStyle = "red";
  missiles.forEach(m => {
    ctx.fillRect(m.x, m.y, m.w, m.h);
  });

  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("Mode: " + player.mode, 20, 60);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
