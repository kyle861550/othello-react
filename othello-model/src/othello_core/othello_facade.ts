import { IOthelloEnv, BattleOthelloEnv, CustomerOthelloEnv, BoardResult } from './othello_env';
import { IOthelloType, OthelloType, Piece } from './othello_rules'
import { IPieceCounts, Player } from './othello_rules'

export function getOthelloFacade(): IOthelloFacade {
  return new DefaultOthelloFacade();
}

export interface IOthelloCustomer {

  setType(type: IOthelloType): void

  setCustomBoard(enable: boolean): void;

  setCurrentPlayer(player: Player): void

}

export interface IBoardData {

  counts: IPieceCounts;

  board: (Piece | null)[][];

}

export interface IGameData {

  get type(): IOthelloType;

  get currentPlayer(): Player;

}

export interface IOthelloFacade extends IOthelloCustomer {
  
  getStatus(): IGameData;

  getBoardData(): IBoardData;
  
  putPiece(params: { row: number, col: number }): BoardResult;

  isGameOver(): boolean;
  
  resetGame(): void;

}

class DefaultOthelloFacade implements IOthelloFacade {
  othelloType: IOthelloType = OthelloType.Classic;
  othelloController: IOthelloEnv = new BattleOthelloEnv(this.othelloType, null);

  setCurrentPlayer(player: Player): void {
    this.othelloController.currentPlayer = player
  }

  setCustomBoard(enable: boolean): void {
    let cachePlayer = this.othelloController.currentPlayer;

    if(enable) {
      this.othelloController = new CustomerOthelloEnv(this.othelloController);
    } else {
      this.othelloController = new BattleOthelloEnv(this.othelloType, this.othelloController.getBoard()); 
    }

    this.othelloController.currentPlayer = cachePlayer;
  }

  setType(type: IOthelloType): void {
    this.othelloType = type;
    this.resetGame();
  }
  
  resetGame(): void {
    this.othelloController = new BattleOthelloEnv(this.othelloType, null);
  }

  isGameOver(): boolean {
    return this.othelloController.isGameOver();
  }

  putPiece(params: { row: number, col: number }): BoardResult {
    return this.othelloController.putPiece(params);
  }

  getStatus(): IGameData {
    return {
      type: this.othelloType,
      currentPlayer: this.othelloController.currentPlayer,
    }
  }

  getBoardData(): IBoardData {
    return {
      counts: this.othelloController.getPieceCounts(),
      board: this.othelloController.getBoard().map(row => row.slice())
    }
  }

}
