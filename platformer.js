canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let sWidth = canvas.width;
let sHeight = canvas.height;

const context = canvas.getContext("2d");

const keysHeld = {};

window.addEventListener("keydown", (event) => (keysHeld[event.key] = true));
window.addEventListener("keyup", (event) => delete keysHeld[event.key]);

function rect(x, y, rectWidth, rectHeight) {
  context.fillRect(
    x - rectWidth / 2,
    y - rectHeight / 2,
    rectWidth,
    rectHeight
  );
}

function isColliding(obj1, obj2) {
  return (
    this.x + this.w / 2 > p.x - p.w / 2 &&
    this.x - this.w / 2 < p.x + p.w / 2 &&
    this.y + this.h / 2 > p.y - p.h / 2 &&
    this.y - this.h / 2 < p.y + p.h / 2
  );
}

function tick() {
  context.clearRect(0, 0, sWidth, sHeight);
  genesis.update();
  genesis.render();
  requestAnimationFrame(tick);
}

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
    this.gravity = 0.4;
    this.terminalVel = 12;
    this.isGrounded = false;
    this.swimming = false;
  }

  update() {
    if (keysHeld[this.controls.moveLeft]) {
      this.xVel -= 0.5;
    }

    if (keysHeld[this.controls.moveRight]) {
      this.xVel += 0.5;
    }

    if (keysHeld[this.controls.moveUp] && this.isGrounded) {
      this.yVel -= this.jump;
    }

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

    const deaccelerator = 0.95;

    this.xVel *= deaccelerator;

    this.yVel *= deaccelerator;

    this.yVel += this.gravity;

    if (this.y > sHeight - 100) {
      this.y = sHeight - 100;
      this.yVel = 0;
      this.isGrounded = true;
    }
  }

  render() {
    context.fillStyle = this.color;
    rect(this.x, this.y, this.width, this.height);
  }
}

let genesis = new Player(
  sWidth / 2,
  sHeight / 2,
  25,
  25,
  {
    moveLeft: "ArrowLeft",
    moveRight: "ArrowRight",
    moveUp: "ArrowUp",
    moveDown: "ArrowDown",
  },
  "#000000"
);

tick();
