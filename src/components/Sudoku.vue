<template>
    <div class="sudoku">
        <!-- 棋盘 -->
        <div class="boardItems">
            <div class="boardItem" v-for="(item, index) in sudokuItems" :class="{ selected: item.selected }"
                @click="selectItem(index)">
                {{ item.value }}
            </div>
        </div>
        <!-- 数字输入：点击棋盘上的格子选中，然后按键盘上的数字键（1-9）输入数字。 -->
        <div class="numItems">
            <div class="numItem" v-for="num in numItems" :key="num" @click="handleNumItemClick(num)">{{ num }}</div>
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
        });
    }

    // 输入数字
    const numItems = ref<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '⬅️']);

    // 给每个元素添加点击选中事件
    const selectItem = (index: number) => {
        sudokuItems.value.forEach((item, i) => {
            item.selected = i === index;
            if (item.selected) {
                console.log(`Selected item index: ${index}, value: ${item.value}`);
            }
        });
    };

    // 给每个选中节点添加键盘输入数字事件
    window.addEventListener('keydown', (event) => {
        const selectedItem = sudokuItems.value.find(item => item.selected);
        if (selectedItem && !selectedItem.readonly) {
            const keyInt = Number(event.key);
            if (keyInt >= 1 && keyInt <= 9) {
                selectedItem.value = event.key;
                console.log(`Updated selected item value: ${selectedItem.value}`);
            }else if (event.key === 'Backspace' || event.key === 'Delete') {
                selectedItem.value = ''; // 清除数字
                console.log(`Cleared selected item value`);
            }
        }
    });

    // 给每个输入数字节点添加点击事件
    const handleNumItemClick = (num: string) => {
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
        background-color: #e5e4e9;
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