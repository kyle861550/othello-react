import { DefaultOthelloRule } from '../othello_core';
import { getOthelloAction } from './othello_action';
export var OthelloError;
(function (OthelloError) {
    OthelloError[OthelloError["ILLEGAL_PLACE"] = 0] = "ILLEGAL_PLACE";
    OthelloError[OthelloError["ILLEGAL_CUSTOM"] = 1] = "ILLEGAL_CUSTOM";
    OthelloError[OthelloError["EXCHANGE_PLAYER"] = 2] = "EXCHANGE_PLAYER";
    OthelloError[OthelloError["KEEP_PUTTING"] = 3] = "KEEP_PUTTING";
})(OthelloError || (OthelloError = {}));
export class DefaultOthelloActivity {
    constructor() {
        this.rules = new DefaultOthelloRule();
        this.action = getOthelloAction(this.rules, this);
    }
}
export class OthelloGameTotalEvent extends DefaultOthelloActivity {
    constructor(onRestartedCallback, onErrorCallback, onGameOverCallback, onBoardChangeCallback) {
        super();
        this.onRestartedCallback = onRestartedCallback;
        this.onErrorCallback = onErrorCallback;
        this.onGameOverCallback = onGameOverCallback;
        this.onBoardChangeCallback = onBoardChangeCallback;
    }
    onError(error) {
        this.onErrorCallback(error);
    }
    onRestarted() {
        this.onRestartedCallback();
    }
    onGameOver(winner) {
        this.onGameOverCallback(winner);
    }
    onBoardChange(boardData) {
        this.onBoardChangeCallback(boardData);
    }
}
export function createOthelloGame(onRestarted, onError, onGameOver, onBoardChange) {
    const game = new OthelloGameTotalEvent(onRestarted, onError, onGameOver, onBoardChange);
    return {
        rules: game.rules,
        action: game.action,
        getBoard: () => game.action.information.getBoard(),
        getCounts: () => game.action.information.getPieceCounts(),
        getCurrentPlayer: () => game.action.information.getCurrentPlayer(),
        setType: (type) => game.action.setType(type),
        putPiece: (params) => game.action.putPiece(params),
        resetGame: () => game.action.resetGame(),
    };
}
