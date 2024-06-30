import {IOthelloCallback, OthelloError} from './othello_framework'
import {getOthelloFacade, IOthelloRule, IOthelloType, IOthelloFacade, Player, Piece, PieceCounts} from '../othello_core';
import { IOthelloCustomer } from '../othello_core/othello_facade';


export function getOthelloAction(rule: IOthelloRule, callback: IOthelloCallback): IOthelloAction {
    return new DefaultOthelloAction(rule, callback);
}

export interface IOthelloInformation {
    getCurrentPlayer(): Player;
    
    getType(): IOthelloType
  
    getPieceCounts(): PieceCounts;

    getBoard(): (Piece | null)[][]
  
}
  
export interface IOthelloAction {

    readonly information: IOthelloInformation;
    
    readonly customerBoard: IOthelloCustomer

    setType(type: IOthelloType): void

    putPiece(row: number, col: number): void;

    resetGame(): void;
}

class DefaultOthelloAction implements IOthelloAction {
    
    private othello: IOthelloFacade = getOthelloFacade();

    callback: IOthelloCallback
    rule: IOthelloRule

    information: IOthelloInformation = {
        getCurrentPlayer: (): Player => {
            return this.othello.getCurrentPlayer();
        },
        getType: (): IOthelloType => {
            return this.othello.getType();
        },
        getPieceCounts: (): PieceCounts => {
            return this.othello.getPieceCounts();
        },
        getBoard: (): (Piece | null)[][] => {
            return this.othello.getBoard().map(row => row.slice());;
        },
    };

    customerBoard: IOthelloCustomer = this.othello;

    constructor(rule: IOthelloRule, callback: IOthelloCallback) {
        this.rule = rule;
        this.callback = callback;
    }

    setType(type: IOthelloType): void {
        if(this.rule.isIllegalSize(type.rows)) {
            this.callback.onError(OthelloError.ILLEGAL_CUSTOM);
            return
        }

        this.othello.setType(type);

        this.resetGame();
    }

    putPiece(row: number, col: number): void {
        const isSuccess = this.othello.putPiece(row, col);
        const board = this.othello.getBoard();
        const counts = this.othello.getPieceCounts();
    
        if (!isSuccess) {
            if (this.othello.isGameOver()) {
                this.callback.onBoardChange(counts, board);
                this.callback.onGameOver(this.getWinner(counts));
            } else {
                this.callback.onError(OthelloError.ILLEGAL_PLACE);
            }
            return;
        }
    
        this.callback.onBoardChange(counts, board);
    
        if (this.othello.isGameOver()) {
            this.callback.onGameOver(this.getWinner(counts));
        }
    }
    
    private getWinner(counts: PieceCounts): Player | null {
        if(counts.black === counts.white) {
            return null;
        }

        return counts.black > counts.white ? Player.BLACK_PLAYER : Player.WHITE_PLAYER;
    }    

    resetGame(): void {
        this.othello.resetGame();
        this.callback.onRestarted();

        let counts = this.othello.getPieceCounts();
        let board = this.othello.getBoard();
        
        this.callback.onBoardChange(counts, board);
    }

}