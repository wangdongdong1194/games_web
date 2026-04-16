<template>
    <div class="grid">
        <div class="cell" v-for="cell in eliminates" :key="cell.num">
            {{ cell.num }}
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    const eliminates = ref<{ num: number }[]>([]);
    for (let i = 0; i < 81; i++) {
        eliminates.value.push({ num: i });
    }
</script>

<style scoped>
    .grid {
        /* 固定正方形总大小，可自行修改 */
        width: 450px;
        height: 450px;

        /* 核心：开启 Grid 布局 */
        display: grid;

        /* 9 列，每列等宽 */
        grid-template-columns: repeat(9, 1fr);

        /* 9 行，每行等高 */
        grid-template-rows: repeat(9, 1fr);

        /* 格子间距，让布局更美观 */
        gap: 2px;
        background-color: #333;
        padding: 2px;
    }

    .cell {
        background-color: greenyellow;
        
        /* 让格子内容居中（可选） */
        display: flex;
        justify-content: center;
        align-items: center;
        color: #666;
    }

    .cell:hover {
        background-color: #f0f0f0;
    }
</style>
