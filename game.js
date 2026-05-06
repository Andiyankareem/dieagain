// Game Configuration
const CONFIG = {
    GRAVITY: 0.7,
    FRICTION: 0.75,
    PLAYER_SPEED: 4.5,
    JUMP_FORCE: 13,
    TILE_SIZE: 32,
    COLORS: {
        background: '#0a0a0a',
        player: '#00ff00',
        platform: '#1a1a2e',
        hazard: '#ff0044',
        goal: '#00ffff',
        text: '#ffffff',
        uiBackground: 'rgba(0, 0, 0, 0.85)',
        button: '#00ff00',
        buttonHover: '#00cc00',
        fakePlatform: '#ff00ff',
        movingPlatform: '#ffff00',
        disappearingPlatform: '#ff8800'
    }
};

// Game State
const gameState = {
    canvas: null,
    ctx: null,
    player: null,
    platforms: [],
    hazards: [],
    movingPlatforms: [],
    fakePlatforms: [],
    disappearingPlatforms: [],
    currentLevel: 1,
    deathCount: 0,
    isPlaying: false,
    keys: {
        left: false,
        right: false,
        up: false
    },
    levels: [
        {
            platforms: [
                { x: 0, y: 568, width: 800, height: 32 },
                { x: 150, y: 450, width: 80, height: 20 },
                { x: 350, y: 380, width: 80, height: 20 },
                { x: 550, y: 310, width: 80, height: 20 },
                { x: 680, y: 240, width: 80, height: 20 }
            ],
            hazards: [
                { x: 250, y: 548, width: 300, height: 20 },
                { x: 400, y: 360, width: 60, height: 20 },
                { x: 600, y: 290, width: 80, height: 20 }
            ],
            movingPlatforms: [
                { x: 100, y: 500, width: 80, height: 20, speed: 2, range: 150, direction: 1, startX: 100 }
            ],
            fakePlatforms: [
                { x: 250, y: 450, width: 80, height: 20 }
            ],
            disappearingPlatforms: [
                { x: 450, y: 380, width: 80, height: 20, timer: 0, visible: true, disappearTime: 60 }
            ],
            goal: { x: 720, y: 208, width: 32, height: 32 },
            playerStart: { x: 50, y: 500 },
            deathMessage: "Not all platforms are real!"
        },
        {
            platforms: [
                { x: 0, y: 568, width: 200, height: 32 },
                { x: 600, y: 568, width: 200, height: 32 },
                { x: 0, y: 400, width: 100, height: 20 },
                { x: 700, y: 400, width: 100, height: 20 },
                { x: 350, y: 280, width: 100, height: 20 },
                 { x: 570, y: 280, width: 80, height: 20 }
            ],
            hazards: [
                { x: 200, y: 548, width: 400, height: 20 },
                { x: 100, y: 380, width: 200, height: 20 },
                { x: 500, y: 380, width: 200, height: 20 },
                { x: 300, y: 260, width: 200, height: 20 }
            ],
            movingPlatforms: [
                { x: 200, y: 450, width: 80, height: 20, speed: 3, range: 200, direction: 1, startX: 200 },
                { x: 520, y: 450, width: 80, height: 20, speed: 3, range: 200, direction: -1, startX: 520 }
            ],
            fakePlatforms: [
                { x: 150, y: 280, width: 80, height: 20 },
               
            ],
            disappearingPlatforms: [
                { x: 350, y: 200, width: 100, height: 20, timer: 0, visible: true, disappearTime: 45 }
            ],
            goal: { x: 370, y: 148, width: 32, height: 32 },
            playerStart: { x: 50, y: 500 },
            deathMessage: "Trust nothing!"
        },
        {
            platforms: [
                { x: 0, y: 568, width: 150, height: 32 },
                { x: 650, y: 568, width: 150, height: 32 },
                { x: 0, y: 450, width: 80, height: 20 },
                { x: 720, y: 450, width: 80, height: 20 },
                { x: 350, y: 350, width: 100, height: 20 }
            ],
            hazards: [
                { x: 150, y: 548, width: 500, height: 20 },
                { x: 150, y: 430, width: 100, height: 20 },
                { x: 570, y: 430, width: 150, height: 20 },
                { x: 250, y: 330, width: 300, height: 20 },
                { x: 100, y: 200, width: 600, height: 20 }
            ],
            movingPlatforms: [
                { x: 150, y: 500, width: 60, height: 20, speed: 4, range: 250, direction: 1, startX: 150 },
                { x: 590, y: 500, width: 60, height: 20, speed: 4, range: 250, direction: -1, startX: 590 },
                { x: 350, y: 250, width: 100, height: 20, speed: 2, range: 100, direction: 1, startX: 350 }
            ],
            fakePlatforms: [
                { x: 100, y: 350, width: 80, height: 20 },
                { x: 620, y: 350, width: 80, height: 20 },
                { x: 350, y: 150, width: 80, height: 20 }
            ],
            disappearingPlatforms: [
                { x: 200, y: 250, width: 60, height: 20, timer: 0, visible: true, disappearTime: 30 },
                { x: 540, y: 250, width: 60, height: 20, timer: 0, visible: true, disappearTime: 30 }
            ],
            goal: { x: 370, y: 118, width: 32, height: 32 },
            playerStart: { x: 50, y: 500 },
            deathMessage: "ههههههه من كل عقلك؟؟ "
        }
    ]
};

