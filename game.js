/**
 * Football Game - Gardenscapes Style
 * Puzzle + Idle Mechanics
 */

class FootballGame {
  constructor() {
    this.gameState = {
      level: 1,
      score: 0,
      coins: 0,
      stars: 0,
      moves: 15,
      grid: [],
      selectedTile: null,
      isAnimating: false,
      lastClaim: 0,
      stadiumLevel: 1,
      dailyReward: {
        claimed: false,
        claimTime: 0
      }
    };

    this.config = {
      gridSize: 5,
      tileTypes: ['⚽', '🔵', '🟡', '🟢', '🔴'],
      matchMin: 3,
      moveTime: 300
    };

    this.init();
  }

  init() {
    this.createGrid();
    this.render();
    this.startIdleRewards();
  }

  // Grid yaratma
  createGrid() {
    this.gameState.grid = [];
    for (let i = 0; i < this.config.gridSize; i++) {
      const row = [];
      for (let j = 0; j < this.config.gridSize; j++) {
        row.push({
          type: this.getRandomTile(),
          row: i,
          col: j,
          matched: false
        });
      }
      this.gameState.grid.push(row);
    }
    // İlkin match-ləri təmizlə
    this.removeMatches();
  }

  // Təsadüfi tile seç
  getRandomTile() {
    return this.config.tileTypes[Math.floor(Math.random() * this.config.tileTypes.length)];
  }

  // Tile-ı tıkla
  selectTile(row, col) {
    if (this.gameState.isAnimating || this.gameState.moves <= 0) return;

    const tile = this.gameState.grid[row][col];

    if (!this.gameState.selectedTile) {
      this.gameState.selectedTile = { row, col };
    } else {
      const selected = this.gameState.selectedTile;
      
      // Qonşu tiles mi?
      if (this.isAdjacent(selected, { row, col })) {
        this.swapTiles(selected, { row, col });
      }
      
      this.gameState.selectedTile = null;
    }
    
    this.render();
  }

  // Qonşu olma yoxlaması
  isAdjacent(tile1, tile2) {
    const distance = Math.abs(tile1.row - tile2.row) + Math.abs(tile1.col - tile2.col);
    return distance === 1;
  }

  // Tiles-i dəyişdir
  swapTiles(tile1, tile2) {
    this.gameState.isAnimating = true;

    const temp = this.gameState.grid[tile1.row][tile1.col].type;
    this.gameState.grid[tile1.row][tile1.col].type = this.gameState.grid[tile2.row][tile2.col].type;
    this.gameState.grid[tile2.row][tile2.col].type = temp;

    setTimeout(() => {
      const matchFound = this.removeMatches();
      
      if (matchFound) {
        this.gameState.moves--;
        this.gameState.score += 10 * matchFound;
        this.gameState.coins += matchFound * 5;
        this.fillEmptySpaces();
      } else {
        // Geri dönüş
        const temp = this.gameState.grid[tile1.row][tile1.col].type;
        this.gameState.grid[tile1.row][tile1.col].type = this.gameState.grid[tile2.row][tile2.col].type;
        this.gameState.grid[tile2.row][tile2.col].type = temp;
      }

      this.gameState.isAnimating = false;
      this.render();
      
      if (this.gameState.moves === 0) {
        this.checkLevelComplete();
      }
    }, this.config.moveTime);
  }

  // Match-ləri sil
  removeMatches() {
    let matchCount = 0;

    // Üfüqi match
    for (let i = 0; i < this.config.gridSize; i++) {
      for (let j = 0; j < this.config.gridSize - 2; j++) {
        if (this.gameState.grid[i][j].type === this.gameState.grid[i][j + 1].type &&
            this.gameState.grid[i][j].type === this.gameState.grid[i][j + 2].type) {
          this.gameState.grid[i][j].matched = true;
          this.gameState.grid[i][j + 1].matched = true;
          this.gameState.grid[i][j + 2].matched = true;
          matchCount++;
        }
      }
    }

    // Şaquli match
    for (let i = 0; i < this.config.gridSize - 2; i++) {
      for (let j = 0; j < this.config.gridSize; j++) {
        if (this.gameState.grid[i][j].type === this.gameState.grid[i + 1][j].type &&
            this.gameState.grid[i][j].type === this.gameState.grid[i + 2][j].type) {
          this.gameState.grid[i][j].matched = true;
          this.gameState.grid[i + 1][j].matched = true;
          this.gameState.grid[i + 2][j].matched = true;
          matchCount++;
        }
      }
    }

    // Sətir sil
    for (let i = 0; i < this.config.gridSize; i++) {
      for (let j = 0; j < this.config.gridSize; j++) {
        if (this.gameState.grid[i][j].matched) {
          this.gameState.grid[i][j].type = null;
          this.gameState.grid[i][j].matched = false;
        }
      }
    }

    return matchCount;
  }

