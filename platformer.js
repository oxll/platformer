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

function isInHitbox(x, y, hitbox) {
  return (
    x > hitbox.x - hitbox.width / 2 &&
    x < hitbox.x + hitbox.width / 2 &&
    y > hitbox.y - hitbox.height / 2 &&
    y < hitbox.y + hitbox.height / 2
  );
}

function checkSide(staticValue, dynamicValue, isYStatic, hitbox) {
  const SPACING = player.width * 0.3;
  let points = [
    [staticValue, dynamicValue],
    [staticValue, dynamicValue + SPACING],
    [staticValue, dynamicValue - SPACING],
  ];

  if (isYStatic) {
    points = points.map((point) => point.reverse());
  }

  return points.some((point) => isInHitbox(...point, hitbox));
}

function tick() {
  context.clearRect(0, 0, sWidth, sHeight);
  player.update();
  player.render();
  platforms.forEach((platform) => platform.render());

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

    platforms.forEach((platform) => handleCollisions(this, platform));

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

function handleCollisions(player, platform) {
  // checks left
  if (checkSide(player.x - player.width / 2, player.y, false, platform)) {
    player.x = platform.x + platform.width / 2 + player.width / 2;
    player.xVel = 0;
  }
  // checks right
  if (checkSide(player.x + player.width / 2, player.y, false, platform)) {
    player.x = platform.x - platform.width / 2 - player.width / 2;
    player.xVel = 0;
  }
  // checks top
  if (checkSide(player.y - player.height / 2, player.x, true, platform)) {
    player.y = platform.y + platform.height / 2 + player.height / 2;
    player.yVel = 0;
  }
  // checks bottom
  if (checkSide(player.y + player.height / 2, player.x, true, platform)) {
    player.y = platform.y - platform.height / 2 - player.height / 2;
    player.yVel = 0;
    player.isGrounded = true;
  }
}

var platforms = [
  new Platform(sWidth / 2, sHeight - 150, sWidth / 2, 50),
  new Platform(sWidth * 0.25, sHeight - 200, sWidth / 3, 10),
];

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

tick();
