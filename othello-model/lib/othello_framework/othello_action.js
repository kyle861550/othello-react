"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOthelloAction = getOthelloAction;
const othello_framework_1 = require("./othello_framework");
const othello_core_1 = require("../othello_core");
const othello_env_1 = require("../othello_core/othello_env");
function getOthelloAction(rule, callback) {
    return new DefaultOthelloAction(rule, callback);
}
class DefaultOthelloAction {
    constructor(rule, callback) {
        this.othello = (0, othello_core_1.getOthelloFacade)();
        this.information = {
            getCurrentPlayer: () => {
                return this.othello.getCurrentPlayer();
            },
            getType: () => {
                return this.othello.getType();
            },
            getPieceCounts: () => {
                return this.othello.getPieceCounts();
            },
            getBoard: () => {
                return this.othello.getBoard();
            },
        };
        this.customerBoard = this.othello;
        this.rule = rule;
        this.callback = callback;
    }
    setType(type) {
        if (this.rule.isIllegalSize(type.rows)) {
            this.callback.onError(othello_framework_1.OthelloError.ILLEGAL_CUSTOM);
            return;
        }
        this.othello.setType(type);
        this.resetGame();
    }
    putPiece(row, col) {
        const putResult = this.othello.putPiece(row, col);
        const board = this.othello.getBoard();
        const counts = this.othello.getPieceCounts();
        if (putResult == othello_env_1.BoardResult.PUT_FAIL || putResult == othello_env_1.BoardResult.PUT_FAIL_EXCHANGE_PLAYER) {
            if (this.othello.isGameOver()) {
                this.callback.onBoardChange(counts, board);
                this.callback.onGameOver(this.getWinner(counts));
                return;
            }
            const errorType = putResult == othello_env_1.BoardResult.PUT_FAIL_EXCHANGE_PLAYER ? othello_framework_1.OthelloError.EXCHANGE_PLAYER : othello_framework_1.OthelloError.ILLEGAL_PLACE;
            this.callback.onError(errorType);
            return;
        }
        if (putResult == othello_env_1.BoardResult.PUT_SUCCESS_KEEP_PUT) {
            this.callback.onError(othello_framework_1.OthelloError.KEEP_PUTTING);
        }
        this.callback.onBoardChange(counts, board);
        if (this.othello.isGameOver()) {
            this.callback.onGameOver(this.getWinner(counts));
        }
    }
    getWinner(counts) {
        if (counts.black === counts.white) {
            return null;
        }
        return counts.black > counts.white ? othello_core_1.Player.BLACK_PLAYER : othello_core_1.Player.WHITE_PLAYER;
    }
    resetGame() {
        this.othello.resetGame();
        this.callback.onRestarted();
        let counts = this.othello.getPieceCounts();
        let board = this.othello.getBoard();
        this.callback.onBoardChange(counts, board);
    }
}
