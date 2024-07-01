import { Player, Piece, IOthelloType } from './othello_rules';
import { IOthelloCore, getOthelloCore } from './othello_core';


export enum BoardResult {
    PUT_SUCCESS,
    PUT_SUCCESS_KEEP_PUT,
    PUT_FAIL,
    PUT_FAIL_EXCHANGE_PLAYER,
}

export interface IOthelloEnv {
    currentPlayer: Player;

    getBoard(): (Piece | null)[][];

    getPieceCounts(): { black: number; white: number } ;
    
    putPiece(row: number, col: number): BoardResult

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

    putPiece(row: number, col: number): BoardResult {
        
        this.controller.getBoard()[row][col] = this.currentPlayer === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;;

        return BoardResult.PUT_SUCCESS;
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
        const opponent = this.currentPlayer === Player.BLACK_PLAYER ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;
        return this.othelloCore.playerMoveableCounts(this.currentPlayer, this.board) <= 0 && 
                this.othelloCore.playerMoveableCounts(opponent, this.board) <= 0;
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

    putPiece(row: number, col: number): BoardResult {
        const isPutSuccess = this.othelloCore.putPiece(this.currentPlayer, row, col, this.board);

        const opponent = this.currentPlayer === Player.BLACK_PLAYER ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;
        
        const selfPutableCounts = this.othelloCore.playerMoveableCounts(this.currentPlayer, this.board)
        const opponentPutableCounts = this.othelloCore.playerMoveableCounts(opponent, this.board)

        console.log(`${this.currentPlayer} putable counts ${selfPutableCounts}, opponent putable counts ${opponentPutableCounts}`);
    
        if(!isPutSuccess) {
            if(selfPutableCounts == 0 && opponentPutableCounts > 0) {
                this.convertPlayer();
                return BoardResult.PUT_FAIL_EXCHANGE_PLAYER;
            }
            return BoardResult.PUT_FAIL;
        }

        console.log(`${this.currentPlayer} put success.\n`);

        if(selfPutableCounts > 0 && opponentPutableCounts == 0) {
            return BoardResult.PUT_SUCCESS_KEEP_PUT;
        }
        this.convertPlayer();

        return BoardResult.PUT_SUCCESS;
    }



}