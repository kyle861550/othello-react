"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OthelloGame = exports.DefaultOthelloTemplate = exports.OthelloError = void 0;
const othello_core_1 = require("../othello_core");
const othello_action_1 = require("./othello_action");
var OthelloError;
(function (OthelloError) {
    OthelloError[OthelloError["ILLEGAL_PLACE"] = 0] = "ILLEGAL_PLACE";
    OthelloError[OthelloError["ILLEGAL_CUSTOM"] = 1] = "ILLEGAL_CUSTOM";
    OthelloError[OthelloError["EXCHANGE_PLAYER"] = 2] = "EXCHANGE_PLAYER";
})(OthelloError || (exports.OthelloError = OthelloError = {}));
class DefaultOthelloTemplate {
    constructor() {
        this.rules = new othello_core_1.DefaultOthelloRule();
        this.action = (0, othello_action_1.getOthelloAction)(this.rules, this);
    }
}
exports.DefaultOthelloTemplate = DefaultOthelloTemplate;
class OthelloGame extends DefaultOthelloTemplate {
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
exports.OthelloGame = OthelloGame;
