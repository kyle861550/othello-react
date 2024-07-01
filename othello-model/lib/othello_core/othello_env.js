"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleOthelloEnv = exports.CustomerOthelloEnv = void 0;
const othello_rules_1 = require("./othello_rules");
const othello_core_1 = require("./othello_core");
class CustomerOthelloEnv {
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
    putPiece(row, col) {
        this.controller.getBoard()[row][col] = this.currentPlayer === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        ;
        return true;
    }
    isGameOver() {
        return false;
    }
}
exports.CustomerOthelloEnv = CustomerOthelloEnv;
class BattleOthelloEnv {
    constructor(othelloType, board) {
        this.othelloCore = (0, othello_core_1.getOthelloCore)(othelloType.rows, othelloType.cols);
        this.currentPlayer = othello_rules_1.Player.BLACK_PLAYER;
        if (board != null) {
            this.board = board;
            return;
        }
        this.board = Array(othelloType.rows)
            .fill(null)
            .map(() => Array(othelloType.cols).fill(null));
        const midRow = Math.floor(othelloType.rows / 2);
        const midCol = Math.floor(othelloType.cols / 2);
        this.board[midRow - 1][midCol - 1] = othello_rules_1.Piece.WHITE;
        this.board[midRow - 1][midCol] = othello_rules_1.Piece.BLACK;
        this.board[midRow][midCol - 1] = othello_rules_1.Piece.BLACK;
        this.board[midRow][midCol] = othello_rules_1.Piece.WHITE;
    }
    getBoard() {
        return this.board;
    }
    isGameOver() {
        const opponent = this.currentPlayer === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Player.WHITE_PLAYER : othello_rules_1.Player.BLACK_PLAYER;
        return this.othelloCore.playerMoveableCounts(this.currentPlayer, this.board) <= 0 &&
            this.othelloCore.playerMoveableCounts(opponent, this.board) <= 0;
    }
    convertPlayer() {
        this.currentPlayer = this.currentPlayer === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Player.WHITE_PLAYER : othello_rules_1.Player.BLACK_PLAYER;
    }
    getPieceCounts() {
        let black = 0, white = 0;
        for (let row of this.board) {
            for (let cell of row) {
                switch (cell) {
                    case othello_rules_1.Piece.BLACK:
                        black++;
                        break;
                    case othello_rules_1.Piece.WHITE:
                        white++;
                        break;
                }
            }
        }
        return { black, white };
    }
    putPiece(row, col) {
        const isPutSuccess = this.othelloCore.putPiece(this.currentPlayer, row, col, this.board);
        console.log(`....`);
        if (!isPutSuccess) {
            const opponent = this.currentPlayer === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Player.WHITE_PLAYER : othello_rules_1.Player.BLACK_PLAYER;
            const opponentPutableCounts = this.othelloCore.playerMoveableCounts(opponent, this.board);
            console.log(`${opponent.toString} putable counts ${opponentPutableCounts}`);
            if (opponentPutableCounts > 0) {
                this.convertPlayer();
            }
            return false;
        }
        console.log(`${this.currentPlayer} put success.`);
        this.convertPlayer();
        return true;
    }
}
exports.BattleOthelloEnv = BattleOthelloEnv;
