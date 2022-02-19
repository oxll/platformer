class Player {
  constructor(x, y, width, height, controls, color) {
    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.width = width;
    this.height = height;
    this.controls = controls;
    this.color = color;
    this.xVel = 0;
    this.yVel = 0;
    this.glide = 0.5;
    this.maxXVel = 5;
    this.jump = 9;
    this.gravity = 0.625;
    this.terminalVel = 12;
    this.isGrounded = false;
    this.health = 1000;
    this.isDead = false;
  }

  update() {
    if (isKeyHeld("left")) {
      this.xVel -= 0.5;
    }

    if (isKeyHeld("right")) {
      this.xVel += 0.5;
    }

    if (isKeyHeld("up") && this.isGrounded) {
      this.yVel -= this.jump;
    }

    const deaccelerator = this.isGrounded ? 1.25 : 1.125;

    this.isGrounded = false;

    if (this.xVel > this.maxXVel) {
      this.xVel = this.maxXVel;
    } else if (this.xVel < -this.maxXVel) {
      this.xVel = -this.maxXVel;
    }

    if (this.yVel > this.terminalVel) {
      this.yVel = this.terminalVel;
    }

    this.x += this.xVel;

    this.y += this.yVel;

    platforms.forEach((platform) => handleCollisions(this, platform));

    this.xVel /= deaccelerator;

    this.yVel += this.gravity;

    if (this.health <= 0) {
      this.isDead = true;
      setTimeout(() => {
        this.isDead = false;
        this.health = 1000;
        this.x = this.spawnX;
        this.y = this.spawnY;
      }, 2000);
    }

    if (this.health > 1000) {
      this.health = 1000;
    }
  }

  render() {
    context.fillStyle = this.color;
    rect(this.x, this.y, this.width, this.height);
  }

  renderHealthBar() {
    context.fillStyle = `hsl(${this.health * 0.11}, 50%, 37.5%)`;
    context.fillRect(sWidth / 5 - 250, sHeight / 16, 455, 15);
    if (this.isDead) {
      return;
    }
    context.fillStyle = `hsl(${this.health * 0.11}, 75%, 50%)`;
    context.fillRect(
      sWidth / 5 - 247.5,
      sHeight / 16 + 2.5,
      this.health * 0.45,
      10
    );
  }
}
