import { Player, Piece, IOthelloType } from './othello_rules';
import { IOthelloCore } from './othello_core';
export declare enum BoardResult {
    PUT_SUCCESS = 0,
    PUT_FAIL = 1,
    PUT_FAIL_EXCHANGE_PLAYER = 2
}
export interface IOthelloEnv {
    currentPlayer: Player;
    getBoard(): (Piece | null)[][];
    getPieceCounts(): {
        black: number;
        white: number;
    };
    putPiece(row: number, col: number): BoardResult;
    isGameOver(): boolean;
}
export declare class CustomerOthelloEnv implements IOthelloEnv {
    controller: IOthelloEnv;
    currentPlayer: Player;
    constructor(controller: IOthelloEnv);
    getBoard(): (Piece | null)[][];
    getPieceCounts(): {
        black: number;
        white: number;
    };
    putPiece(row: number, col: number): BoardResult;
    isGameOver(): boolean;
}
export declare class BattleOthelloEnv implements IOthelloEnv {
    board: (Piece | null)[][];
    currentPlayer: Player;
    othelloCore: IOthelloCore;
    constructor(othelloType: IOthelloType, board: (Piece | null)[][] | null);
    getBoard(): (Piece | null)[][];
    isGameOver(): boolean;
    convertPlayer(): void;
    getPieceCounts(): {
        black: number;
        white: number;
    };
    putPiece(row: number, col: number): BoardResult;
}
