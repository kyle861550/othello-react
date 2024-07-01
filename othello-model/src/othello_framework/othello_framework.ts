import {IOthelloRule, Player, Piece, PieceCounts, DefaultOthelloRule} from '../othello_core';
import {getOthelloAction, IOthelloAction} from './othello_action'

export enum OthelloError {
    ILLEGAL_PLACE,
    ILLEGAL_CUSTOM,
    EXCHANGE_PLAYER,
    KEEP_PUTTING,
}

export interface IOthelloCallback {

    onError(error: OthelloError): void

    onRestarted(): void

    onGameOver(winner: Player | null): void;

    onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void;
    
}

export abstract class DefaultOthelloTemplate implements IOthelloCallback {

    rules: IOthelloRule = new DefaultOthelloRule();

    action: IOthelloAction = getOthelloAction(this.rules, this);
    
    abstract onError(error: OthelloError): void;
    
    abstract onRestarted(): void

    abstract onGameOver(winner: Player | null): void;

    abstract onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void;

}

export class OthelloGame extends DefaultOthelloTemplate {

    constructor(
        public onRestartedCallback: () => void,
        public onErrorCallback: (error: OthelloError) => void, 
        public onGameOverCallback: (winner: Player) => void, 
        public onBoardChangeCallback: (counts: PieceCounts, board: (Piece | null)[][]) => void) {
        super();
    }
  
    onError(error: OthelloError): void {
        this.onErrorCallback(error);
    }

    onRestarted(): void {
        this.onRestartedCallback();
    }
  
    onGameOver(winner: Player): void {
        this.onGameOverCallback(winner);
    }
  
    onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void {
        this.onBoardChangeCallback(counts, board);
    }
  }