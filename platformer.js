/*
  TO-DO LIST:
    * FIX COLLISION SYSTEM
    * add damage animation to player and have it occur when player is in lava
    * have lava spew lava particles that deal a very small amount of damage
    * allow for saving the game to be possible
    * side-scrolling
*/

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let sWidth = canvas.width;
let sHeight = canvas.height;

const context = canvas.getContext("2d");

let keysHeld = {};

window.addEventListener("keydown", (event) => (keysHeld[event.key] = true));
window.addEventListener("keyup", (event) => delete keysHeld[event.key]);

function isKeyHeld(controlName) {
  return player.controls[controlName].some((x) => keysHeld[x]);
}

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
  if (!player.isDead) {
    player.update();
    player.render();
    waters.forEach((water) => handleSwimming(water, player));
    lavas.forEach((lava) => handleBurning(lava, player));
  }
  player.renderHealthBar();
  platforms.forEach((platform) => platform.render());
  spikes.forEach((spike) => spike.render());
  waters.forEach((water) => water.render());
  lavas.forEach((lava) => lava.render());
  requestAnimationFrame(tick);
}

function handleCollisions(playerX, playerY, platform) {
  if (isInHitbox(playerX, playerY, platform)) {
    // checks for left side of player
    if (player.xVel < 0) {
      player.x = platform.x + platform.width / 2 + player.width / 2;
      player.xVel = 0;
    }
    // checks for right side of player
    if (player.xVel > 0) {
      player.x = platform.x - platform.width / 2 - player.width / 2;
      player.xVel = 0;
    }
    // checks for top side of player
    if (player.yVel < 0) {
      player.y = platform.y + platform.height / 2 + player.height / 2;
      player.yVel = 0;
    }
    // checks for bottom side of player
    if (player.yVel > 0) {
      player.y = platform.y - platform.height / 2 - player.height / 2;
      player.yVel = 0;
      player.isGrounded = true;
    }
  }
}

function handleSwimming(water, player) {
  if (isInHitbox(player.x, player.y, water)) {
    player.gravity = 0;
    player.isGrounded = false;
    let playerSpeed = 1;
    player.yVel = playerSpeed;

    if (isKeyHeld("left")) {
      player.xVel = -playerSpeed;
    }
    if (isKeyHeld("right")) {
      player.xVel = playerSpeed;
    }
    if (isKeyHeld("up")) {
      player.yVel = -playerSpeed;
    }
    if (isKeyHeld("down")) {
      player.yVel = playerSpeed * 2;
    }
  } else {
    player.gravity = 0.625;
  }
}

function handleBurning(lava, player) {
  if (isInHitbox(player.x, player.y, lava)) {
    player.gravity = 0;
    player.isGrounded = false;
    let playerSpeed = 0.375;
    player.yVel = playerSpeed;
    player.health -= 10;

    if (isKeyHeld("left")) {
      player.xVel = -playerSpeed;
    }
    if (isKeyHeld("right")) {
      player.xVel = playerSpeed;
    }
    if (isKeyHeld("up")) {
      player.yVel = -playerSpeed;
    }
    if (isKeyHeld("down")) {
      player.yVel = playerSpeed * 2;
    }
  } else {
    player.gravity = 0.625;
  }
}

let platforms = [
  // base platform
  new Platform(sWidth / 2, sHeight - 125, sWidth, 50),

  // walls
  new Platform(50, sHeight / 2, 10, sHeight),
  new Platform(sWidth - 50, sHeight / 2, 10, sHeight),

  // additional platform
  new Platform(sWidth * 0.25, sHeight - 200, sWidth / 3, 10),
];

let waters = [new Water(sWidth / 3 + 250, sHeight - 500, 375, 750)];

let lavas = [new Lava(2 * (sWidth / 3) + 250, sHeight - 500, 375, 750)];

let spikes = [new Spike(sWidth / 3 + 250, sHeight - 500, 25, 1)];

let player = new Player(
  sWidth / 2,
  sHeight / 2,
  25,
  25,
  {
    left: ["a", "ArrowLeft"],
    right: ["d", "ArrowRight"],
    up: ["w", "ArrowUp"],
    down: ["s", "ArrowDown"],
  },
  "#000000"
);

tick();
