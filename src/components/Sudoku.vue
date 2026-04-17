<template>
    <div class="sudoku">
        <div class="boardItems">
            <div class="boardItem" v-for="(item, index) in sudokuItems" :class="[
                getBlockClass(index),
                { selected: item.selected, marked: item.marked, readonly: item.readonly }
            ]" @click="selectItemEvent(index)">
                {{ item.value }}
            </div>
        </div>
        <div class="numItems">
            <div class="numItem" v-for="item in numItems" :key="item.value"
                @click="item.value === 'C' ? handleNumItemClickEvent(item) : (candidates.length && candidates.includes(item.value) ? handleNumItemClickEvent(item) : null)"
                :style="item.value === 'C' ? '' : (candidates.length && !candidates.includes(item.value) ? 'background:#f3f3f3; color:#bbb; cursor:not-allowed;' : '')">
                <span class="numItemValue"
                    :style="item.value === 'C' ? '' : (candidates.length && candidates.includes(item.value) ? 'color:#1976d2;font-weight:bold;' : '')">
                    {{ item.value }}
                </span>
                <span class="numItemRemaining" v-if="item.remaining > 0">{{ item.remaining }}</span>
            </div>
        </div>
        <div class="controls">
            <div class="control-item" @click="changeGames">换题</div>
            <div class="control-item" @click="restartGame">重玩</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { onMounted, ref } from 'vue';
    import type { ISudokuInput, TSudokuBoard } from '../types/type';
    import { getOneSudoku } from '../api/sudokuApi';

    const sudokuItems = ref<TSudokuBoard>([]);

    // 初始化数独数据
    onMounted(async () => {
        await initSoduku();
        updateRemaining();
    });

    function getBlockIndex(index: number): number {
        const row = Math.floor(index / 9);
        const col = index % 9;
        return Math.floor(row / 3) * 3 + Math.floor(col / 3);
    }

    function getBlockClass(index: number): string {
        const block = getBlockIndex(index) + 1;
        return [1, 3, 5, 7, 9].includes(block) ? 'block-odd' : 'block-even';
    }

    const numItems = ref<ISudokuInput[]>([
        { value: '1', remaining: 9 },
        { value: '2', remaining: 9 },
        { value: '3', remaining: 9 },
        { value: '4', remaining: 9 },
        { value: '5', remaining: 9 },
        { value: '6', remaining: 9 },
        { value: '7', remaining: 9 },
        { value: '8', remaining: 9 },
        { value: '9', remaining: 9 },
        { value: 'C', remaining: 0 }
    ]);

    const candidates = ref<string[]>([]);
    const selectedIndex = ref<number | null>(null);

    function calcCandidates(index: number): string[] {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const used = new Set<string>();
        for (let i = 0; i < 9; i++) {
            if (row * 9 + i !== index) {
                const v = sudokuItems.value[row * 9 + i].value;
                if (v) used.add(v);
            }
            if (i * 9 + col !== index) {
                const v = sudokuItems.value[i * 9 + col].value;
                if (v) used.add(v);
            }
        }
        const blockRow = Math.floor(row / 3) * 3;
        const blockCol = Math.floor(col / 3) * 3;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const idx = (blockRow + r) * 9 + (blockCol + c);
                if (idx !== index) {
                    const v = sudokuItems.value[idx].value;
                    if (v) used.add(v);
                }
            }
        }
        const result: string[] = [];
        for (let n = 1; n <= 9; n++) {
            if (!used.has(n.toString())) {
                result.push(n.toString());
            }
        }
        return result;
    }

    function updateRemaining() {
        const used: Record<string, number> = {
            '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0
        };
        sudokuItems.value.forEach(cell => {
            if (cell.value && used[cell.value] !== undefined) {
                used[cell.value]++;
            }
        });
        numItems.value.forEach(item => {
            if (item.value !== 'C') {
                item.remaining = 9 - used[item.value];
            }
        });
        saveToLocalStorage();
    }

    const selectItemEvent = (index: number) => {
        sudokuItems.value.forEach(item => {
            item.selected = false;
            item.marked = false;
        });
        sudokuItems.value[index].selected = true;
        selectedIndex.value = index;
        const curValue = sudokuItems.value[index].value;
        if (curValue) {
            sudokuItems.value.forEach(item => {
                if (item.value === curValue && !item.selected) {
                    item.marked = true;
                }
            });
            candidates.value = [];
            return;
        }
        const row = Math.floor(index / 9);
        const col = index % 9;
        const block = getBlockIndex(index);
        sudokuItems.value.forEach((item, i) => {
            const r = Math.floor(i / 9);
            const c = i % 9;
            const b = getBlockIndex(i);
            if ((r === row || c === col || b === block) && !item.selected) {
                item.marked = true;
            }
        });
        if (!sudokuItems.value[index].readonly) {
            candidates.value = calcCandidates(index);
        } else {
            candidates.value = [];
        }
        // 不在这里保存，避免重复
    };

    window.addEventListener('keyup', (event) => {
        const selectedItem = sudokuItems.value.find(item => item.selected);
        const keyInt = Number(event.key);
        if (selectedItem && !selectedItem.readonly && keyInt >= 1 && keyInt <= 9) {
            const numItem = numItems.value.find(n => n.value === event.key);
            if (numItem && numItem.remaining <= 0) return;
            const currentValue = selectedItem.value;
            selectedItem.value = event.key === currentValue ? '' : event.key;
            updateRemaining();
            if (selectedIndex.value !== null) selectItemEvent(selectedIndex.value);
            saveToLocalStorage();
        } else if (selectedItem && !selectedItem.readonly && (event.key === 'Backspace' || event.key === 'Delete')) {
            selectedItem.value = '';
            updateRemaining();
            if (selectedIndex.value !== null) selectItemEvent(selectedIndex.value);
            saveToLocalStorage();
        } else if ([
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
        ].includes(event.key)) {
            const currentIndex = sudokuItems.value.findIndex(item => item.selected);
            let newIndex = currentIndex;
            switch (event.key) {
                case 'ArrowLeft':
                    newIndex = currentIndex % 9 === 0 ? currentIndex + 8 : currentIndex - 1;
                    break;
                case 'ArrowRight':
                    newIndex = currentIndex % 9 === 8 ? currentIndex - 8 : currentIndex + 1;
                    break;
                case 'ArrowUp':
                    newIndex = currentIndex < 9 ? currentIndex + 72 : currentIndex - 9;
                    break;
                case 'ArrowDown':
                    newIndex = currentIndex >= 72 ? currentIndex - 72 : currentIndex + 9;
                    break;
            }
            selectItemEvent(newIndex);
        }
    });

    const handleNumItemClickEvent = (item: ISudokuInput) => {
        const selectedItem = sudokuItems.value.find(item => item.selected);
        if (selectedItem && !selectedItem.readonly) {
            if (item.value === 'C') {
                selectedItem.value = '';
                updateRemaining();
                if (selectedIndex.value !== null) selectItemEvent(selectedIndex.value);
                saveToLocalStorage();
            } else if (candidates.value.length > 0) {
                if (item.remaining <= 0) return;
                if (!candidates.value.includes(item.value)) return;
                selectedItem.value = item.value;
                updateRemaining();
                if (selectedIndex.value !== null) selectItemEvent(selectedIndex.value);
                saveToLocalStorage();
            }
        }
    };

    function saveToLocalStorage() {
        // debugger;
        console.log('执行保存');
        const puzzle = JSON.stringify(sudokuItems.value.map(cell => cell.value));
        console.log('保存题目', puzzle);
        localStorage.setItem('sudoku_solution', puzzle);
    }
    async function initSoduku() {
        sudokuItems.value = [];
        // 设置题干
        let puzzle = JSON.parse(localStorage.getItem('sudoku_puzzle') || '[]') as string[];
        let isNewPuzzle = false;
        if (puzzle.length !== 81) {
            localStorage.removeItem('sudoku_puzzle');
            localStorage.removeItem('sudoku_solution'); // 题目变了才清除答案
            puzzle = await getOneSudoku();
            localStorage.setItem('sudoku_puzzle', JSON.stringify(puzzle));
            isNewPuzzle = true;
        }
        if (!puzzle || puzzle.length !== 81) {
            return;
        }
        puzzle.forEach(cell => {
            sudokuItems.value.push({
                value: cell,
                readonly: cell !== '',
                selected: false,
                marked: false,
            });
        });

        // 只有题目没变时才恢复答案
        const solution = JSON.parse(localStorage.getItem('sudoku_solution') || '[]') as string[];
        if (!isNewPuzzle && solution && solution.length === 81) {
            for (let i = 0; i < 81; i++) {
                if (!sudokuItems.value[i].readonly && solution[i]) {
                    sudokuItems.value[i].value = solution[i];
                }
            }
        }
    }
    // 重置游戏，清除本地存储的答案
    async function restartGame() {
        localStorage.removeItem('sudoku_solution');
        await initSoduku();
    }
    // 换题，清除本地存储的题目和答案
    async function changeGames() {
        localStorage.removeItem('sudoku_puzzle');
        localStorage.removeItem('sudoku_solution');
        await initSoduku();
    }
