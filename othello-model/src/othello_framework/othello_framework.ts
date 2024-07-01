import {IOthelloRule, Player, Piece, PieceCounts, DefaultOthelloRule, IOthelloType} from '../othello_core';
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

export abstract class DefaultOthelloActivity implements IOthelloCallback {

    rules: IOthelloRule = new DefaultOthelloRule();

    action: IOthelloAction = getOthelloAction(this.rules, this);
    
    abstract onError(error: OthelloError): void;
    
    abstract onRestarted(): void

    abstract onGameOver(winner: Player | null): void;

    abstract onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void;

}

export class OthelloGameTotalEvent extends DefaultOthelloActivity {

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

  export function createOthelloGame(
    onRestarted: () => void,
    onError: (error: OthelloError) => void,
    onGameOver: (winner: Player | null) => void,
    onBoardChange: (counts: PieceCounts, board: (Piece | null)[][]) => void
) {
    const game = new OthelloGameTotalEvent(onRestarted, onError, onGameOver, onBoardChange);

    return {
        rules: game.rules,
        action: game.action,
        getBoard: () => game.action.information.getBoard(),
        getCounts: () => game.action.information.getPieceCounts(),
        getCurrentPlayer: () => game.action.information.getCurrentPlayer(),
        setType: (type: IOthelloType) => game.action.setType(type),
        putPiece: (row: number, col: number) => game.action.putPiece(row, col),
        resetGame: () => game.action.resetGame(),
    };
    
}