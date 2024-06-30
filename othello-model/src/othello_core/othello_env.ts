import { Player, Piece, IOthelloType } from './othello_rules';
import { BoardResult, IOthelloCore, getOthelloCore } from './othello_core';


export interface IOthelloEnv {
    currentPlayer: Player;

    getBoard(): (Piece | null)[][];

    getPieceCounts(): { black: number; white: number } ;
    
    putPiece(row: number, col: number): boolean

    isGameOver(): boolean;

}

export class CustomerOthelloEnv implements IOthelloEnv {
    controller: IOthelloEnv
    currentPlayer: Player;

    constructor(controller: IOthelloEnv) {
        this.controller = controller;
        this.currentPlayer = controller.currentPlayer;
    }

    getBoard(): (Piece | null)[][] {
        return this.controller.getBoard();
    }

    getPieceCounts(): { black: number; white: number; } {
        return this.controller.getPieceCounts();
    }

    putPiece(row: number, col: number): boolean {
        
        this.controller.getBoard()[row][col] = this.currentPlayer === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;;

        return true;
    }

    isGameOver(): boolean {
        return false;
    }

}

export class BattleOthelloEnv implements IOthelloEnv {
    
    board: (Piece | null)[][];
    currentPlayer: Player;
    othelloCore: IOthelloCore;

    constructor(othelloType: IOthelloType, board: (Piece | null)[][] | null) {
        this.othelloCore = getOthelloCore(othelloType.rows, othelloType.cols);

        this.currentPlayer = Player.BLACK_PLAYER;
        if(board != null) {
            this.board = board;
            return
        }
        this.board = Array(othelloType.rows)
            .fill(null)
            .map(() => Array(othelloType.cols).fill(null));

        const midRow = Math.floor(othelloType.rows / 2);
        const midCol = Math.floor(othelloType.cols / 2);

        this.board[midRow - 1][midCol - 1] = Piece.WHITE;
        this.board[midRow - 1][midCol] = Piece.BLACK;
        this.board[midRow][midCol - 1] = Piece.BLACK;
        this.board[midRow][midCol] = Piece.WHITE;
    }

    getBoard(): (Piece | null)[][] {
        return this.board;
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
        const result = this.othelloCore.putPiece(this.currentPlayer, row, col, this.board);
    
        if (result === BoardResult.PUTABLE) {
            this.convertPlayer();
            return true;
        }
    
        if (result === BoardResult.EXCHANGE_PLAYER) {
            console.log('Player cannot move, exchanging turn');
            this.convertPlayer();
            return false;
        }
    
        console.log('Cannot put piece here');
        return false;
    }



}