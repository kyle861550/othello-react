import {IOthelloCallback, OthelloError} from './othello_framework'
import {getOthelloFacade, IOthelloRule, IOthelloType, IOthelloFacade, Player, Piece, PieceCounts} from '../othello';


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
            return this.othello.getBoard();
        },
    };

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
        let isSuccess = this.othello.putPiece(row, col);
        let board = this.othello.getBoard();
        console.log("===> is put success " + isSuccess);

        if(!isSuccess) {
            let preCheckGameOver = this.othello.isGameOver();
    
            console.log("===> preCheckGameOver " + preCheckGameOver);
    
            if(preCheckGameOver) {
                let counts = this.othello.getPieceCounts();
                let winner = counts.black > counts.white ? Player.BLACK_PLAYER : Player.WHITE_PLAYER;
                this.callback.onBoardChange(counts, board);
                this.callback.onGameOver(winner);
                return
            }
            
            this.callback.onError(OthelloError.ILLEGAL_PLACE);
            return
        }
        
        let counts = this.othello.getPieceCounts();
        this.callback.onBoardChange(counts, board);

        let finalCheckGameOver = this.othello.isGameOver();
        console.log("===> finalCheckGameOver " + finalCheckGameOver);

        if(finalCheckGameOver) {
            let counts = this.othello.getPieceCounts();
            let winner = counts.black > counts.white ? Player.BLACK_PLAYER : Player.WHITE_PLAYER;
            this.callback.onGameOver(winner);
            return
        }
    }

    resetGame(): void {
        this.othello.resetGame();

        let counts = this.othello.getPieceCounts();
        let board = this.othello.getBoard();
        
        this.callback.onBoardChange(counts, board);
    }

}