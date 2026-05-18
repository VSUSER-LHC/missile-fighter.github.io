class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.w = 30;
    this.h = 30;

    this.vx = (Math.random() - 0.5) * 3;
    this.vy = 1.5;

    this.state = "approach";
  }

  update(player, missiles) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 150) this.state = "evade";
    else if (dist < 300) this.state = "attack";
    else this.state = "approach";

    if (this.state === "approach") {
      this.vy = 1.5;
      this.vx += (Math.random() - 0.5) * 0.3;
    }

    if (this.state === "attack") {
      this.vx += dx * 0.01;
      this.vy = 1.2;
    }

    if (this.state === "evade") {
      missiles.forEach(m => {
        const md = Math.hypot(m.x - this.x, m.y - this.y);
        if (md < 120) {
          this.vx -= (m.x - this.x) * 0.02;
        }
      });

      this.vx -= dx * 0.01;
      this.vy = 2.5;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > SETTINGS.width) this.vx *= -1;
  }

  draw(ctx) {
    ctx.fillStyle = "orange";

    ctx.beginPath();
    ctx.moveTo(this.x + this.w / 2, this.y + this.h);
    ctx.lineTo(this.x, this.y);
    ctx.lineTo(this.x + this.w / 2, this.y + this.h * 0.3);
    ctx.lineTo(this.x + this.w, this.y);
    ctx.closePath();
    ctx.fill();
  }
}
