// 单元格类型
export interface ISudokuCell {
    value: string; // 当前值，1-9 或 null 表示空格
    readonly?: boolean;   // 是否为初始给定值
    selected?: boolean; // 是否被选中（用于 UI 高亮）
    marked?: boolean; // 是否被标记（用于 UI 高亮）
}

// 整个数独盘面类型
export type TSudokuBoard = ISudokuCell[]; // 9x9=81 数组

// 数独输入
export interface ISudokuInput {
    value: string; // 输入的值，1-9 或 null 表示清空
    remaining: number; // 剩余输入次数
}

// 消消乐
export interface IEliminateCell {
    type: number;
    clear: boolean;
    fulldown: boolean;
}
export interface IEliminateClearResult {
    columnArray: number[];
    cellIndexArray: number[][];
}