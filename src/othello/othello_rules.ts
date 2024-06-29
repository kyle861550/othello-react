export enum Player {
    BLACK_PLAYER = 'black_player',
    WHITE_PLAYER = 'white_player'
}

export enum Piece {
    BLACK,
    WHITE
}

export class PieceCounts {
    black: number; 
    white: number
  
    constructor(black: number, white: number) {
      this.black = black;
      this.white = white;
    }
}

export interface IOthelloType {

    rows: number;
    cols: number;
    descript: string;

}

export interface IOthelloRule {
    readonly minSize: number;

    isIllegalSize(size: number): boolean;

    values(): IOthelloType[];

    getDefaultCustomType(): IOthelloType

    createCustomOthelloType(size: number): IOthelloType
}

export class OthelloType implements IOthelloType {
    static SmallBoard = new OthelloType(6, "Small Board");
    static Classic = new OthelloType(8, "Classic");
    static LargeBoard = new OthelloType(12, "Large Board");
    static Custom = new OthelloType(4, 'Custom');
    
    rows: number;
    cols: number;
    descript: string;

    constructor(len: number, descript: string) {
        this.rows = len;
        this.cols = len;
        this.descript = descript;
    }

}

export class DefaultOthelloRule implements IOthelloRule {

    minSize: number = 2;
    
    isIllegalSize(size: number): boolean {
        return isNaN(size) || size % 2 !== 0 || size <= this.minSize;
    }

    values(): IOthelloType[] {
        return [
            OthelloType.Classic, 
            OthelloType.LargeBoard, 
            OthelloType.SmallBoard,
            OthelloType.Custom,];
    }

    getDefaultCustomType(): IOthelloType {
        return OthelloType.Custom
    }

    createCustomOthelloType(size: number): IOthelloType {
        return new OthelloType(size, OthelloType.Custom.descript)
    }

}