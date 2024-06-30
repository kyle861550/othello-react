import { IOthelloCallback } from './othello_framework';
import { IOthelloRule, IOthelloType, Player, Piece, PieceCounts } from '../othello_core';
import { IOthelloCustomer } from '../othello_core/othello_facade';
export declare function getOthelloAction(rule: IOthelloRule, callback: IOthelloCallback): IOthelloAction;
export interface IOthelloInformation {
    getCurrentPlayer(): Player;
    getType(): IOthelloType;
    getPieceCounts(): PieceCounts;
    getBoard(): (Piece | null)[][];
}
export interface IOthelloAction {
    readonly information: IOthelloInformation;
    readonly customerBoard: IOthelloCustomer;
    setType(type: IOthelloType): void;
    putPiece(row: number, col: number): void;
    resetGame(): void;
}
