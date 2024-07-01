"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OthelloGameTotalEvent = exports.DefaultOthelloActivity = exports.OthelloError = void 0;
exports.createOthelloGame = createOthelloGame;
const othello_core_1 = require("../othello_core");
const othello_action_1 = require("./othello_action");
var OthelloError;
(function (OthelloError) {
    OthelloError[OthelloError["ILLEGAL_PLACE"] = 0] = "ILLEGAL_PLACE";
    OthelloError[OthelloError["ILLEGAL_CUSTOM"] = 1] = "ILLEGAL_CUSTOM";
    OthelloError[OthelloError["EXCHANGE_PLAYER"] = 2] = "EXCHANGE_PLAYER";
    OthelloError[OthelloError["KEEP_PUTTING"] = 3] = "KEEP_PUTTING";
})(OthelloError || (exports.OthelloError = OthelloError = {}));
class DefaultOthelloActivity {
    constructor() {
        this.rules = new othello_core_1.DefaultOthelloRule();
        this.action = (0, othello_action_1.getOthelloAction)(this.rules, this);
    }
}
exports.DefaultOthelloActivity = DefaultOthelloActivity;
class OthelloGameTotalEvent extends DefaultOthelloActivity {
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
    onBoardChange(counts, board) {
        this.onBoardChangeCallback(counts, board);
    }
}
exports.OthelloGameTotalEvent = OthelloGameTotalEvent;
function createOthelloGame(onRestarted, onError, onGameOver, onBoardChange) {
    const game = new OthelloGameTotalEvent(onRestarted, onError, onGameOver, onBoardChange);
    return {
        rules: game.rules,
        action: game.action,
        getBoard: () => game.action.information.getBoard(),
        getCounts: () => game.action.information.getPieceCounts(),
        getCurrentPlayer: () => game.action.information.getCurrentPlayer(),
        setType: (type) => game.action.setType(type),
        putPiece: (row, col) => game.action.putPiece(row, col),
        resetGame: () => game.action.resetGame(),
    };
}
