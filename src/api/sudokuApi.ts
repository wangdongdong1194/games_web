import { apiRequest } from "./request";

export async function getSudokuById(data: { id: string }) {
    return apiRequest.post("/sudoku/generate", data);
}
export function getOneSudoku() {
    return [
          '2', '9', '', '8', '7', '3', '', '1', ''
        , '4', '', '', '', '', '5', '9', '2', ''
        , '', '1', '', '', '2', '4', '', '', ''
        , '', '', '', '', '8', '9', '6', '', ''
        , '', '', '4', '', '', '', '8', '3', ''
        , '', '8', '2', '3', '1', '', '5', '', ''
        , '', '', '9', '2', '3', '8', '', '', '7'
        , '8', '', '', '', '4', '7', '', '', ''
        , '3', '', '5', '', '9', '', '2', '8', '4'
    ];
}