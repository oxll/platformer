class Player {
  constructor(x, y, width, height, controls, color) {
    this.x = x;
    this.y = y;
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
    this.swimming = false;
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
  }

  render() {
    context.fillStyle = this.color;
    rect(this.x, this.y, this.width, this.height);
  }
}
