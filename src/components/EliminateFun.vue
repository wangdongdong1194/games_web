<template>
    <div class="grid">
        <div :class="['cell', { 'clearCell': cell.clear }, { 'fulldownCell': cell.fulldown }]"
            v-for="(cell, index) in eliminates" :key="index" :style="{ backgroundColor: colorType[cell.type] }">
            {{ index }}-{{ cell.type }}
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import type { IEliminateCell, IEliminateClearResult } from '../types/type';

    // 初始化
    const colorType = ['#ff0000', '#00ff00', '#00ffff', '#ffff00',];
    const maxType = colorType.length;
    const eliminates = ref<IEliminateCell[]>([]);
    for (let i = 0; i < 81; i++) {
        eliminates.value.push({
            type: getRandomType(),
            clear: false,
            fulldown: false,
        });
    }
    // 获取随机类型
    function getRandomType() {
        return Math.floor(Math.random() * maxType);
    }
    // 当前行是否可以消除
    function canClearRow(rowNo: number) {
        const elis = eliminates.value.filter((_, index) => Math.floor(index / 9) === rowNo);
        const indexArray: number[][] = [];
        const line: number[] = [];
        for (let i = 0; i < elis.length; i++) {
            const curType = elis[i].type;
            if (!line.length) {
                line.push(i);
                continue;
            }
            if (elis[line[line.length - 1]].type !== curType) {
                if (line.length >= 3) {
                    indexArray.push([...line]);
                }
                line.splice(0, line.length);
            }
            line.push(i);
        }
        if (line.length >= 3) {
            indexArray.push([...line]);
        }
        return {
            columnArray: indexArray.flat(),
            cellIndexArray: indexArray.map((line) => line.map((i) => i + rowNo * 9)),
        };
    }
    // 下落并返回新的消除格子
    function fulldown(columns: number[]) {
        const newEliminates: { [key: number]: IEliminateCell[] } = {};
        for (const column of columns) {
            const tColumns = eliminates.value.filter((_, index) => index % 9 === column);
            const noClearCells = tColumns.filter((cell) => !cell.clear)
                .map((t, index) => ({ ...t, clear: false, fulldown: index % 9 > column }));
            const downCells = Array(9 - noClearCells.length).fill({
                type: getRandomType(),
                clear: false,
                fulldown: true,
            });
            const finalCells = [...downCells, ...noClearCells];
            newEliminates[column] = finalCells;
        }
        return newEliminates;
    }
    async function start() {
        let resultArray: IEliminateClearResult = {
            columnArray: [],
            cellIndexArray: [],
        };
        for (let i = 8; i >= 0; i--) {
            const clearRows = canClearRow(i);
            if (clearRows.columnArray.length) {
                resultArray = clearRows;
                break;
            }
        }
        if (resultArray.columnArray.length) {
            // 标记消除格子
            resultArray.cellIndexArray.forEach((line) => line.forEach((index) => eliminates.value[index].clear = true));
            await sleep();
            // 等待动画结束后，执行下落
            const t = fulldown(resultArray.columnArray);
            eliminates.value.forEach((_, index) => {
                const column = index % 9;
                if (t[column]) {
                    const row = Math.floor(index / 9);
                    eliminates.value[index] = t[column][row];
                }
            });
            await sleep();
            initClearFulldown();
            start();
        }
    }
    async function sleep(sec: number = 3.3) {
        return new Promise((resolve) => {
            setTimeout(resolve, sec * 1000);
        });
    }
    function initClearFulldown() {
        eliminates.value.forEach(t => {
            t.clear = false;
            t.fulldown = false;
        });
    }
    start();
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
        gap: 8px;
        background-color: #333;
        padding: 8px;
        user-select: none;
        border-radius: 5px;
    }

    .cell {
        background-color: greenyellow;

        /* 让格子内容居中（可选） */
        display: flex;
        justify-content: center;
        align-items: center;
        color: #000000;
        cursor: pointer;
        border-radius: 5px;
    }

    @keyframes clearCellFrame {
        0% {
            transform: rotate(-8deg);
        }

        50% {
            transform: rotate(8deg);
        }

        100% {
            transform: rotate(-8deg);
        }
    }

    .clearCell {
        animation-name: clearCellFrame;
        animation-duration: 0.4s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        animation-direction: alternate;
        transform-origin: center;
    }

    @keyframes fulldownCellFrame {
        0% {
            transform: translateY(-100%);
        }

        100% {
            transform: translateY(0);
        }
    }

    .fulldownCell {
        animation-name: fulldownCellFrame;
        animation-duration: .4s;
        animation-timing-function: ease-out;
        transform-origin: top;
        color: #ffffff;
        font-weight: bold;
    }
</style>
