"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardResult = void 0;
exports.getOthelloCore = getOthelloCore;
var othello_rules_1 = require("./othello_rules");
function getOthelloCore(rows, cols) {
    return new DefaultOthelloCore(rows, cols);
}
var BoardResult;
(function (BoardResult) {
    BoardResult[BoardResult["EXCHANGE_PLAYER"] = 0] = "EXCHANGE_PLAYER";
    BoardResult[BoardResult["CANNOT_PUT"] = 1] = "CANNOT_PUT";
    BoardResult[BoardResult["PUTABLE"] = 2] = "PUTABLE";
})(BoardResult || (exports.BoardResult = BoardResult = {}));
var directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
];
var DefaultOthelloCore = /** @class */ (function () {
    function DefaultOthelloCore(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    DefaultOthelloCore.prototype.isGameOver = function (player, board) {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                if (this.isPlaceable(row, col, board) && this.getFlippableDiscs(player, row, col, board).length > 0) {
                    return BoardResult.PUTABLE;
                }
            }
        }
        return BoardResult.CANNOT_PUT;
    };
    DefaultOthelloCore.prototype.isPlaceable = function (row, col, board) {
        return board[row][col] === null;
    };
    DefaultOthelloCore.prototype.getFlippableDiscs = function (player, row, col, board) {
        var opponentPiece = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.WHITE : othello_rules_1.Piece.BLACK;
        var flippableDiscs = [];
        for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var _a = directions_1[_i], dx = _a[0], dy = _a[1];
            var x = row + dx, y = col + dy;
            var potentialFlips = [];
            while (x >= 0 && x < this.rows && y >= 0 && y < this.cols && board[x][y] === opponentPiece) {
                potentialFlips.push([x, y]);
                x += dx;
                y += dy;
            }
            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && board[x][y] === (player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE)) {
                flippableDiscs = flippableDiscs.concat(potentialFlips);
            }
        }
        return flippableDiscs;
    };
    DefaultOthelloCore.prototype.putPiece = function (player, row, col, board) {
        if (!this.isPlaceable(row, col, board)) {
            return BoardResult.CANNOT_PUT;
        }
        var flippableDiscs = this.getFlippableDiscs(player, row, col, board);
        if (flippableDiscs.length === 0) {
            return BoardResult.CANNOT_PUT;
            ;
        }
        board[row][col] = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        for (var _i = 0, flippableDiscs_1 = flippableDiscs; _i < flippableDiscs_1.length; _i++) {
            var _a = flippableDiscs_1[_i], x = _a[0], y = _a[1];
            board[x][y] = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        }
        return BoardResult.PUTABLE;
    };
    return DefaultOthelloCore;
}());
var OthelloCoreExchangeable = /** @class */ (function () {
    function OthelloCoreExchangeable(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    OthelloCoreExchangeable.prototype.isGameOver = function (player, board) {
        var self = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        var opponent = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.WHITE : othello_rules_1.Piece.BLACK;
        if (this.getLegalMovesCounts(board, self) > 0) {
            return BoardResult.PUTABLE;
        }
        if (this.getLegalMovesCounts(board, opponent) > 0) {
            return BoardResult.EXCHANGE_PLAYER;
        }
        return BoardResult.CANNOT_PUT;
    };
    OthelloCoreExchangeable.prototype.putPiece = function (player, row, col, board) {
        if (!this.isLegalMove(row, col, board, player)) {
            return this.isGameOver(player, board);
        }
        var flippableDiscs = this.getFlippableDiscs(player, row, col, board);
        var piece = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        board[row][col] = piece;
        for (var _i = 0, flippableDiscs_2 = flippableDiscs; _i < flippableDiscs_2.length; _i++) {
            var _a = flippableDiscs_2[_i], x = _a[0], y = _a[1];
            board[x][y] = piece;
        }
        return this.isGameOver(player, board);
    };
    OthelloCoreExchangeable.prototype.isLegalMove = function (row, col, board, player) {
        var _this = this;
        if (!this.isPlaceable(row, col, board)) {
            return false;
        }
        var piece = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        var opponent = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.WHITE : othello_rules_1.Piece.BLACK;
        return directions.some(function (_a) {
            var dx = _a[0], dy = _a[1];
            var x = row + dx;
            var y = col + dy;
            var hasOpponentPiece = false;
            while (x >= 0 && x < _this.rows && y >= 0 && y < _this.cols && board[x][y] === opponent) {
                hasOpponentPiece = true;
                x += dx;
                y += dy;
            }
            return hasOpponentPiece && x >= 0 && x < _this.rows && y >= 0 && y < _this.cols && board[x][y] === piece;
        });
    };
    OthelloCoreExchangeable.prototype.getLegalMovesCounts = function (board, player) {
        var result = 0;
        for (var row = 0; row < board.length; row++) {
            for (var col = 0; col < board[row].length; col++) {
                if (this.isLegalMove(row, col, board, player === othello_rules_1.Piece.BLACK ? othello_rules_1.Player.BLACK_PLAYER : othello_rules_1.Player.WHITE_PLAYER)) {
                    result++;
                }
            }
        }
        return result;
    };
    OthelloCoreExchangeable.prototype.isPlaceable = function (row, col, board) {
        return board[row][col] === null;
    };
    OthelloCoreExchangeable.prototype.getFlippableDiscs = function (player, row, col, board) {
        var opponentPiece = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.WHITE : othello_rules_1.Piece.BLACK;
        var flippableDiscs = [];
        for (var _i = 0, directions_2 = directions; _i < directions_2.length; _i++) {
            var _a = directions_2[_i], dx = _a[0], dy = _a[1];
            var x = row + dx, y = col + dy;
            var potentialFlips = [];
            while (x >= 0 && x < this.rows && y >= 0 && y < this.cols && board[x][y] === opponentPiece) {
                potentialFlips.push([x, y]);
                x += dx;
                y += dy;
            }
            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && board[x][y] === (player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE)) {
                flippableDiscs = flippableDiscs.concat(potentialFlips);
            }
        }
        return flippableDiscs;
    };
    return OthelloCoreExchangeable;
}());
