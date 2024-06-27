
import { IOthelloGame, getOthelloGame } from './othello_games';
import { IOthelloType, OthelloType, Piece } from './othello_rules'
import { PieceCounts } from './othello_rules'

export function getOthelloFacade(): IOthelloFacade {
  return new DefaultOthelloFacade();
}


export interface IOthelloFacade {
  
  getBoard(): (Piece | null)[][];

  setOthelloType(type: IOthelloType): void;

  putPiece(row: number, col: number): boolean;
  
  isGameOver(): boolean;
  
  resetGame(): void;

  getPieceCounts(): PieceCounts;

}

class DefaultOthelloFacade implements IOthelloFacade {
  othelloType: IOthelloType = OthelloType.Classic;
  othelloGame: IOthelloGame = getOthelloGame(this.othelloType);

  getBoard(): (Piece | null)[][] {
    return this.othelloGame.getBoard();
  }

  setOthelloType(type: IOthelloType): void {
    this.othelloType = type;
  }
  
  resetGame(): void {
    this.othelloGame = getOthelloGame(this.othelloType);
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
