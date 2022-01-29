/*
  TO-DO LIST:
    * allow for movement of player via WASD 
    * change lava so that it is slightly translucent
    * fix collision system
    * add ability to swim in lava (but slower compared to in water)
    * add damage animation to player and have it occur when player is in lava
    * decide whether to add health bar, and make it so that damage actually occurs when player is in lava
    * have lava spew lava particles that deal a very small amount of damage
    * make player deaths and respawning possible
    * allow for saving the game to be possible
*/

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let sWidth = canvas.width;
let sHeight = canvas.height;

const context = canvas.getContext("2d");

let keysHeld = {};

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
  waters.forEach((water) => handleSwimming(water, player));
  waters.forEach((water) => water.render());
  lavas.forEach((lava) => handleBurning(lava, player));
  lavas.forEach((lava) => lava.render());
  requestAnimationFrame(tick);
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

function handleSwimming(water, player) {
  if (isInHitbox(player.x, player.y, water)) {
    player.gravity = 0;
    player.isGrounded = false;
    player.yVel = 1;

    let playerSpeed = 1;
    if (keysHeld[player.controls.left]) {
      player.xVel = -playerSpeed;
    }
    if (keysHeld[player.controls.right]) {
      player.xVel = playerSpeed;
    }
    if (keysHeld[player.controls.up]) {
      player.yVel = -playerSpeed;
    }
    if (keysHeld[player.controls.down]) {
      player.yVel = playerSpeed * 2;
    }
  } else {
    player.gravity = 0.625;
  }
}

function handleBurning(lava, player) {
  /*
    update(players) {
    for (var i = 0; i < players.length; i++) {
      if (collide(this, players[i]) && !players[i].dead) {
        players[i].health -= 5;
        screenColor = [255, 0, 0]; // red transparent screen
        transparency = 50;
      }
    }
  }
  */
}

let platforms = [
  // base platform
  new Platform(sWidth / 2, sHeight - 150, sWidth, 10),

  // walls
  new Platform(50, sHeight / 2, 10, sHeight),
  new Platform(sWidth - 50, sHeight / 2, 10, sHeight),

  // additional platform
  new Platform(sWidth * 0.25, sHeight - 200, sWidth / 3, 10),
];

let waters = [new Water(sWidth / 2, sHeight - 200, 50, 50)];

let lavas = [new Lava(sWidth / 2 + 100, sHeight - 200, 50, 50)];

let player = new Player(
  sWidth / 2,
  sHeight / 2,
  25,
  25,
  {
    left: "ArrowLeft",
    right: "ArrowRight",
    up: "ArrowUp",
    down: "ArrowDown",
  },
  "#000000"
);

tick();
