<template>
    <div class="grid">
        <div :class="['cell', { 'clearCell': cell.clear }, { 'fulldownCell': cell.fulldown }]"
            v-for="(cell, index) in eliminates" :key="index" :style="{ backgroundColor: colorType[cell.type] }"
            @mousedown="onCellMouseDown($event, index)" @touchstart="onCellTouchStart($event, index)">
            <!-- {{ index }}-{{ cell.type }} -->
        </div>
    </div>
</template>

<script lang="ts" setup>
    // 操作状态，动画期间禁止滑动
    const isOperating = ref(false);
    // 滑动相关变量
    let dragStart = { x: 0, y: 0, index: -1 };
    let dragging = false;

    function onCellMouseDown(e: MouseEvent, index: number) {
        if (isOperating.value) return;
        dragStart = { x: e.clientX, y: e.clientY, index };
        dragging = true;
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }
    function onMouseMove(e: MouseEvent) {
        if (!dragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            let direction = '';
            if (Math.abs(dx) > Math.abs(dy)) {
                direction = dx > 0 ? 'right' : 'left';
            } else {
                direction = dy > 0 ? 'down' : 'up';
            }
            trySwapAndCheck(dragStart.index, direction);
            dragging = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
    }
    function onMouseUp() {
        dragging = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }
    // 兼容移动端
    function onCellTouchStart(e: TouchEvent, index: number) {
        if (isOperating.value) return;
        const touch = e.touches[0];
        dragStart = { x: touch.clientX, y: touch.clientY, index };
        dragging = true;
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
    }
    function onTouchMove(e: TouchEvent) {
        if (!dragging) return;
        const touch = e.touches[0];
        const dx = touch.clientX - dragStart.x;
        const dy = touch.clientY - dragStart.y;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            let direction = '';
            if (Math.abs(dx) > Math.abs(dy)) {
                direction = dx > 0 ? 'right' : 'left';
            } else {
                direction = dy > 0 ? 'down' : 'up';
            }
            trySwapAndCheck(dragStart.index, direction);
            dragging = false;
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        }
    }
    function onTouchEnd() {
        dragging = false;
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
    }

    // 交换相邻格子并判断是否能3消
    function trySwapAndCheck(index: number, direction: string) {
        const row = Math.floor(index / 9);
        const col = index % 9;
        let target = -1;
        if (direction === 'left' && col > 0) target = index - 1;
        if (direction === 'right' && col < 8) target = index + 1;
        if (direction === 'up' && row > 0) target = index - 9;
        if (direction === 'down' && row < 8) target = index + 9;
        if (target < 0 || target >= eliminates.value.length) return;
        // 交换
        [eliminates.value[index], eliminates.value[target]] = [eliminates.value[target], eliminates.value[index]];
        // 检查是否能3消
        if (canTriggerEliminate(index) || canTriggerEliminate(target)) {
            // 可以消除，直接调用start
            start();
        } else {
            // 不可消除，交换回去
            [eliminates.value[index], eliminates.value[target]] = [eliminates.value[target], eliminates.value[index]];
        }
    }

    // 检查某个格子所在行/列是否能3消
    function canTriggerEliminate(idx: number) {
        const row = Math.floor(idx / 9);
        const col = idx % 9;
        const rowResult = canClearRow(row);
        const colResult = canClearColumn(col);
        return rowResult.cellIndexArray.flat().length > 0 || colResult.cellIndexArray.flat().length > 0;
    }
    import { ref } from 'vue';
    import type { IEliminateCell, IEliminateClearResult } from '../types/type';

    // 初始化
    const colorType = [
        '#ff0000',
        '#00ff00',
        '#00ffff',
        '#ffff00',
    ];
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
            maxRowNo: rowNo,
            columnArray: indexArray.flat(),
            cellIndexArray: indexArray.map((line) => line.map((i) => i + rowNo * 9)),
        };
    }
    function canClearColumn(columnNo: number) {
        const clis = eliminates.value.filter((_, index) => index % 9 === columnNo);
        const indexArray: number[][] = [];
        const line: number[] = [];
        for (let i = 0; i < clis.length; i++) {
            const curType = clis[i].type;
            if (!line.length) {
                line.push(i);
                continue;
            }
            if (clis[line[line.length - 1]].type !== curType) {
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
        // 计算所有可消除cell的全局索引
        const cellIndexes = indexArray.map(line => line.map(i => i * 9 + columnNo));
        // 所有被消除的全局索引
        const flatIndexes = cellIndexes.flat();
        // 计算所有涉及的列号（其实就是columnNo本身）
        const columnArray = flatIndexes.length ? [columnNo] : [];
        // 计算最大行号
        const maxRowNo = flatIndexes.length ? Math.max(...flatIndexes.map(idx => Math.floor(idx / 9))) : -1;
        return {
            maxRowNo,
            columnArray,
            cellIndexArray: cellIndexes,
        };
    }
    // 下落并返回新的消除格子
    function fulldown(columns: number[]) {
        const newEliminates: { [key: number]: IEliminateCell[] } = {};
        for (const column of columns) {
            const tColumns = eliminates.value.filter((_, index) => index % 9 === column);
            const noClearCells = tColumns
                .map((cell, row) => ({ cell, row }))
                .filter((item) => !item.cell.clear)
                .map((item) => ({ ...item.cell, clear: false, _oldRow: item.row }));
            const needFill = 9 - noClearCells.length;
            const downCells = Array.from({ length: needFill }, () => ({
                type: getRandomType(),
                clear: false,
                fulldown: true,
            }));
            const finalCells = [...downCells, ...noClearCells].map((cell, newRow) => {
                if ('_oldRow' in cell) {
                    const oldRow = cell._oldRow as number;
                    const moved = oldRow !== newRow;
                    const { _oldRow, ...rest } = cell;
                    return { ...rest, fulldown: moved };
                }
                return cell;
            });
            newEliminates[column] = finalCells as IEliminateCell[];
        }
        return newEliminates;
    }
    async function start() {
        isOperating.value = true;
        let resultArray: IEliminateClearResult = {
            maxRowNo: -1,
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
        for (let i = 8; i >= 0; i--) {
            const clearColumns = canClearColumn(i);
            if (clearColumns.columnArray.length) {
                resultArray = clearColumns;
                break;
            }
        }
        if (resultArray.cellIndexArray.length) {
            // 标记消除格子
            resultArray.cellIndexArray.forEach((line) => line.forEach((index) => eliminates.value[index].clear = true));
            await sleep();
            // 等待动画结束后，执行下落
            const fulldownResult = fulldown(resultArray.columnArray);
            eliminates.value.forEach((_, index) => {
                const column = index % 9;
                if (fulldownResult[column]) {
                    const row = Math.floor(index / 9);
                    eliminates.value[index] = fulldownResult[column][row];
                }
            });
            await sleep();
            initClearFulldown();
            start();
            return;
        }
        isOperating.value = false;
    }
    async function sleep(sec: number = .3) {
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
