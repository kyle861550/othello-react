"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOthelloAction = getOthelloAction;
var othello_framework_1 = require("./othello_framework");
var othello_core_1 = require("../othello_core");
function getOthelloAction(rule, callback) {
    return new DefaultOthelloAction(rule, callback);
}
var DefaultOthelloAction = /** @class */ (function () {
    function DefaultOthelloAction(rule, callback) {
        var _this = this;
        this.othello = (0, othello_core_1.getOthelloFacade)();
        this.information = {
            getCurrentPlayer: function () {
                return _this.othello.getCurrentPlayer();
            },
            getType: function () {
                return _this.othello.getType();
            },
            getPieceCounts: function () {
                return _this.othello.getPieceCounts();
            },
            getBoard: function () {
                return _this.othello.getBoard().map(function (row) { return row.slice(); });
                ;
            },
        };
        this.customerBoard = this.othello;
        this.rule = rule;
        this.callback = callback;
    }
    DefaultOthelloAction.prototype.setType = function (type) {
        if (this.rule.isIllegalSize(type.rows)) {
            this.callback.onError(othello_framework_1.OthelloError.ILLEGAL_CUSTOM);
            return;
        }
        this.othello.setType(type);
        this.resetGame();
    };
    DefaultOthelloAction.prototype.putPiece = function (row, col) {
        var isSuccess = this.othello.putPiece(row, col);
        var board = this.othello.getBoard();
        var counts = this.othello.getPieceCounts();
        if (!isSuccess) {
            if (this.othello.isGameOver()) {
                this.callback.onBoardChange(counts, board);
                this.callback.onGameOver(this.getWinner(counts));
            }
            else {
                this.callback.onError(othello_framework_1.OthelloError.ILLEGAL_PLACE);
            }
            return;
        }
        this.callback.onBoardChange(counts, board);
        if (this.othello.isGameOver()) {
            this.callback.onGameOver(this.getWinner(counts));
        }
    };
    DefaultOthelloAction.prototype.getWinner = function (counts) {
        if (counts.black === counts.white) {
            return null;
        }
        return counts.black > counts.white ? othello_core_1.Player.BLACK_PLAYER : othello_core_1.Player.WHITE_PLAYER;
    };
    DefaultOthelloAction.prototype.resetGame = function () {
        this.othello.resetGame();
        this.callback.onRestarted();
        var counts = this.othello.getPieceCounts();
        var board = this.othello.getBoard();
        this.callback.onBoardChange(counts, board);
    };
    return DefaultOthelloAction;
}());
