"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardResult = void 0;
exports.getOthelloCore = getOthelloCore;
const othello_rules_1 = require("./othello_rules");
function getOthelloCore(rows, cols) {
    return new OthelloCoreExchangeable(rows, cols);
}
var BoardResult;
(function (BoardResult) {
    BoardResult[BoardResult["EXCHANGE_PLAYER"] = 0] = "EXCHANGE_PLAYER";
    BoardResult[BoardResult["CANNOT_PUT"] = 1] = "CANNOT_PUT";
    BoardResult[BoardResult["PUTABLE"] = 2] = "PUTABLE";
})(BoardResult || (exports.BoardResult = BoardResult = {}));
const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
];
class DefaultOthelloCore {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    isGameOver(player, board) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.isPlaceable(row, col, board) && this.getFlippableDiscs(player, row, col, board).length > 0) {
                    return BoardResult.PUTABLE;
                }
            }
        }
        return BoardResult.CANNOT_PUT;
    }
    isPlaceable(row, col, board) {
        return board[row][col] === null;
    }
    getFlippableDiscs(player, row, col, board) {
        const opponentPiece = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.WHITE : othello_rules_1.Piece.BLACK;
        let flippableDiscs = [];
        for (let [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            let potentialFlips = [];
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
    }
    putPiece(player, row, col, board) {
        if (!this.isPlaceable(row, col, board)) {
            return BoardResult.CANNOT_PUT;
        }
        const flippableDiscs = this.getFlippableDiscs(player, row, col, board);
        if (flippableDiscs.length === 0) {
            return BoardResult.CANNOT_PUT;
            ;
        }
        board[row][col] = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        for (let [x, y] of flippableDiscs) {
            board[x][y] = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        }
        return BoardResult.PUTABLE;
    }
}
class OthelloCoreExchangeable {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    isGameOver(player, board) {
        const opponent = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Player.WHITE_PLAYER : othello_rules_1.Player.BLACK_PLAYER;
        if (this.isPlayerMoveable(player, board)) {
            return BoardResult.PUTABLE;
        }
        if (this.isPlayerMoveable(opponent, board)) {
            return BoardResult.EXCHANGE_PLAYER;
        }
        return BoardResult.CANNOT_PUT;
    }
    putPiece(player, row, col, board) {
        if (!this.isLegalMove(row, col, board, player)) {
            return BoardResult.CANNOT_PUT;
            // return this.isGameOver(player, board);
        }
        const flippableDiscs = this.getFlippableDiscs(player, row, col, board);
        const piece = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        board[row][col] = piece;
        for (let [x, y] of flippableDiscs) {
            board[x][y] = piece;
        }
        const opponent = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Player.WHITE_PLAYER : othello_rules_1.Player.BLACK_PLAYER;
        if (!this.isPlayerMoveable(opponent, board)) {
            return BoardResult.EXCHANGE_PLAYER;
        }
        return this.isGameOver(player, board);
    }
    isLegalMove(row, col, board, player) {
        if (!this.isPlaceable(row, col, board)) {
            return false;
        }
        const piece = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.BLACK : othello_rules_1.Piece.WHITE;
        const opponent = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.WHITE : othello_rules_1.Piece.BLACK;
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
    isPlayerMoveable(player, board) {
        let result = 0;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (this.isLegalMove(row, col, board, player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Player.BLACK_PLAYER : othello_rules_1.Player.WHITE_PLAYER)) {
                    result++;
                }
            }
        }
        return result > 0;
    }
    isPlaceable(row, col, board) {
        return board[row][col] === null;
    }
    getFlippableDiscs(player, row, col, board) {
        const opponentPiece = player === othello_rules_1.Player.BLACK_PLAYER ? othello_rules_1.Piece.WHITE : othello_rules_1.Piece.BLACK;
        let flippableDiscs = [];
        for (let [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            let potentialFlips = [];
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
    }
}
