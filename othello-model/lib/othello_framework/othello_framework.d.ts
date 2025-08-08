import { IOthelloRule, Player, IOthelloType } from '../othello_core';
import { IBoardData } from '../othello_core/othello_facade';
import { IOthelloAction } from './othello_action';
export declare enum OthelloError {
    ILLEGAL_PLACE = 0,
    ILLEGAL_CUSTOM = 1,
    EXCHANGE_PLAYER = 2,
    KEEP_PUTTING = 3
}
export interface IOthelloActivity {
    readonly rules: IOthelloRule;
    readonly action: IOthelloAction;
}
export interface IOthelloCallback {
    onError(error: OthelloError): void;
    onRestarted(): void;
    onGameOver(winner: Player | null): void;
    onBoardChange(boardData: IBoardData): void;
}
export declare abstract class DefaultOthelloActivity implements IOthelloActivity, IOthelloCallback {
    rules: IOthelloRule;
    action: IOthelloAction;
    abstract onError(error: OthelloError): void;
    abstract onRestarted(): void;
    abstract onGameOver(winner: Player | null): void;
    abstract onBoardChange(boardData: IBoardData): void;
}
export declare class OthelloGameTotalEvent extends DefaultOthelloActivity {
    onRestartedCallback: () => void;
    onErrorCallback: (error: OthelloError) => void;
    onGameOverCallback: (winner: Player) => void;
    onBoardChangeCallback: (boardData: IBoardData) => void;
    constructor(onRestartedCallback: () => void, onErrorCallback: (error: OthelloError) => void, onGameOverCallback: (winner: Player) => void, onBoardChangeCallback: (boardData: IBoardData) => void);
    onError(error: OthelloError): void;
    onRestarted(): void;
    onGameOver(winner: Player): void;
    onBoardChange(boardData: IBoardData): void;
}
export declare function createOthelloGame(onRestarted: () => void, onError: (error: OthelloError) => void, onGameOver: (winner: Player | null) => void, onBoardChange: (boardData: IBoardData) => void): {
    rules: IOthelloRule;
    action: IOthelloAction;
    getBoard: () => (import("../othello_core").Piece | null)[][];
    getCounts: () => import("../othello_core").IPieceCounts;
    getCurrentPlayer: () => Player;
    setType: (type: IOthelloType) => void;
    putPiece: (params: {
        row: number;
        col: number;
    }) => void;
    resetGame: () => void;
};
