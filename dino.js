const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 1.2;
const JUMP_SPEED = 20;
const OBSTACLE_INTERVAL = 100;
const OBSTACLE_SPEED = 10;

class Dino {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.velY = 0;
        this.jumping = false;
        this.dead = false;
    }

    draw() {
        if (this.dead) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'black';
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(obstacles) {
        if (this.jumping) {
            this.velY += GRAVITY;
        }

        this.y += this.velY;

        // Apply basic collision detection for the floor
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velY = 0;
            this.jumping = false;
        }

        // Check for collision with obstacles
        for (let i = 0; i < obstacles.length; i++) {
            if (this.x + this.width > obstacles[i].x && this.x < obstacles[i].x + obstacles[i].width &&
                this.y + this.height > obstacles[i].y) {
                this.dead = true;
            }
        }
    }

    jump() {
        if (!this.jumping) {
            this.jumping = true;
            this.velY = -JUMP_SPEED;
        }
    }
}

const dino = new Dino(50, canvas.height - 100);

let score = 0;
let obstacles = [];
let obstacleTimer = 0;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dino.update(obstacles);
    dino.draw();

    // Generate new obstacles
    obstacleTimer++;
    if (obstacleTimer === OBSTACLE_INTERVAL) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 50,
            width: 50,
            height: 50,
            speed: OBSTACLE_SPEED
        });
        obstacleTimer = 0;
    }

    // Move obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacles[i].speed;
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            i--;
        }
    }

    // Draw obstacles
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillStyle = 'black';
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }

    // Draw score
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);

    requestAnimationFrame(gameLoop);
}

gameLoop();

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        dino.jump();
    }
});