// Player Class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.color = CONFIG.COLORS.player;
    }

    update() {
        // Handle input
        if (gameState.keys.left) {
            this.velocityX = -CONFIG.PLAYER_SPEED;
        }
        if (gameState.keys.right) {
            this.velocityX = CONFIG.PLAYER_SPEED;
        }
        if (gameState.keys.up && !this.isJumping) {
            this.velocityY = -CONFIG.JUMP_FORCE;
            this.isJumping = true;
        }

        // Apply gravity
        this.velocityY += CONFIG.GRAVITY;

        // Apply friction
        this.velocityX *= CONFIG.FRICTION;

        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Boundary check
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > gameState.canvas.width) {
            this.x = gameState.canvas.width - this.width;
        }

        // Check for death by falling
        if (this.y > gameState.canvas.height) {
            playerDeath();
        }
    }

    draw() {
        // Glow effect
        gameState.ctx.shadowBlur = 15;
        gameState.ctx.shadowColor = this.color;

        // Draw player body
        gameState.ctx.fillStyle = this.color;
        gameState.ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw eyes with glow
        gameState.ctx.shadowBlur = 5;
        gameState.ctx.shadowColor = '#ffffff';
        gameState.ctx.fillStyle = '#ffffff';
        gameState.ctx.fillRect(this.x + 6, this.y + 8, 8, 8);
        gameState.ctx.fillRect(this.x + 18, this.y + 8, 8, 8);

        // Draw pupils
        gameState.ctx.shadowBlur = 0;
        gameState.ctx.fillStyle = '#000000';
        gameState.ctx.fillRect(this.x + 8, this.y + 10, 4, 4);
        gameState.ctx.fillRect(this.x + 20, this.y + 10, 4, 4);

        // Reset shadow
        gameState.ctx.shadowBlur = 0;
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = -CONFIG.JUMP_FORCE;
            this.isJumping = true;
        }
    }

    moveLeft() {
        this.velocityX = -CONFIG.PLAYER_SPEED;
    }

    moveRight() {
        this.velocityX = CONFIG.PLAYER_SPEED;
    }
}

