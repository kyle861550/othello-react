import { IOthelloRule, Player, Piece, PieceCounts, IOthelloType } from '../othello_core';
import { IOthelloAction } from './othello_action';
export declare enum OthelloError {
    ILLEGAL_PLACE = 0,
    ILLEGAL_CUSTOM = 1,
    EXCHANGE_PLAYER = 2,
    KEEP_PUTTING = 3
}
export interface IOthelloCallback {
    onError(error: OthelloError): void;
    onRestarted(): void;
    onGameOver(winner: Player | null): void;
    onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void;
}
export declare abstract class DefaultOthelloTemplate implements IOthelloCallback {
    rules: IOthelloRule;
    action: IOthelloAction;
    abstract onError(error: OthelloError): void;
    abstract onRestarted(): void;
    abstract onGameOver(winner: Player | null): void;
    abstract onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void;
}
export declare class OthelloGame extends DefaultOthelloTemplate {
    onRestartedCallback: () => void;
    onErrorCallback: (error: OthelloError) => void;
    onGameOverCallback: (winner: Player) => void;
    onBoardChangeCallback: (counts: PieceCounts, board: (Piece | null)[][]) => void;
    constructor(onRestartedCallback: () => void, onErrorCallback: (error: OthelloError) => void, onGameOverCallback: (winner: Player) => void, onBoardChangeCallback: (counts: PieceCounts, board: (Piece | null)[][]) => void);
    onError(error: OthelloError): void;
    onRestarted(): void;
    onGameOver(winner: Player): void;
    onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void;
}
export declare function createOthelloGame(onRestarted: () => void, onError: (error: OthelloError) => void, onGameOver: (winner: Player | null) => void, onBoardChange: (counts: PieceCounts, board: (Piece | null)[][]) => void): {
    rules: IOthelloRule;
    action: IOthelloAction;
    getBoard: () => (Piece | null)[][];
    getCounts: () => PieceCounts;
    getCurrentPlayer: () => Player;
    setType: (type: IOthelloType) => void;
    putPiece: (row: number, col: number) => void;
    resetGame: () => void;
};
