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

    isGameOver(player: Player, board: (Piece | null)[][]): boolean;

    isPlayerMoveable(player: Player, board: (Piece | null)[][]): boolean;

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

    isPlayerMoveable(player: Player, board: (Piece | null)[][]): boolean {
        throw new Error('Method not implemented.');
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
            return BoardResult.CANNOT_PUT;
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
    directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0], [1, 0], // 水平和垂直方向
        [-1, -1], [-1, 1], [1, -1], [1, 1] // 斜方向
    ];

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
    }

    isGameOver(player: Player, board: (Piece | null)[][]): boolean {
        const opponent = player === Player.BLACK_PLAYER ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;
        return !this.isPlayerMoveable(player, board) && !this.isPlayerMoveable(opponent, board);
    }

    putPiece(player: Player, row: number, col: number, board: (Piece | null)[][]): BoardResult {
        if (!this.isLegalMove(row, col, board, player)) {
            return BoardResult.CANNOT_PUT;
        }

        const flippableDiscs = this.getFlippableDiscs(player, row, col, board);
        const piece = player === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;

        board[row][col] = piece;
        for (let [x, y] of flippableDiscs) {
            board[x][y] = piece;
        }

        const opponent = player === Player.BLACK_PLAYER ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;
        if (this.isPlayerMoveable(opponent, board)) {
            return BoardResult.EXCHANGE_PLAYER;
        }

        return BoardResult.PUTABLE;
    }

    isLegalMove(row: number, col: number, board: (Piece | null)[][], player: Player): boolean {
        if (!this.isPlaceable(row, col, board)) {
            return false;
        }
    
        const piece = player === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;
        const opponent = player === Player.BLACK_PLAYER ? Piece.WHITE : Piece.BLACK;
    
        return this.directions.some(([dx, dy]) => {
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
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (this.isLegalMove(row, col, board, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    isPlaceable(row: number, col: number, board: (Piece | null)[][]): boolean {
        return board[row][col] === null;
    }

    getFlippableDiscs(player: Player, row: number, col: number, board: (Piece | null)[][]): number[][] {
        const opponentPiece = player === Player.BLACK_PLAYER ? Piece.WHITE : Piece.BLACK;
        let flippableDiscs: number[][] = [];

        for (let [dx, dy] of this.directions) {
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