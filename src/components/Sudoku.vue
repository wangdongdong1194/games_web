<template>
    <div class="sudoku">
        <!-- 棋盘 -->
        <div class="boardItems">
            <div class="boardItem" v-for="(item, index) in sudokuItems" :class="[
                getBlockClass(index),
                { selected: item.selected, marked: item.marked, readonly: item.readonly }
            ]" @click="selectItemEvent(index)">
                {{ item.value }}
            </div>
        </div>
        <!-- 数字输入：点击棋盘上的格子选中，然后按键盘上的数字键（1-9）输入数字。 -->
        <div class="numItems">
            <div class="numItem" v-for="item in numItems" :key="item.value" @click="handleNumItemClickEvent(item)">
                <span class="numItemValue">{{ item.value }}</span>
                <span class="numItemRemaining" v-if="item.remaining > 0">{{ item.remaining }}</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue'
    import type { ISudokuInput, TSudokuBoard } from '../types/type';
    import { getOneSudoku } from '../api/sudokuApi';

    // 初始化数独棋盘数据，默认值为1，所有格子都可编辑且未选中
    const sudokuItems = ref<TSudokuBoard>([]);
    // 从接口获取数独数据，填充到棋盘中，并设置有值的格子为不可编辑
    const sudokuData = getOneSudoku();
    sudokuData.forEach(cell => {
        sudokuItems.value.push({
            value: cell,
            readonly: cell !== '', // 有值的格子不可编辑
            selected: false,
            marked: false,
        });
    });

    // 获取小九宫格索引（0-8）
    function getBlockIndex(index: number): number {
        const row = Math.floor(index / 9);
        const col = index % 9;
        return Math.floor(row / 3) * 3 + Math.floor(col / 3);
    }

    // 返回对应的 block class
    function getBlockClass(index: number): string {
        const block = getBlockIndex(index) + 1; // 1-9
        // 1,3,5,7,9 一种色，2,4,6,8 一种色
        if ([1, 3, 5, 7, 9].includes(block)) {
            return 'block-odd';
        } else {
            return 'block-even';
        }
    }

    // 输入数字
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
        { value: '⬅️', remaining: 0 }
    ]);

    // 统计剩余数量
    function updateRemaining() {
        // 统计每个数字已用数量
        const used: Record<string, number> = {
            '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0
        };
        sudokuItems.value.forEach(cell => {
            if (cell.value && used[cell.value] !== undefined) {
                used[cell.value]++;
            }
        });
        numItems.value.forEach(item => {
            if (item.value !== '⬅️') {
                item.remaining = 9 - used[item.value];
            }
        });
    }

    // 给每个元素添加点击选中事件
    const selectItemEvent = (index: number) => {
        // 先清除所有标记
        sudokuItems.value.forEach(item => {
            item.selected = false;
            item.marked = false;
        });
        // 选中格子
        sudokuItems.value[index].selected = true;

        // 计算横、竖、宫
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
    };

    // 给每个选中节点添加键盘输入数字事件
    window.addEventListener('keyup', (event) => {
        const selectedItem = sudokuItems.value.find(item => item.selected);
        const keyInt = Number(event.key);
        if (selectedItem && !selectedItem.readonly && keyInt >= 1 && keyInt <= 9) {
            // 判断剩余次数
            const numItem = numItems.value.find(n => n.value === event.key);
            if (numItem && numItem.remaining <= 0) {
                return;
            }
            const currentValue = selectedItem.value; // 记录当前值
            selectedItem.value = event.key === currentValue ? '' : event.key; // 如果输入的数字和当前值相同，则清空，否则更新为新值
            updateRemaining();
            console.log(`Updated selected item value: ${selectedItem.value}`);
        } else if (selectedItem && !selectedItem.readonly && (event.key === 'Backspace' || event.key === 'Delete')) {
            selectedItem.value = '';
            updateRemaining();
            console.log(`Cleared selected item value`);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            // 处理方向键移动选中格子
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

    // 给每个输入数字节点添加点击事件
    const handleNumItemClickEvent = (item: ISudokuInput) => {
        const selectedItem = sudokuItems.value.find(item => item.selected);
        if (selectedItem && !selectedItem.readonly) {
            if (item.value === '⬅️') {
                selectedItem.value = '';
                updateRemaining();
                console.log(`Cleared selected item value`);
            } else {
                // 判断剩余次数
                if (item.remaining <= 0) {
                    return;
                }
                selectedItem.value = item.value;
                updateRemaining();
                console.log(`Updated selected item value: ${selectedItem.value}`);
            }
        }
    };

    // 初始化时同步一次
    updateRemaining();
</script>
<style scoped>
        .readonly {
            background: #f3f3f3 !important;
            color: #888 !important;
            font-weight: 100 !important;
        }
    .marked {
        background: #abe6ee !important;
        /* 横竖宫高亮色，淡黄 */
    }

    .selected {
        background: #95afe8 !important;
        /* 选中格子高亮，蓝色更深 */
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
</style>