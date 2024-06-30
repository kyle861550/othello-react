"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OthelloGame = exports.DefaultOthelloTemplate = exports.OthelloError = void 0;
var othello_core_1 = require("../othello_core");
var othello_action_1 = require("./othello_action");
var OthelloError;
(function (OthelloError) {
    OthelloError[OthelloError["ILLEGAL_PLACE"] = 0] = "ILLEGAL_PLACE";
    OthelloError[OthelloError["ILLEGAL_CUSTOM"] = 1] = "ILLEGAL_CUSTOM";
})(OthelloError || (exports.OthelloError = OthelloError = {}));
var DefaultOthelloTemplate = /** @class */ (function () {
    function DefaultOthelloTemplate() {
        this.rules = new othello_core_1.DefaultOthelloRule();
        this.action = (0, othello_action_1.getOthelloAction)(this.rules, this);
    }
    return DefaultOthelloTemplate;
}());
exports.DefaultOthelloTemplate = DefaultOthelloTemplate;
var OthelloGame = /** @class */ (function (_super) {
    __extends(OthelloGame, _super);
    function OthelloGame(onRestartedCallback, onErrorCallback, onGameOverCallback, onBoardChangeCallback) {
        var _this = _super.call(this) || this;
        _this.onRestartedCallback = onRestartedCallback;
        _this.onErrorCallback = onErrorCallback;
        _this.onGameOverCallback = onGameOverCallback;
        _this.onBoardChangeCallback = onBoardChangeCallback;
        return _this;
    }
    OthelloGame.prototype.onError = function (error) {
        this.onErrorCallback(error);
    };
    OthelloGame.prototype.onRestarted = function () {
        this.onRestartedCallback();
    };
    OthelloGame.prototype.onGameOver = function (winner) {
        this.onGameOverCallback(winner);
    };
    OthelloGame.prototype.onBoardChange = function (counts, board) {
        this.onBoardChangeCallback(counts, board);
    };
    return OthelloGame;
}(DefaultOthelloTemplate));
exports.OthelloGame = OthelloGame;
