// 单元格类型
export interface SudokuCell {
	value: string; // 当前值，1-9 或 null 表示空格
    readonly?: boolean;   // 是否为初始给定值
    selected?: boolean; // 是否被选中（用于 UI 高亮）
}

// 整个数独盘面类型
export type SudokuBoard = SudokuCell[]; // 9x9=81 数组
