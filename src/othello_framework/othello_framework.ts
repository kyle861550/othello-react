import {IOthelloRule, Player, Piece, PieceCounts, DefaultOthelloRule} from '../othello';
import {getOthelloAction, IOthelloAction} from './othello_action'

export enum OthelloError {
    ILLEGAL_PLACE,

    ILLEGAL_CUSTOM
}

export interface IOthelloCallback {

    onError(error: OthelloError): void

    onGameOver(winner: Player): void;

    onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void;
    
}

export abstract class DefaultOthelloTemplate implements IOthelloCallback {

    rules: IOthelloRule = new DefaultOthelloRule();

    action: IOthelloAction = getOthelloAction(this.rules, this);
    
    abstract onError(error: OthelloError): void;

    abstract onGameOver(winner: Player): void;

    abstract onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void;

}

export class OthelloGame extends DefaultOthelloTemplate {
    constructor(public onErrorCallback: (error: OthelloError) => void, 
      public onGameOverCallback: (winner: Player) => void, 
      public onBoardChangeCallback: (counts: PieceCounts, board: (Piece | null)[][]) => void) {
        super();
    }
  
    onError(error: OthelloError): void {
        this.onErrorCallback(error);
    }
  
    onGameOver(winner: Player): void {
        this.onGameOverCallback(winner);
    }
  
    onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void {
        this.onBoardChangeCallback(counts, board);
    }
  }