  // Boş yerləri doldur
  fillEmptySpaces() {
    for (let j = 0; j < this.config.gridSize; j++) {
      for (let i = this.config.gridSize - 1; i >= 0; i--) {
        if (this.gameState.grid[i][j].type === null) {
          for (let k = i - 1; k >= 0; k--) {
            if (this.gameState.grid[k][j].type !== null) {
              this.gameState.grid[i][j].type = this.gameState.grid[k][j].type;
              this.gameState.grid[k][j].type = null;
              break;
            }
          }
          if (this.gameState.grid[i][j].type === null) {
            this.gameState.grid[i][j].type = this.getRandomTile();
          }
        }
      }
    }
  }

  // Level tamamlandı mı?
  checkLevelComplete() {
    if (this.gameState.score >= 100 * this.gameState.level) {
      this.gameState.stars = Math.min(3, Math.floor(this.gameState.score / (50 * this.gameState.level)));
      this.levelUp();
    } else {
      alert('Level tamamlanmadı! Daha çox xal toplayın.');
      this.resetLevel();
    }
  }

  // Level Artır
  levelUp() {
    this.gameState.level++;
    this.gameState.moves = 15;
    this.gameState.score = 0;
    this.gameState.stadiumLevel += this.gameState.stars;
    alert(`🎉 Level ${this.gameState.level - 1} tamamlandı! ${this.gameState.stars} ⭐ qazandın!`);
    this.createGrid();
  }

  // Leveli sıfırla
  resetLevel() {
    this.gameState.moves = 15;
    this.gameState.score = 0;
    this.createGrid();
  }

  // Idle Rewards (Otomatik Coin)
  startIdleRewards() {
    setInterval(() => {
      const now = Date.now();
      if (now - this.gameState.lastClaim > 5000) { // Hər 5 saniyə
        this.gameState.coins += 1;
        this.gameState.lastClaim = now;
        this.render();
      }
    }, 5000);
  }

  // Daily Reward
  claimDailyReward() {
    const now = Date.now();
    const lastClaimed = this.gameState.dailyReward.claimTime;
    const timePassed = now - lastClaimed;

    if (timePassed > 24 * 60 * 60 * 1000 || lastClaimed === 0) {
      this.gameState.coins += 50;
      this.gameState.dailyReward.claimed = true;
      this.gameState.dailyReward.claimTime = now;
      alert('🎁 50 Coin qazandın!');
    } else {
      const hoursLeft = Math.floor((24 * 60 * 60 * 1000 - timePassed) / (60 * 60 * 1000));
      alert(`⏳ ${hoursLeft} saat sonra yenidən cəhd et!`);
    }

    this.render();
  }

  // Render
  render() {
    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) return;

    gameBoard.innerHTML = '';

    // Game Grid
    const grid = document.createElement('div');
    grid.className = 'game-grid';

    for (let i = 0; i < this.config.gridSize; i++) {
      for (let j = 0; j < this.config.gridSize; j++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = this.gameState.grid[i][j].type;
        tile.onclick = () => this.selectTile(i, j);
        grid.appendChild(tile);
      }
    }

    gameBoard.appendChild(grid);

    // UI Update
    document.getElementById('level').textContent = this.gameState.level;
    document.getElementById('score').textContent = this.gameState.score;
    document.getElementById('coins').textContent = this.gameState.coins;
    document.getElementById('moves').textContent = this.gameState.moves;
    document.getElementById('stadium-level').textContent = this.gameState.stadiumLevel;
  }
}

// Oyun başlat
let game;
window.addEventListener('load', () => {
  game = new FootballGame();
});