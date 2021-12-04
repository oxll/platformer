canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let sWidth = canvas.width;
let sHeight = canvas.height;

const context = canvas.getContext("2d");

const keysHeld = {};

window.addEventListener("keydown", (event) => (keysHeld[event.key] = true));
window.addEventListener("keyup", (event) => delete keysHeld[event.key]);

document.addEventListener("contextmenu", (event) => event.preventDefault());

function rect(x, y, rectWidth, rectHeight) {
  context.fillRect(
    x - rectWidth / 2,
    y - rectHeight / 2,
    rectWidth,
    rectHeight
  );
}

function isCollidingLeft(obj1, obj2) {
  return obj1.x - obj1.width / 2 < obj2.x + obj2.width / 2;
}

function isCollidingRight(obj1, obj2) {
  return obj1.x + obj1.width / 2 > obj2.x - obj2.width / 2;
}

function isCollidingTop(obj1, obj2) {
  return obj1.y - obj1.height / 2 < obj2.y + obj2.height / 2;
}

function isCollidingBottom(obj1, obj2) {
  return obj1.y + obj1.height / 2 > obj2.y - obj2.height / 2;
}

function tick() {
  context.clearRect(0, 0, sWidth, sHeight);
  player.update();
  player.render();
  platform.render();
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
    this.gravity = 0.625;
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

    if (isCollidingLeft(this, platform)) {
      this.xVel = 0;
      this.x = platform.x + platform.width / 2 + this.width / 2;
      console.log(0);
    }

    if (isCollidingRight(this, platform)) {
      this.xVel = 0;
      this.x = platform.x - platform.width / 2 - this.width / 2;
      console.log(1);
    }

    if (isCollidingTop(this, platform)) {
      this.yVel = 0;
      this.y = platform.y + platform.height / 2 + this.height / 2;
      console.log(2);
    }

    if (isCollidingBottom(this, platform)) {
      this.yVel = 0;
      this.y = platform.y - platform.height / 2 - this.height / 2;
      this.isGrounded = true;
      console.log(3);
    }

    this.x += this.xVel;

    this.y += this.yVel;

    this.xVel /= deaccelerator;

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
    console.log(this.x, this.y);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render() {
    context.fillStyle = "#333333";
    rect(this.x, this.y, this.width, this.height);
  }
}

let player = new Player(
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

let platform = new Platform(sWidth / 2, sHeight - 100, sWidth / 2, 20);

tick();
