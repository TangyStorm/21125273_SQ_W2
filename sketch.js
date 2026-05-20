// ============================================================
// Week 2 Example 1: Movement, Gravity, and Collision
// ============================================================

// ------------------------------------------------------------
// IMAGE ASSETS
// ------------------------------------------------------------
let playerImg = null;
let bgImg = null;

// ------------------------------------------------------------
// THE PLAYER OBJECT
// ------------------------------------------------------------
let player = {
  x: 200,
  y: 100,
  vx: 0,
  vy: 0,
  r: 24, 
  speed: 0.5,     
  maxSpeed: 4,    
  jumpForce: -12, 
  friction: 0.8,  
  onGround: false,
};

// ------------------------------------------------------------
// PLATFORM OBJECT
// ------------------------------------------------------------
let platform = {
  x: 300,
  y: 250,
  w: 200,
  h: 20
};

const GRAVITY = 0.6; 
let floorY;

// ============================================================
// setup()
// ============================================================
function setup() {
  createCanvas(800, 450);
  floorY = height - 40;         
  player.y = floorY - player.r; 

  // Load images asynchronously. 
  // If they fail to load, the game will still run using fallbacks.
  loadImage('assets/images/amongus.png', 
    img => playerImg = img, 
    err => console.error('Could not find amongus.png')
  );
  
  loadImage('assets/images/image.png', 
    img => bgImg = img, 
    err => console.error('Could not find image.png')
  );
}

// ============================================================
// draw()
// ============================================================
function draw() {
  // Draw the background image if it has loaded, otherwise use a dark fallback
  if (bgImg) {
    image(bgImg, 0, 0, width, height);
  } else {
    background(10); 
    fill(100);
    textAlign(CENTER);
    text("Background image missing or loading...", width/2, height/2);
  }

  drawFloor();
  drawPlatform();
  handleInput();
  applyPhysics();
  drawPlayer();
  drawHUD();
}

// ------------------------------------------------------------
// handleInput()
// ------------------------------------------------------------
function handleInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { player.vx -= player.speed; }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { player.vx += player.speed; }

  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  if (!keyIsDown(LEFT_ARROW) && !keyIsDown(65) && !keyIsDown(RIGHT_ARROW) && !keyIsDown(68)) {
    player.vx *= player.friction;
  }

  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.onGround) { 
    player.vy = player.jumpForce;
    player.onGround = false;
  }
}

// ------------------------------------------------------------
// applyPhysics()
// ------------------------------------------------------------
function applyPhysics() {
  player.vy += GRAVITY;
  player.x += player.vx;
  player.y += player.vy;

  let onFloor = false;
  let onPlatform = false;

  // Floor collision
  if (player.y + player.r >= floorY) {
    player.y = floorY - player.r; 
    player.vy = 0;                
    onFloor = true;
  }

  // Platform collision
  if (
    player.vy >= 0 && 
    player.x + player.r > platform.x && 
    player.x - player.r < platform.x + platform.w && 
    player.y + player.r >= platform.y && 
    player.y - player.vy + player.r <= platform.y 
  ) {
    player.y = platform.y - player.r; 
    player.vy = 0;
    onPlatform = true;
  }

  if (onFloor || onPlatform) {
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  player.x = constrain(player.x, player.r, width - player.r);
}

// ------------------------------------------------------------
// drawPlayer()
// ------------------------------------------------------------
function drawPlayer() {
  push();
  if (playerImg) {
    // Draw the image if it loaded successfully
    imageMode(CENTER);
    image(playerImg, player.x, player.y, player.r * 2, player.r * 2);
  } else {
    // Fallback shape if the image is missing
    fill(255, 0, 0);
    noStroke();
    ellipse(player.x, player.y, player.r * 2, player.r * 2);
    fill(255);
    textSize(10);
    textAlign(CENTER, CENTER);
    text("Missing\nImage", player.x, player.y);
  }
  pop();
}

// ------------------------------------------------------------
// drawPlatform()
// ------------------------------------------------------------
function drawPlatform() {
  fill(150, 100, 50); 
  stroke(100, 50, 20);
  strokeWeight(2);
  rect(platform.x, platform.y, platform.w, platform.h, 5); 
}

// ------------------------------------------------------------
// drawFloor()
// ------------------------------------------------------------
function drawFloor() {
  fill(40, 120, 110); 
  noStroke();
  rect(0, floorY, width, height - floorY);
}

// ------------------------------------------------------------
// drawHUD()
// ------------------------------------------------------------
function drawHUD() {
  fill(255); 
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text("Move: Arrow Keys or WASD   Jump: W or Up Arrow", 16, 24);
}