
import { IOthelloEnv, BattleOthelloEnv, CustomerOthelloEnv, BoardResult } from './othello_env';
import { IOthelloType, OthelloType, Piece } from './othello_rules'
import { PieceCounts, Player } from './othello_rules'

export function getOthelloFacade(): IOthelloFacade {
  return new DefaultOthelloFacade();
}

export interface IOthelloCustomer {

  setCustomBoard(enable: boolean): void;

  setCurrentPlayer(player: Player): void

}

export interface IOthelloFacade extends IOthelloCustomer {

  getCurrentPlayer(): Player;

  getType(): IOthelloType

  setType(type: IOthelloType): void

  getBoard(): (Piece | null)[][];

  putPiece(row: number, col: number): BoardResult;
  
  isGameOver(): boolean;
  
  resetGame(): void;

  getPieceCounts(): PieceCounts;

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

  getCurrentPlayer(): Player {
    return this.othelloController.currentPlayer;
  }

  getType(): IOthelloType {
    return this.othelloType;
  }

  setType(type: IOthelloType): void {
    this.othelloType = type;
    this.resetGame();
  }

  getBoard(): (Piece | null)[][] {
    return this.othelloController.getBoard();
  }
  
  resetGame(): void {
    this.othelloController = new BattleOthelloEnv(this.othelloType, null);
  }

  isGameOver(): boolean {
    return this.othelloController.isGameOver();
  }

  putPiece(row: number, col: number): BoardResult {
    return this.othelloController.putPiece(row, col);
  }

  getPieceCounts(): PieceCounts {
    const { black, white } = this.othelloController.getPieceCounts();

    return new PieceCounts(black, white);
  }


}
