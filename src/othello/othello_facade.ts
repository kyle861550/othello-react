
import { IOthelloController, getOthelloController } from './othello_controller';
import { IOthelloType, OthelloType, Piece } from './othello_rules'
import { PieceCounts, Player } from './othello_rules'

export function getOthelloFacade(): IOthelloFacade {
  return new DefaultOthelloFacade();
}


export interface IOthelloFacade {

  getCurrentPlayer(): Player;

  getType(): IOthelloType

  setType(type: IOthelloType): void

  getBoard(): (Piece | null)[][];

  putPiece(row: number, col: number): boolean;
  
  isGameOver(): boolean;
  
  resetGame(): void;

  getPieceCounts(): PieceCounts;

}

class DefaultOthelloFacade implements IOthelloFacade {
  othelloType: IOthelloType = OthelloType.Classic;
  othelloGame: IOthelloController = getOthelloController(this.othelloType);

  getCurrentPlayer(): Player {
    return this.othelloGame.currentPlayer;
  }

  getType(): IOthelloType {
    return this.othelloType;
  }

  setType(type: IOthelloType): void {
    this.othelloType = type;
    this.resetGame();
  }

  getBoard(): (Piece | null)[][] {
    return this.othelloGame.getBoard();
  }
  
  resetGame(): void {
    this.othelloGame = getOthelloController(this.othelloType);
  }

  isGameOver(): boolean {
    return this.othelloGame.isGameOver();
  }

  putPiece(row: number, col: number): boolean {
    return this.othelloGame.putPiece(row, col);
  }

  getPieceCounts(): PieceCounts {
    const { black, white } = this.othelloGame.getPieceCounts();

    return new PieceCounts(black, white);
  }


}
