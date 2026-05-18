class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.w = 40;
    this.h = 40;

    this.vx = 0;
    this.vy = 0;

    this.acc = 0.4;
    this.friction = 0.92;

    this.mode = "soft";

    this.cooldown = 0;
  }

  update(keys) {
    if (keys["ArrowLeft"]) this.vx -= this.acc;
    if (keys["ArrowRight"]) this.vx += this.acc;
    if (keys["ArrowUp"]) this.vy -= this.acc;
    if (keys["ArrowDown"]) this.vy += this.acc;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    this.x = Math.max(0, Math.min(SETTINGS.width - this.w, this.x));
    this.y = Math.max(0, Math.min(SETTINGS.height - this.h, this.y));

    if (this.cooldown > 0) this.cooldown--;
  }

  shoot(missiles, enemies, findTarget) {
    if (this.cooldown > 0) return;

    missiles.push({
      x: this.x + this.w / 2,
      y: this.y,
      w: 6,
      h: 12,
      type: this.mode,
      target: findTarget(),
      vx: 0,
      vy: -8
    });

    this.cooldown = 15;
  }

  draw(ctx) {
    ctx.fillStyle = "cyan";

    ctx.beginPath();
    ctx.moveTo(this.x + this.w / 2, this.y);
    ctx.lineTo(this.x, this.y + this.h);
    ctx.lineTo(this.x + this.w / 2, this.y + this.h * 0.7);
    ctx.lineTo(this.x + this.w, this.y + this.h);
    ctx.closePath();
    ctx.fill();
  }
}
