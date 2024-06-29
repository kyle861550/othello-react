import { Player, Piece, IOthelloType } from './othello_rules';
import { IOthelloCore, getOthelloCore } from './othello_core';

export function getOthelloController(type: IOthelloType): IOthelloController {
    return new DefaultOthelloController(type);
}


export interface IOthelloController {
    readonly currentPlayer: Player;

    getBoard(): (Piece | null)[][];

    getPieceCounts(): { black: number; white: number } ;
    
    putPiece(row: number, col: number): boolean

    isGameOver(): boolean;

}

class DefaultOthelloController implements IOthelloController {
    
    board: (Piece | null)[][];
    currentPlayer: Player;
    othelloCore: IOthelloCore;

    constructor(othelloType: IOthelloType) {
        this.othelloCore = getOthelloCore(othelloType.rows, othelloType.cols);

        this.board = Array(othelloType.rows)
            .fill(null)
            .map(() => Array(othelloType.cols).fill(null));

        this.currentPlayer = Player.BLACK_PLAYER;

        const midRow = Math.floor(othelloType.rows / 2);
        const midCol = Math.floor(othelloType.cols / 2);

        this.board[midRow - 1][midCol - 1] = Piece.WHITE;
        this.board[midRow - 1][midCol] = Piece.BLACK;
        this.board[midRow][midCol - 1] = Piece.BLACK;
        this.board[midRow][midCol] = Piece.WHITE;
    }

    getBoard(): (Piece | null)[][] {
        return this.board.map(row => row.slice());
    }

    isGameOver(): boolean {
        return this.othelloCore.isGameOver(this.currentPlayer, this.board);
    }

    convertPlayer(): void {
        this.currentPlayer = this.currentPlayer === Player.BLACK_PLAYER ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;
    }

    getPieceCounts(): { black: number; white: number; } {
        let black = 0, white = 0;

        for (let row of this.board) {

            for (let cell of row) {

                switch(cell) {
                    case Piece.BLACK:
                        black++;
                        break;
                    case Piece.WHITE:
                        white++;
                        break;
                }
            }
        }

        return { black, white };
    }

    putPiece(row: number, col: number): boolean {
        let isPutSuccess = this.othelloCore.putPiece(this.currentPlayer, row, col, this.board);

        if(!isPutSuccess) {
            return false;
        }

        this.convertPlayer();

        return true;
    }



}