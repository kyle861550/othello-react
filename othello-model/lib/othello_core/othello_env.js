"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleOthelloEnv = exports.CustomerOthelloEnv = void 0;
var othello_rules_1 = require("./othello_rules");
var othello_core_1 = require("./othello_core");
var CustomerOthelloEnv = /** @class */ (function () {
    function CustomerOthelloEnv(controller) {
        this.controller = controller;
        this.currentPlayer = controller.currentPlayer;
    }
    CustomerOthelloEnv.prototype.getBoard = function () {
        return this.controller.getBoard();
    };
    CustomerOthelloEnv.prototype.getPieceCounts = function () {
        return this.controller.getPieceCounts();
    };
    CustomerOthelloEnv.prototype.putPiece = function (row, col) {
        this.controller.getBoard()[row][col] = this.currentPlayer === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        ;
        return true;
    };
    CustomerOthelloEnv.prototype.isGameOver = function () {
        return false;
    };
    return CustomerOthelloEnv;
}());
exports.CustomerOthelloEnv = CustomerOthelloEnv;
var BattleOthelloEnv = /** @class */ (function () {
    function BattleOthelloEnv(othelloType, board) {
        this.othelloCore = (0, othello_core_1.getOthelloCore)(othelloType.rows, othelloType.cols);
        this.currentPlayer = othello_rules_1.Player.BLACK_PLAYER;
        if (board != null) {
            this.board = board;
            return;
        }
        this.board = Array(othelloType.rows)
            .fill(null)
            .map(function () { return Array(othelloType.cols).fill(null); });
        var midRow = Math.floor(othelloType.rows / 2);
        var midCol = Math.floor(othelloType.cols / 2);
        this.board[midRow - 1][midCol - 1] = othello_rules_1.Piece.WHITE;
        this.board[midRow - 1][midCol] = othello_rules_1.Piece.BLACK;
        this.board[midRow][midCol - 1] = othello_rules_1.Piece.BLACK;
        this.board[midRow][midCol] = othello_rules_1.Piece.WHITE;
    }
    BattleOthelloEnv.prototype.getBoard = function () {
        return this.board;
    };
    BattleOthelloEnv.prototype.isGameOver = function () {
        return this.othelloCore.isGameOver(this.currentPlayer, this.board) === othello_core_1.BoardResult.CANNOT_PUT;
    };
    BattleOthelloEnv.prototype.convertPlayer = function () {
        this.currentPlayer = this.currentPlayer === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Player.WHITE_PLAYER : othello_rules_1.Player.BLACK_PLAYER;
    };
    BattleOthelloEnv.prototype.getPieceCounts = function () {
        var black = 0, white = 0;
        for (var _i = 0, _a = this.board; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var cell = row_1[_b];
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
        return { black: black, white: white };
    };
    BattleOthelloEnv.prototype.putPiece = function (row, col) {
        var putResult = this.othelloCore.putPiece(this.currentPlayer, row, col, this.board);
        switch (putResult) {
            case othello_core_1.BoardResult.EXCHANGE_PLAYER:
                console.log("====> EXCHANGE_PLAYER");
                this.convertPlayer();
                break;
            case othello_core_1.BoardResult.CANNOT_PUT:
                return false;
            case othello_core_1.BoardResult.PUTABLE:
                this.convertPlayer();
                break;
        }
        return true;
    };
    return BattleOthelloEnv;
}());
exports.BattleOthelloEnv = BattleOthelloEnv;
