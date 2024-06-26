import { Player, Piece } from './othello_rules';

export function getOthelloCore(rows: number, cols: number): IOthelloCore {
    return new DefaultOthelloCore(rows, cols);
}

export interface IOthelloCore {
    putPiece(player: Player, row: number, col: number, board: (Piece | null)[][]): boolean;
    isGameOver(player: Player, board: (Piece | null)[][]): boolean;
}

class DefaultOthelloCore implements IOthelloCore {
    rows: number;
    cols: number;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
    }

    isGameOver(player: Player, board: (Piece | null)[][]): boolean {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.isPlaceable(row, col, board) && this.getFlippableDiscs(player, row, col, board).length > 0) {
                    return false;
                }
            }
        }
        return true;
    }

    isPlaceable(row: number, col: number, board: (Piece | null)[][]): boolean {
        return board[row][col] === null;
    }

    getFlippableDiscs(player: Player, row: number, col: number, board: (Piece | null)[][]): number[][] {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];

        const opponentPiece = player === Player.BLACK_PLAYER ? Piece.WHITE : Piece.BLACK;
        let flippableDiscs: number[][] = [];

        for (let [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            let potentialFlips: number[][] = [];

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

    putPiece(player: Player, row: number, col: number, board: (Piece | null)[][]): boolean {
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
