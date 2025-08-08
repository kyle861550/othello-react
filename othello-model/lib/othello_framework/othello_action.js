import { OthelloError } from './othello_framework';
import { getOthelloFacade, Player } from '../othello_core';
import { BoardResult } from '../othello_core/othello_env';
export function getOthelloAction(rule, callback) {
    return new DefaultOthelloAction(rule, callback);
}
class DefaultOthelloAction {
    constructor(rule, callback) {
        this.othello = getOthelloFacade();
        this.information = {
            getCurrentPlayer: () => {
                return this.othello.getStatus().currentPlayer;
            },
            getType: () => {
                return this.othello.getStatus().type;
            },
            getPieceCounts: () => {
                return this.othello.getBoardData().counts;
            },
            getBoard: () => {
                return this.othello.getBoardData().board;
            },
        };
        this.customerBoard = this.othello;
        this.rule = rule;
        this.callback = callback;
    }
    setType(type) {
        if (this.rule.isIllegalSize(type.rows)) {
            this.callback.onError(OthelloError.ILLEGAL_CUSTOM);
            return;
        }
        this.othello.setType(type);
        this.resetGame();
    }
    putPiece(params) {
        const putResult = this.othello.putPiece(params);
        const boardData = this.othello.getBoardData();
        const winner = this.getWinner(boardData.counts);
        switch (putResult) {
            case BoardResult.PUT_SUCCESS:
                this.callback.onBoardChange(boardData);
                if (this.othello.isGameOver()) {
                    this.callback.onGameOver(winner);
                }
                break;
            case BoardResult.PUT_SUCCESS_KEEP_PUT:
                this.callback.onError(OthelloError.KEEP_PUTTING);
                this.callback.onBoardChange(boardData);
                if (this.othello.isGameOver()) {
                    this.callback.onGameOver(winner);
                }
                break;
            case BoardResult.PUT_FAIL:
            case BoardResult.PUT_FAIL_EXCHANGE_PLAYER:
                if (this.othello.isGameOver()) {
                    this.callback.onBoardChange(boardData);
                    this.callback.onGameOver(winner);
                    return;
                }
                const errorType = putResult == BoardResult.PUT_FAIL_EXCHANGE_PLAYER ? OthelloError.EXCHANGE_PLAYER : OthelloError.ILLEGAL_PLACE;
                this.callback.onError(errorType);
                break;
        }
    }
    getWinner(counts) {
        if (counts.black === counts.white) {
            return null;
        }
        return counts.black > counts.white ? Player.BLACK_PLAYER : Player.WHITE_PLAYER;
    }
    resetGame() {
        this.othello.resetGame();
        this.callback.onRestarted();
        const boardData = this.othello.getBoardData();
        this.callback.onBoardChange(boardData);
    }
}
