import { Player, Piece } from './othello_rules';

export function getOthelloCore(rows: number, cols: number): IOthelloCore {
    return new OthelloCoreExchangeable(rows, cols);
}

export enum BoardResult {
    EXCHANGE_PLAYER,
    CANNOT_PUT,
    PUTABLE,
}

export interface IOthelloCore {

    isGameOver(player: Player, board: (Piece | null)[][]): BoardResult;

    putPiece(player: Player, row: number, col: number, board: (Piece | null)[][]): BoardResult;

}

const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
];

class DefaultOthelloCore implements IOthelloCore {
    rows: number;
    cols: number;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
    }

    isGameOver(player: Player, board: (Piece | null)[][]): BoardResult {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.isPlaceable(row, col, board) && this.getFlippableDiscs(player, row, col, board).length > 0) {
                    return BoardResult.PUTABLE;
                }
            }
        }
        return BoardResult.CANNOT_PUT;
    }

    isPlaceable(row: number, col: number, board: (Piece | null)[][]): boolean {
        return board[row][col] === null;
    }

    getFlippableDiscs(player: Player, row: number, col: number, board: (Piece | null)[][]): number[][] {

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

    putPiece(player: Player, row: number, col: number, board: (Piece | null)[][]): BoardResult {
        if (!this.isPlaceable(row, col, board)) {
            return BoardResult.CANNOT_PUT;
        }

        const flippableDiscs = this.getFlippableDiscs(player, row, col, board);

        if (flippableDiscs.length === 0) {
            return BoardResult.CANNOT_PUT;;
        }

        board[row][col] = player === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;

        for (let [x, y] of flippableDiscs) {
            board[x][y] = player === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;
        }

        return BoardResult.PUTABLE;
    }

}

class OthelloCoreExchangeable implements IOthelloCore {
    rows: number;
    cols: number;
    
    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
    }

    isGameOver(player: Player, board: (Piece | null)[][]): BoardResult {
        const opponent = player === Player.BLACK_PLAYER ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;

        if (this.isPlayerMoveable(player, board)) {
            return BoardResult.PUTABLE;
        }

        if (this.isPlayerMoveable(opponent, board)) {
            return BoardResult.EXCHANGE_PLAYER;
        }

        return BoardResult.CANNOT_PUT;
    }

    putPiece(player: Player, row: number, col: number, board: (Piece | null)[][]): BoardResult {
        if (!this.isLegalMove(row, col, board, player)) {
            return BoardResult.CANNOT_PUT;
            // return this.isGameOver(player, board);
        }

        const flippableDiscs = this.getFlippableDiscs(player, row, col, board);
        const piece = player === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;

        board[row][col] = piece;
        for (let [x, y] of flippableDiscs) {
            board[x][y] = piece;
        }

        const opponent = player === Player.BLACK_PLAYER ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;

        if (!this.isPlayerMoveable(opponent, board)) {
            return BoardResult.EXCHANGE_PLAYER;
        } 

        return this.isGameOver(player, board);
    }

    isLegalMove(row: number, col: number, board: (Piece | null)[][], player: Player): boolean {
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

    isPlayerMoveable(player: Player, board: (Piece | null)[][]): boolean {
        let result = 0;

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (this.isLegalMove(row, col, board, player === Player.BLACK_PLAYER ? Player.BLACK_PLAYER : Player.WHITE_PLAYER)) {
                    result++;
                }
            }
        }

        return result > 0;
    }

    isPlaceable(row: number, col: number, board: (Piece | null)[][]): boolean {
        return board[row][col] === null;
    }

    getFlippableDiscs(player: Player, row: number, col: number, board: (Piece | null)[][]): number[][] {
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
}