// Initialize Game
function initGame() {
    gameState.canvas = document.getElementById('gameCanvas');
    gameState.ctx = gameState.canvas.getContext('2d');

    // Set canvas size
    gameState.canvas.width = 800;
    gameState.canvas.height = 600;

    // Load first level
    loadLevel(1);

    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Load Level
function loadLevel(levelNum) {
    if (levelNum > gameState.levels.length) {
        showGameComplete();
        return;
    }

    gameState.currentLevel = levelNum;
    const levelData = gameState.levels[levelNum - 1];

    // Create player at start position
    gameState.player = new Player(levelData.playerStart.x, levelData.playerStart.y);

    // Set platforms
    gameState.platforms = levelData.platforms || [];

    // Set hazards
    gameState.hazards = levelData.hazards || [];

    // Set moving platforms
    gameState.movingPlatforms = levelData.movingPlatforms ? 
        levelData.movingPlatforms.map(p => ({...p})) : [];

    // Set fake platforms
    gameState.fakePlatforms = levelData.fakePlatforms || [];

    // Set disappearing platforms
    gameState.disappearingPlatforms = levelData.disappearingPlatforms ? 
        levelData.disappearingPlatforms.map(p => ({...p, timer: 0, visible: true})) : [];

    // Update UI
    document.getElementById('current-level').textContent = levelNum;
}

// Game Loop
function gameLoop() {
    if (!gameState.isPlaying) {
        requestAnimationFrame(gameLoop);
        return;
    }

    // Clear canvas with background color
    gameState.ctx.fillStyle = CONFIG.COLORS.background;
    gameState.ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);

    // Update and draw player
    gameState.player.update();
    gameState.player.draw();

    // Update and draw moving platforms
    gameState.movingPlatforms.forEach(platform => {
        // Update position
        platform.x += platform.speed * platform.direction;

        // Check bounds and reverse direction
        if (platform.x > platform.startX + platform.range || 
            platform.x < platform.startX - platform.range) {
            platform.direction *= -1;
        }

        // Draw with glow effect
        gameState.ctx.shadowBlur = 10;
        gameState.ctx.shadowColor = CONFIG.COLORS.movingPlatform;
        gameState.ctx.fillStyle = CONFIG.COLORS.movingPlatform;
        gameState.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Platform border
        gameState.ctx.strokeStyle = '#ffffaa';
        gameState.ctx.lineWidth = 2;
        gameState.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Reset shadow
    gameState.ctx.shadowBlur = 0;

    // Draw fake platforms (look like real but don't collide)
    gameState.fakePlatforms.forEach(platform => {
        // Glow effect
        gameState.ctx.shadowBlur = 10;
        gameState.ctx.shadowColor = CONFIG.COLORS.fakePlatform;
        gameState.ctx.fillStyle = CONFIG.COLORS.fakePlatform;
        gameState.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Platform border
        gameState.ctx.strokeStyle = '#ff66ff';
        gameState.ctx.lineWidth = 2;
        gameState.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Reset shadow
    gameState.ctx.shadowBlur = 0;

    // Update and draw disappearing platforms
    gameState.disappearingPlatforms.forEach(platform => {
        // Update timer
        platform.timer++;

        // Check if should disappear
        if (platform.timer >= platform.disappearTime) {
            platform.visible = !platform.visible;
            platform.timer = 0;
        }

        // Only draw if visible
        if (platform.visible) {
            // Glow effect
            gameState.ctx.shadowBlur = 10;
            gameState.ctx.shadowColor = CONFIG.COLORS.disappearingPlatform;
            gameState.ctx.fillStyle = CONFIG.COLORS.disappearingPlatform;
            gameState.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

            // Platform border
            gameState.ctx.strokeStyle = '#ffaa44';
            gameState.ctx.lineWidth = 2;
            gameState.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

            // Reset shadow
            gameState.ctx.shadowBlur = 0;
        }
    });

    // Draw platforms with neon effect
    gameState.platforms.forEach(platform => {
        // Glow effect
        gameState.ctx.shadowBlur = 10;
        gameState.ctx.shadowColor = CONFIG.COLORS.platform;
        gameState.ctx.fillStyle = CONFIG.COLORS.platform;
        gameState.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        // Platform border
        gameState.ctx.strokeStyle = '#4a4a6e';
        gameState.ctx.lineWidth = 2;
        gameState.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Reset shadow
    gameState.ctx.shadowBlur = 0;

    // Draw hazards with glow effect
    gameState.hazards.forEach(hazard => {
        // Glow effect
        gameState.ctx.shadowBlur = 15;
        gameState.ctx.shadowColor = CONFIG.COLORS.hazard;
        gameState.ctx.fillStyle = CONFIG.COLORS.hazard;

        // Draw spike pattern
        const spikeCount = Math.floor(hazard.width / 10);
        for (let i = 0; i < spikeCount; i++) {
            gameState.ctx.beginPath();
            gameState.ctx.moveTo(hazard.x + i * 10, hazard.y + hazard.height);
            gameState.ctx.lineTo(hazard.x + i * 10 + 5, hazard.y);
            gameState.ctx.lineTo(hazard.x + i * 10 + 10, hazard.y + hazard.height);
            gameState.ctx.closePath();
            gameState.ctx.fill();
        }
    });

    // Reset shadow
    gameState.ctx.shadowBlur = 0;

    // Draw goal with glow effect
    const goal = gameState.levels[gameState.currentLevel - 1].goal;
    gameState.ctx.shadowBlur = 20;
    gameState.ctx.shadowColor = CONFIG.COLORS.goal;
    gameState.ctx.fillStyle = CONFIG.COLORS.goal;
    gameState.ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

    // Reset shadow
    gameState.ctx.shadowBlur = 0;

    // Check collisions
    checkCollisions();

    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Check Collisions
function checkCollisions() {
    const player = gameState.player;

    // Platform collisions
    gameState.platforms.forEach(platform => {
        // Check if player is falling and above platform
        if (player.velocityY > 0 &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.velocityY) {

            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    });

    // Moving platform collisions
    gameState.movingPlatforms.forEach(platform => {
        // Check if player is falling and above platform
        if (player.velocityY > 0 &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.velocityY) {

            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;

            // Move player with platform
            player.x += platform.speed * platform.direction;
        }
    });

    // Disappearing platform collisions (only when visible)
    gameState.disappearingPlatforms.forEach(platform => {
        if (!platform.visible) return;

        // Check if player is falling and above platform
        if (player.velocityY > 0 &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.velocityY) {

            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    });

    // Hazard collisions
    gameState.hazards.forEach(hazard => {
        if (player.x + player.width > hazard.x &&
            player.x < hazard.x + hazard.width &&
            player.y + player.height > hazard.y &&
            player.y < hazard.y + hazard.height) {
            playerDeath();
        }
    });

    // Goal collision
    const goal = gameState.levels[gameState.currentLevel - 1].goal;
    if (player.x + player.width > goal.x &&
        player.x < goal.x + goal.width &&
        player.y + player.height > goal.y &&
        player.y < goal.y + goal.height) {
        levelComplete();
    }
}

// Player Death
function playerDeath() {
    gameState.deathCount++;
    document.getElementById('death-count').textContent = gameState.deathCount;

    const levelData = gameState.levels[gameState.currentLevel - 1];
    document.getElementById('death-message').textContent = levelData.deathMessage;

    showDeathScreen();
}

// Level Complete
function levelComplete() {
    gameState.isPlaying = false;
    document.getElementById('level-complete-screen').classList.remove('hidden');
}

// Show Game Complete
function showGameComplete() {
    gameState.isPlaying = false;
    document.getElementById('final-deaths').textContent = gameState.deathCount;
    document.getElementById('game-complete-screen').classList.remove('hidden');
}

// Show Death Screen
function showDeathScreen() {
    gameState.isPlaying = false;
    document.getElementById('death-screen').classList.remove('hidden');
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (!gameState.isPlaying) return;

    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            gameState.keys.left = true;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            gameState.keys.right = true;
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
            gameState.keys.up = true;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            gameState.keys.left = false;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            gameState.keys.right = false;
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
            gameState.keys.up = false;
            break;
    }
});

// Mobile Controls
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const jumpBtn = document.getElementById('jump-btn');

// Touch events for mobile controls
leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState.isPlaying) {
        gameState.keys.left = true;
    }
});

leftBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    gameState.keys.left = false;
});

rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState.isPlaying) {
        gameState.keys.right = true;
    }
});

rightBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    gameState.keys.right = false;
});

jumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState.isPlaying) {
        gameState.keys.up = true;
    }
});

jumpBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    gameState.keys.up = false;
});

// Mouse events for desktop testing of mobile controls
leftBtn.addEventListener('mousedown', (e) => {
    if (gameState.isPlaying) {
        gameState.keys.left = true;
    }
});

leftBtn.addEventListener('mouseup', (e) => {
    gameState.keys.left = false;
});

rightBtn.addEventListener('mousedown', (e) => {
    if (gameState.isPlaying) {
        gameState.keys.right = true;
    }
});

rightBtn.addEventListener('mouseup', (e) => {
    gameState.keys.right = false;
});

jumpBtn.addEventListener('mousedown', (e) => {
    if (gameState.isPlaying) {
        gameState.keys.up = true;
    }
});

jumpBtn.addEventListener('mouseup', (e) => {
    gameState.keys.up = false;
});

// Start Button
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    gameState.isPlaying = true;
});

// Restart Button
document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('death-screen').classList.add('hidden');
    loadLevel(gameState.currentLevel);
    gameState.isPlaying = true;
});

// Next Level Button
document.getElementById('next-level-btn').addEventListener('click', () => {
    document.getElementById('level-complete-screen').classList.add('hidden');
    loadLevel(gameState.currentLevel + 1);
    gameState.isPlaying = true;
});

// Play Again Button
document.getElementById('play-again-btn').addEventListener('click', () => {
    document.getElementById('game-complete-screen').classList.add('hidden');
    gameState.deathCount = 0;
    document.getElementById('death-count').textContent = 0;
    loadLevel(1);
    gameState.isPlaying = true;
});

// Initialize game when page loads
window.addEventListener('load', initGame);
