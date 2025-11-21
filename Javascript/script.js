const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let running = false;
let ball, paddle1, paddle2, score1 = 0, score2 = 0;

function initGame() {
    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        z: 2,
        vx: 3 * (Math.random() > 0.5 ? 1 : -1),  // horizontal speed, left or right randomly
        vy: 3 * (Math.random() > 0.5 ? 1 : -1),  // vertical speed, up or down randomly
        vz: 0 * (Math.random() > 0.5 ? 1 : -1),
        size: 10
    };
    paddle1 = { x: 4, y: canvas.height / 2 - 40, w: 16, h: 80, z: 1 };
    paddle2 = { x: canvas.width - 20, y: canvas.height / 2 - 40, w: 16, h: 80, z: 1 };
}


function draw3DBall(b) {
    ctx.beginPath();
   ctx.arc(b.x, b.y - Math.abs(b.z * 10), b.size, 0, Math.PI * 2);
    ctx.fillStyle = "white"; // Set ball color to white
    ctx.shadowBlur = 0;      // Remove any shadow effect
    ctx.fill();
    ctx.shadowBlur = 0;     // Restore shadowBlur for paddles if used afterward
}


function drawPaddle(p) {
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#aaa";
    ctx.fillStyle = "white";
    ctx.fillRect(p.x, p.y - Math.abs(p.z * 10), p.w, p.h + p.z * 2);
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw3DBall(ball);
    drawPaddle(paddle1);
    drawPaddle(paddle2);
}

function update() {
  // Bounce on left and right borders
if (ball.x - ball.size < 0 || ball.x + ball.size > canvas.width) {
    ball.vx *= -1;
}

// Bounce on top and bottom borders
if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
    ball.vy *= -1;
}

ball.x += ball.vx;
ball.y += ball.vy;
ball.z += ball.vz;

// Top and bottom wall collisions that keep ball inside
if (ball.y - ball.size < 0) {
    ball.y = ball.size;
    ball.vy *= -1;
}
if (ball.y + ball.size > canvas.height) {
    ball.y = canvas.height - ball.size;
    ball.vy *= -1;
}

    if (!running) return;
    // Ball movement (basic 3d effect with z-axis)
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.z += ball.vz;
    if (ball.z > 2) ball.vz *= -1; // Front wall
    if (ball.z < 0) ball.vz *= -1; // Back wall

    // Top and bottom wall collisions
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) ball.vy *= -1;

    // Paddle collisions
    if (
        ball.x - ball.size < paddle1.x + paddle1.w &&
        ball.y > paddle1.y &&
        ball.y < paddle1.y + paddle1.h
    ) ball.vx *= -1;

    if (
        ball.x + ball.size > paddle2.x &&
        ball.y > paddle2.y &&
        ball.y < paddle2.y + paddle2.h
    ) ball.vx *= -1;

    // Scoring
    if (ball.x < 0) {
        score2++;
        document.getElementById('score2').textContent = score2;
        initGame();
    }
    if (ball.x > canvas.width) {
        score1++;
        document.getElementById('score1').textContent = score1;
        initGame();
    }
    draw();
    requestAnimationFrame(update);
}

// Controls for paddles
document.addEventListener('keydown', (e) => {
    if (e.key === 'w') paddle1.y -= 30;
    if (e.key === 's') paddle1.y += 30;
    if (e.key === 'ArrowUp') paddle2.y -= 30;
    if (e.key === 'ArrowDown') paddle2.y += 30;
});

function startGame() {
    if (!running) {
        running = true;
        update();
    }
}
function pauseGame() {
    running = false;
}
function resetGame() {
    score1 = score2 = 0;
    document.getElementById('score1').textContent = score1;
    document.getElementById('score2').textContent = score2;
    initGame();
    draw();
    running = false;
}

// Initial setup
initGame();
draw();

