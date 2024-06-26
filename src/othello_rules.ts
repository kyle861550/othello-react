export enum Player {
    BLACK_PLAYER = 'black_player',
    WHITE_PLAYER = 'white_player'
}

export enum Piece {
    BLACK,
    WHITE
}

export interface IOthelloType {

    rows: number;
    cols: number;
    descript: string;

}

export class OthelloType implements IOthelloType {
    static SmallBoard = new OthelloType(6, "Small Board");
    static Classic = new OthelloType(8, "Classic");
    static LargeBoard = new OthelloType(10, "Large Board");
    
    rows: number;
    cols: number;
    descript: string;

    private constructor(len: number, descript: string) {
        this.rows = len;
        this.cols = len;
        this.descript = descript;
    }

    static values() {
        return [OthelloType.Classic, OthelloType.LargeBoard, OthelloType.SmallBoard];
    }

}