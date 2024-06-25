enum Player {
  BLACK = 'black',
  WHITE = 'white'
}

interface IOthello {

  putPiece(row: number, col: number): boolean;
  
  isGameOver(): boolean;
  
  resetGame(): void;

  getPieceCounts(): { black: number; white: number };

}

class Othello implements IOthello {
  rows: number;
  cols: number;
  board: (string | null)[][];
  currentPlayer: Player;

  constructor(rows: number = 8, cols: number = 8) {
    this.rows = rows;
    this.cols = cols;
    this.currentPlayer = Player.BLACK;
    this.board = this.initializeBoard();
  }

  initializeBoard(): (string | null)[][] {
    const board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
    const midRow = Math.floor(this.rows / 2);
    const midCol = Math.floor(this.cols / 2);
    board[midRow - 1][midCol - 1] = 'white';
    board[midRow - 1][midCol] = 'black';
    board[midRow][midCol - 1] = 'black';
    board[midRow][midCol] = 'white';
    return board;
  }

  setBoardSize(rows: number, cols: number): void {
    this.rows = rows;
    this.cols = cols;
    this.board = this.initializeBoard();
  }

  isValidMove(row: number, col: number): boolean {
    if (this.board[row][col] !== null) return false;
    return this.getFlippableDiscs(row, col, this.currentPlayer).length > 0;
  }

  getFlippableDiscs(row: number, col: number, player: Player): number[][] {
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];
    const opponent = player === Player.BLACK ? Player.WHITE : Player.BLACK;
    let flippableDiscs: number[][] = [];

    for (let [dx, dy] of directions) {
      let x = row + dx, y = col + dy;
      let potentialFlips: number[][] = [];

      while (x >= 0 && x < this.rows && y >= 0 && y < this.cols && this.board[x][y] === opponent) {
        potentialFlips.push([x, y]);
        x += dx;
        y += dy;
      }

      if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && this.board[x][y] === player) {
        flippableDiscs = flippableDiscs.concat(potentialFlips);
      }
    }

    return flippableDiscs;
  }

  putPiece(row: number, col: number): boolean {
    if (!this.isValidMove(row, col)) return false;

    const flippableDiscs = this.getFlippableDiscs(row, col, this.currentPlayer);
    this.board[row][col] = this.currentPlayer;
    for (let [x, y] of flippableDiscs) {
      this.board[x][y] = this.currentPlayer;
    }
    this.currentPlayer = this.currentPlayer === Player.BLACK ? Player.WHITE : Player.BLACK;
    return true;
  }

  getPieceCounts(): { black: number; white: number } {
    let black = 0, white = 0;
    for (let row of this.board) {
      for (let cell of row) {
        if (cell === 'black') black++;
        if (cell === 'white') white++;
      }
    }
    return { black, white };
  }

  isGameOver(): boolean {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col] === null && this.isValidMove(row, col)) {
          return false;
        }
      }
    }
    return true;
  }

  resetGame(): void {
    this.board = this.initializeBoard();
    this.currentPlayer = Player.BLACK;
  }

}

export default Othello;
