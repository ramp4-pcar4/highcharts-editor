<template>
    <div class="chart-customization-axes">
        <div class="font-semibold mt-6">
            {{ $t('editor.customization.axes.xaxis') }}
        </div>
        <input
            class="border border-black box-border w-full mt-2 p-2 pr-6"
            :placeholder="$t('editor.customization.axes.placeholder')"
            type="text"
            v-model="chartConfig.xAxis.title.text"
        />

        <div class="font-semibold mt-6">
            {{ $t('editor.customization.axes.yaxis') }}
        </div>
        <input
            class="border border-black box-border w-full mt-2 p-2 pr-6"
            :placeholder="$t('editor.customization.axes.placeholder')"
            type="text"
            v-model="chartConfig.yAxis.title.text"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useChartStore } from '../../stores/chartStore';

const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);
</script>

<style lang="scss"></style>
