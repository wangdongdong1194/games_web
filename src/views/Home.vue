<template>
    <div class="home-container">
        <div class="home-content">
            <h1 class="title">益智游戏</h1>
            <p class="subtitle">挑战你的逻辑思维！</p>
            <div class="game-list">
                <router-link to="/sudoku" class="game-card">
                    <div class="game-title">数独</div>
                    <div class="game-desc">经典9x9数独挑战</div>
                </router-link>
                <router-link to="/eliminate" class="game-card">
                    <div class="game-title">消消乐</div>
                    <div class="game-desc">3消</div>
                </router-link>
                <div class="game-card coming-soon">
                    <div class="game-title">更多游戏</div>
                    <div class="game-desc">敬请期待...</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
    .home-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
    }

    .home-content {
        background: #fff;
        padding: 48px 32px 32px 32px;
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(60, 60, 120, 0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title {
        font-size: 2.6rem;
        font-weight: 700;
        color: #374151;
        margin-bottom: 12px;
        letter-spacing: 2px;
    }

    .subtitle {
        font-size: 1.2rem;
        color: #64748b;
        margin-bottom: 32px;
    }

    .game-list {
        display: flex;
        gap: 32px;
        margin-bottom: 12px;
    }

    .game-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 160px;
        height: 120px;
        background: #f1f5f9;
        border-radius: 12px;
        box-shadow: 0 2px 8px 0 rgba(99, 102, 241, 0.06);
        text-decoration: none;
        color: #374151;
        transition: box-shadow 0.2s, background 0.2s;
        cursor: pointer;
    }

    .game-card:hover {
        background: #e0e7ff;
        box-shadow: 0 4px 16px 0 rgba(99, 102, 241, 0.12);
    }

    .coming-soon {
        background: #f3f4f6;
        color: #a1a1aa;
        cursor: not-allowed;
        box-shadow: none;
    }

    .game-title {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 8px;
    }

    .game-desc {
        font-size: 1rem;
        color: #64748b;
    }

    .footer {
        margin-top: 48px;
        color: #94a3b8;
        font-size: 0.95rem;
        letter-spacing: 1px;
    }
</style>
