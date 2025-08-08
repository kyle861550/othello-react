import {IOthelloCallback, OthelloError} from './othello_framework'
import {getOthelloFacade, IOthelloRule, IOthelloType, IOthelloFacade, Player, Piece, IPieceCounts} from '../othello_core';
import { IOthelloCustomer } from '../othello_core/othello_facade';
import { BoardResult } from '../othello_core/othello_env';


export function getOthelloAction(rule: IOthelloRule, callback: IOthelloCallback): IOthelloAction {
    return new DefaultOthelloAction(rule, callback);
}

export interface IOthelloInformation {
    getCurrentPlayer(): Player;
    
    getType(): IOthelloType
  
    getPieceCounts(): IPieceCounts;

    getBoard(): (Piece | null)[][]
  
}
  
export interface IOthelloAction {

    readonly information: IOthelloInformation;
    
    readonly customerBoard: IOthelloCustomer

    setType(type: IOthelloType): void

    putPiece(params: { row: number, col: number }): void;

    resetGame(): void;
}

class DefaultOthelloAction implements IOthelloAction {
    
    private othello: IOthelloFacade = getOthelloFacade();

    callback: IOthelloCallback
    rule: IOthelloRule

    information: IOthelloInformation = {
        getCurrentPlayer: (): Player => {
            return this.othello.getStatus().currentPlayer;
        },
        getType: (): IOthelloType => {
            return this.othello.getStatus().type;
        },
        getPieceCounts: (): IPieceCounts => {
            return this.othello.getBoardData().counts;
        },
        getBoard: (): (Piece | null)[][] => {
            return this.othello.getBoardData().board;
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

    putPiece(params: {row: number, col: number}): void {
        const putResult = this.othello.putPiece(params);
        const boardData = this.othello.getBoardData();
        const winner = this.getWinner(boardData.counts);
    
        switch(putResult) {
            case BoardResult.PUT_SUCCESS:
                this.callback.onBoardChange(boardData);
            
                if (this.othello.isGameOver()) {
                    this.callback.onGameOver(winner);
                }
                break;
                
            case BoardResult.PUT_SUCCESS_KEEP_PUT:
                this.callback.onError(OthelloError.KEEP_PUTTING);
                this.callback.onBoardChange(boardData);
            
                if (this.othello.isGameOver()) {
                    this.callback.onGameOver(winner);
                }
                break;

            case BoardResult.PUT_FAIL:
            case BoardResult.PUT_FAIL_EXCHANGE_PLAYER:
                if (this.othello.isGameOver()) {
                    this.callback.onBoardChange(boardData);
                    this.callback.onGameOver(winner);
                    return;
                }
                const errorType = putResult == BoardResult.PUT_FAIL_EXCHANGE_PLAYER ? OthelloError.EXCHANGE_PLAYER : OthelloError.ILLEGAL_PLACE
    
                this.callback.onError(errorType);
                break;
        }
        
    }
    
    private getWinner(counts: IPieceCounts): Player | null {
        if(counts.black === counts.white) {
            return null;
        }

        return counts.black > counts.white ? Player.BLACK_PLAYER : Player.WHITE_PLAYER;
    }    

    resetGame(): void {
        this.othello.resetGame();
        this.callback.onRestarted();

        const boardData = this.othello.getBoardData();
        this.callback.onBoardChange(boardData);
    }

}