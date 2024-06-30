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
        return this.othelloCore.isGameOver(this.currentPlayer, this.board);
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
        const result = this.othelloCore.putPiece(this.currentPlayer, row, col, this.board);
        if (result === othello_core_1.BoardResult.PUTABLE) {
            this.convertPlayer();
            return true;
        }
        if (result === othello_core_1.BoardResult.EXCHANGE_PLAYER) {
            console.log('Player cannot move, exchanging turn');
            this.convertPlayer();
            return false;
        }
        console.log('Cannot put piece here');
        return false;
    }
}
exports.BattleOthelloEnv = BattleOthelloEnv;
