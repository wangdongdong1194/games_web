<template>
    <div class="sudoku">
        <!-- 棋盘 -->
        <div class="boardItems">
            <div class="boardItem" v-for="(item, index) in sudokuItems" :class="[
                getBlockClass(index),
                { selected: item.selected }
            ]" @click="selectItemEvent(index)">
                {{ item.value }}
            </div>
        </div>
        <!-- 数字输入：点击棋盘上的格子选中，然后按键盘上的数字键（1-9）输入数字。 -->
        <div class="numItems">
            <div class="numItem" v-for="num in numItems" :key="num" @click="handleNumItemClickEvent(num)">{{ num }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue'
    import type { SudokuBoard } from '../types/type';

    // 初始化数独棋盘数据，默认值为1，所有格子都可编辑且未选中
    const sudokuItems = ref<SudokuBoard>([]);
    for (let i = 0; i < 81; i++) {
        sudokuItems.value.push({
            value: '1',
            readonly: false,
            selected: false,
            // ...可扩展属性
        });
    }

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
    const numItems = ref<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '⬅️']);

    // 给每个元素添加点击选中事件
    const selectItemEvent = (index: number) => {
        sudokuItems.value.forEach((item, i) => {
            item.selected = i === index;
            if (item.selected) {
                console.log(`Selected item index: ${index}, value: ${item.value}`);
            }
        });
    };

    // 给每个选中节点添加键盘输入数字事件
    window.addEventListener('keyup', (event) => {
        const selectedItem = sudokuItems.value.find(item => item.selected);
        if (selectedItem && !selectedItem.readonly) {
            const keyInt = Number(event.key);
            if (keyInt >= 1 && keyInt <= 9) {
                selectedItem.value = event.key;
                console.log(`Updated selected item value: ${selectedItem.value}`);
            } else if (event.key === 'Backspace' || event.key === 'Delete') {
                selectedItem.value = ''; // 清除数字
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
        }
    });

    // 给每个输入数字节点添加点击事件
    const handleNumItemClickEvent = (num: string) => {
        const selectedItem = sudokuItems.value.find(item => item.selected);
        if (selectedItem && !selectedItem.readonly) {
            if (num === '⬅️') {
                selectedItem.value = ''; // 清除数字
                console.log(`Cleared selected item value`);
            } else {
                selectedItem.value = num;
                console.log(`Updated selected item value: ${selectedItem.value}`);
            }
        }
    };
</script>
<style scoped>
    .selected {
        background: #e5e4da !important;
        /* 提高优先级，覆盖 block-odd/block-even */
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
        font-weight: 100;
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
        font-size: 2rem;
        user-select: none;
        cursor: pointer;
    }

    .numItem:hover {
        background: #c4c4c4;
    }

    .numItem:active {
        background: #d4d4d4;
    }
</style>