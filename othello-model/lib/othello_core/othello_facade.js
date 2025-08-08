import { BattleOthelloEnv, CustomerOthelloEnv } from './othello_env';
import { OthelloType } from './othello_rules';
export function getOthelloFacade() {
    return new DefaultOthelloFacade();
}
class DefaultOthelloFacade {
    constructor() {
        this.othelloType = OthelloType.Classic;
        this.othelloController = new BattleOthelloEnv(this.othelloType, null);
    }
    setCurrentPlayer(player) {
        this.othelloController.currentPlayer = player;
    }
    setCustomBoard(enable) {
        let cachePlayer = this.othelloController.currentPlayer;
        if (enable) {
            this.othelloController = new CustomerOthelloEnv(this.othelloController);
        }
        else {
            this.othelloController = new BattleOthelloEnv(this.othelloType, this.othelloController.getBoard());
        }
        this.othelloController.currentPlayer = cachePlayer;
    }
    setType(type) {
        this.othelloType = type;
        this.resetGame();
    }
    resetGame() {
        this.othelloController = new BattleOthelloEnv(this.othelloType, null);
    }
    isGameOver() {
        return this.othelloController.isGameOver();
    }
    putPiece(params) {
        return this.othelloController.putPiece(params);
    }
    getStatus() {
        return {
            type: this.othelloType,
            currentPlayer: this.othelloController.currentPlayer,
        };
    }
    getBoardData() {
        return {
            counts: this.othelloController.getPieceCounts(),
            board: this.othelloController.getBoard().map(row => row.slice())
        };
    }
}
