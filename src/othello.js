class Othello {
    constructor(rows = 8, cols = 8) {
        this.rows = rows;
        this.cols = cols;
        this.board = this.initializeBoard();
        this.currentPlayer = 'black';
    }

    initializeBoard() {
        const board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
        // 初始化中間四個格子
        const midRow = Math.floor(this.rows / 2);
        const midCol = Math.floor(this.cols / 2);
        board[midRow - 1][midCol - 1] = 'white';
        board[midRow - 1][midCol] = 'black';
        board[midRow][midCol - 1] = 'black';
        board[midRow][midCol] = 'white';
        return board;
    }

    setBoardSize(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = this.initializeBoard();
    }

    isValidMove(row, col) {
        if (this.board[row][col] !== null) return false;
        return this.getFlippableDiscs(row, col, this.currentPlayer).length > 0;
    }

    getFlippableDiscs(row, col, player) {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],  // 垂直和水平
            [-1, -1], [-1, 1], [1, -1], [1, 1] // 對角線
        ];
        const opponent = player === 'black' ? 'white' : 'black';
        let flippableDiscs = [];

        for (let [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            let potentialFlips = [];

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

    placePiece(row, col) {
        if (!this.isValidMove(row, col)) return false;

        const flippableDiscs = this.getFlippableDiscs(row, col, this.currentPlayer);
        this.board[row][col] = this.currentPlayer;
        for (let [x, y] of flippableDiscs) {
            this.board[x][y] = this.currentPlayer;
        }
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        return true;
    }

    getPieceCounts() {
        let black = 0, white = 0;
        for (let row of this.board) {
            for (let cell of row) {
                if (cell === 'black') black++;
                if (cell === 'white') white++;
            }
        }
        return { black, white };
    }

    checkGameOver() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col] === null && (this.isValidMove(row, col))) {
                    return false;
                }
            }
        }
        return true;
    }

    resetGame() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'black';
    }
}

export default Othello;