</script>
<style scoped>
    .sudoku {
        display: flex;
        width: fit-content;
        align-items: center;
        flex-direction: column;
        margin: 0 auto;
        padding: 1rem;
    }

    .readonly {
        background: #f3f3f3 !important;
        color: #888 !important;
        font-weight: 100 !important;
    }

    .marked {
        background: #abe6ee !important;
    }

    .selected {
        background: #95afe8 !important;
    }

    .boardItems {
        display: grid;
        grid-template-columns: repeat(9, 50px);
        grid-template-rows: repeat(9, 50px);
        border: 1px solid #e5e4e9;
        width: fit-content;
    }

    .boardItem {
        border: 1px solid #e5e4e9;
        font-size: 2em;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 300;
        cursor: pointer;
        user-select: none;
        transition: background 0.2s;
    }

    .block-odd {
        background: #f6f7fa;
    }

    .block-even {
        background: #e9f0f6;
    }

    .numItems {
        display: flex;
        margin-top: 20px;
        width: fit-content;
    }

    .numItem {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e5e4e9;
        margin: 0 5px;
        border-radius: 5px;
        font-weight: 500;
        user-select: none;
        cursor: pointer;
    }

    .numItemValue {
        font-size: 2rem;
    }

    .numItemRemaining {
        font-size: 0.75rem;
        color: #888;
        margin-left: 2px;
    }

    .numItem:hover {
        background: #c4c4c4;
    }

    .numItem:active {
        background: #d4d4d4;
    }

    .controls {
        display: flex;
        margin-top: 20px;
        width: fit-content;
    }

    .control-item {
        width: 80px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e5e4e9;
        margin: 0 10px;
        border-radius: 5px;
        user-select: none;
        cursor: pointer;
    }

    .control-item:hover {
        background: #d4d4d4;
    }
</style>