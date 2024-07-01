"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOthelloFacade = getOthelloFacade;
const othello_env_1 = require("./othello_env");
const othello_rules_1 = require("./othello_rules");
const othello_rules_2 = require("./othello_rules");
function getOthelloFacade() {
    return new DefaultOthelloFacade();
}
class DefaultOthelloFacade {
    constructor() {
        this.othelloType = othello_rules_1.OthelloType.Classic;
        this.othelloController = new othello_env_1.BattleOthelloEnv(this.othelloType, null);
    }
    setCurrentPlayer(player) {
        this.othelloController.currentPlayer = player;
    }
    setCustomBoard(enable) {
        let cachePlayer = this.othelloController.currentPlayer;
        if (enable) {
            this.othelloController = new othello_env_1.CustomerOthelloEnv(this.othelloController);
        }
        else {
            this.othelloController = new othello_env_1.BattleOthelloEnv(this.othelloType, this.othelloController.getBoard());
        }
        this.othelloController.currentPlayer = cachePlayer;
    }
    getCurrentPlayer() {
        return this.othelloController.currentPlayer;
    }
    getType() {
        return this.othelloType;
    }
    setType(type) {
        this.othelloType = type;
        this.resetGame();
    }
    getBoard() {
        return this.othelloController.getBoard().map(row => row.slice());
    }
    resetGame() {
        this.othelloController = new othello_env_1.BattleOthelloEnv(this.othelloType, null);
    }
    isGameOver() {
        return this.othelloController.isGameOver();
    }
    putPiece(row, col) {
        return this.othelloController.putPiece(row, col);
    }
    getPieceCounts() {
        const { black, white } = this.othelloController.getPieceCounts();
        return new othello_rules_2.PieceCounts(black, white);
    }
}
