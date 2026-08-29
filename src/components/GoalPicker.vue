<script setup lang="ts">
    import { useGameStore } from '../stores/game'
    import { NInputNumber, NButton } from 'naive-ui';

    const game = useGameStore()

    function parseCurrency(input: string) {
        const nums = input.replace(/(,|\$|\s)/g, '').trim()
        if (/^\d+(\.(\d+)?)?$/.test(nums))
            return Number(nums)
        return nums === '' ? null : Number.NaN
    }

    function formatCurrency(value: number | null) {
        if (value === null)
            return ''
        return `$${value.toLocaleString('en-US')}`
    }


</script>

<template>
    <h2>Pick a goal</h2>
    <n-input-number
        v-model:value.number="game.goal"
        v-bind:parse="parseCurrency"
        v-bind:format="formatCurrency"
        autocomplete="off"
        size="large"
        v-bind:status="game.goal != 0 && game.goal != null ? 'success' : 'error'">
    </n-input-number>

    <n-button
        @click="game.selectedGoal = true"
        v-bind:type="game.goal != 0 && game.goal != null ? 'primary' : 'error'"
        v-bind:disabled="game.goal == 0 || game.goal == null"
    >
        Start!
    </n-button>
</template>

<style scoped>
</style>
