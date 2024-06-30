"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOthelloFacade = getOthelloFacade;
var othello_env_1 = require("./othello_env");
var othello_rules_1 = require("./othello_rules");
var othello_rules_2 = require("./othello_rules");
function getOthelloFacade() {
    return new DefaultOthelloFacade();
}
var DefaultOthelloFacade = /** @class */ (function () {
    function DefaultOthelloFacade() {
        this.othelloType = othello_rules_1.OthelloType.Classic;
        this.othelloController = new othello_env_1.BattleOthelloEnv(this.othelloType, null);
    }
    DefaultOthelloFacade.prototype.setCurrentPlayer = function (player) {
        this.othelloController.currentPlayer = player;
    };
    DefaultOthelloFacade.prototype.setCustomBoard = function (enable) {
        var cachePlayer = this.othelloController.currentPlayer;
        if (enable) {
            this.othelloController = new othello_env_1.CustomerOthelloEnv(this.othelloController);
        }
        else {
            this.othelloController = new othello_env_1.BattleOthelloEnv(this.othelloType, this.othelloController.getBoard());
        }
        this.othelloController.currentPlayer = cachePlayer;
    };
    DefaultOthelloFacade.prototype.getCurrentPlayer = function () {
        return this.othelloController.currentPlayer;
    };
    DefaultOthelloFacade.prototype.getType = function () {
        return this.othelloType;
    };
    DefaultOthelloFacade.prototype.setType = function (type) {
        this.othelloType = type;
        this.resetGame();
    };
    DefaultOthelloFacade.prototype.getBoard = function () {
        return this.othelloController.getBoard();
    };
    DefaultOthelloFacade.prototype.resetGame = function () {
        this.othelloController = new othello_env_1.BattleOthelloEnv(this.othelloType, null);
    };
    DefaultOthelloFacade.prototype.isGameOver = function () {
        return this.othelloController.isGameOver();
    };
    DefaultOthelloFacade.prototype.putPiece = function (row, col) {
        return this.othelloController.putPiece(row, col);
    };
    DefaultOthelloFacade.prototype.getPieceCounts = function () {
        var _a = this.othelloController.getPieceCounts(), black = _a.black, white = _a.white;
        return new othello_rules_2.PieceCounts(black, white);
    };
    return DefaultOthelloFacade;
}());
