import { Player, Piece } from './othello_rules';
export function getOthelloCore(rows, cols) {
    return new DefaultOthelloCore(rows, cols);
}
const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
];
class DefaultOthelloCore {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    isLegalMove(row, col, board, player) {
        if (!this.isPlaceable(row, col, board)) {
            return false;
        }
        const piece = player === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;
        const opponent = player === Player.BLACK_PLAYER ? Piece.WHITE : Piece.BLACK;
        return directions.some(([dx, dy]) => {
            let x = row + dx;
            let y = col + dy;
            let hasOpponentPiece = false;
            while (x >= 0 && x < this.rows && y >= 0 && y < this.cols && board[x][y] === opponent) {
                hasOpponentPiece = true;
                x += dx;
                y += dy;
            }
            return hasOpponentPiece && x >= 0 && x < this.rows && y >= 0 && y < this.cols && board[x][y] === piece;
        });
    }
    playerMoveableCounts(player, board) {
        let counts = 0;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (this.isLegalMove(row, col, board, player)) {
                    counts += 1;
                }
            }
        }
        return counts;
    }
    isPlaceable(row, col, board) {
        return board[row][col] === null;
    }
    getFlippableDiscs(player, row, col, board) {
        const opponentPiece = player === Player.BLACK_PLAYER ? Piece.WHITE : Piece.BLACK;
        let flippableDiscs = [];
        for (let [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            let potentialFlips = [];
            while (x >= 0 && x < this.rows && y >= 0 && y < this.cols && board[x][y] === opponentPiece) {
                potentialFlips.push([x, y]);
                x += dx;
                y += dy;
            }
            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && board[x][y] === (player === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE)) {
                flippableDiscs = flippableDiscs.concat(potentialFlips);
            }
        }
        return flippableDiscs;
    }
    putPiece(player, row, col, board) {
        if (!this.isPlaceable(row, col, board)) {
            return false;
        }
        const flippableDiscs = this.getFlippableDiscs(player, row, col, board);
        if (flippableDiscs.length === 0) {
            return false;
        }
        board[row][col] = player === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;
        for (let [x, y] of flippableDiscs) {
            board[x][y] = player === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;
        }
        return true;
    }
}
