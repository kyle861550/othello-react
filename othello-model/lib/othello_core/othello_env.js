import { Player, Piece } from './othello_rules';
import { getOthelloCore } from './othello_core';
export var BoardResult;
(function (BoardResult) {
    BoardResult[BoardResult["PUT_SUCCESS"] = 0] = "PUT_SUCCESS";
    BoardResult[BoardResult["PUT_SUCCESS_KEEP_PUT"] = 1] = "PUT_SUCCESS_KEEP_PUT";
    BoardResult[BoardResult["PUT_FAIL"] = 2] = "PUT_FAIL";
    BoardResult[BoardResult["PUT_FAIL_EXCHANGE_PLAYER"] = 3] = "PUT_FAIL_EXCHANGE_PLAYER";
})(BoardResult || (BoardResult = {}));
export class CustomerOthelloEnv {
    constructor(controller) {
        this.controller = controller;
        this.currentPlayer = controller.currentPlayer;
    }
    getBoard() {
        return this.controller.getBoard();
    }
    getPieceCounts() {
        return this.controller.getPieceCounts();
    }
    putPiece(params) {
        const { row, col } = params;
        this.controller.getBoard()[row][col] = this.currentPlayer === Player.BLACK_PLAYER ? Piece.BLACK : Piece.WHITE;
        ;
        return BoardResult.PUT_SUCCESS;
    }
    isGameOver() {
        return false;
    }
}
export class BattleOthelloEnv {
    constructor(othelloType, board) {
        this.othelloCore = getOthelloCore(othelloType.rows, othelloType.cols);
        this.currentPlayer = Player.BLACK_PLAYER;
        if (board != null) {
            this.board = board;
            return;
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
    getBoard() {
        return this.board;
    }
    isGameOver() {
        const opponent = this.currentPlayer === Player.BLACK_PLAYER ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;
        return this.othelloCore.playerMoveableCounts(this.currentPlayer, this.board) <= 0 &&
            this.othelloCore.playerMoveableCounts(opponent, this.board) <= 0;
    }
    convertPlayer() {
        this.currentPlayer = this.currentPlayer === Player.BLACK_PLAYER ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;
    }
    getPieceCounts() {
        let black = 0, white = 0;
        for (let row of this.board) {
            for (let cell of row) {
                switch (cell) {
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
    putPiece(params) {
        const { row, col } = params;
        const isPutSuccess = this.othelloCore.putPiece(this.currentPlayer, row, col, this.board);
        const opponent = this.currentPlayer === Player.BLACK_PLAYER ? Player.WHITE_PLAYER : Player.BLACK_PLAYER;
        const selfPutableCounts = this.othelloCore.playerMoveableCounts(this.currentPlayer, this.board);
        const opponentPutableCounts = this.othelloCore.playerMoveableCounts(opponent, this.board);
        console.log(`${this.currentPlayer} putable counts ${selfPutableCounts}, opponent putable counts ${opponentPutableCounts}`);
        if (!isPutSuccess) {
            if (selfPutableCounts === 0 && opponentPutableCounts > 0) {
                this.convertPlayer();
                return BoardResult.PUT_FAIL_EXCHANGE_PLAYER;
            }
            return BoardResult.PUT_FAIL;
        }
        console.log(`${this.currentPlayer} put success.\n`);
        if (selfPutableCounts > 0 && opponentPutableCounts === 0) {
            return BoardResult.PUT_SUCCESS_KEEP_PUT;
        }
        this.convertPlayer();
        return BoardResult.PUT_SUCCESS;
    }
}
