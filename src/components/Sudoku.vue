<template>
    <div class="container">
        <div class="item" v-for="item in sudokuItems" :class="{ selected: item.selected }">
            {{ item.value }}
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue'
    import type { SudokuBoard } from '../types/type';
    const sudokuItems = ref<SudokuBoard>([]);
    for (let i = 0; i < 81; i++) {
        sudokuItems.value.push({
            value: 1,
            readonly: false,
            selected: false,
        });
    }
    sudokuItems.value[10].selected = true;
</script>
<style scoped>
    .selected {
        background-color: #e5e4a9;
    }

    .container {
        display: grid;
        grid-template-columns: repeat(9, 50px);
        grid-template-rows: repeat(9, 50px);
        border: 1px solid #e5e4e9;
        width: fit-content;
    }

    .item {
        border: 1px solid #e5e4e9;
        font-size: 2em;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 100;
    }

    .item:hover {
        cursor: pointer;
        user-select: none;
        background-color: #f5f5f5;
    }

    .item:active {
        background-color: #e5e4e9;
    }
</style>