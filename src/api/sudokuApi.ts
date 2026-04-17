import { apiRequest } from "./request";

export async function getSudokuById(data: { id: string }) {
    return apiRequest.post("/sudoku/generate", data);
}
export async function getOneSudoku() {
    const result = await apiRequest.get("/api/sudoku/") as {
        code: number;
        message: string;
        data: {
            id: number;
            puzzle: string;
            solution: string;
        }
    };
    console.log("API 返回的数独数据:", result);
    if (result && result.code === 0 && result.data && result.data.puzzle && result.data.puzzle.length === 81) {
        return result.data.puzzle.split("").map(cell => cell === '0' ? '' : cell);
    }
    return [];
}