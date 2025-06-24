<template>
    <div class="chart-customization-title">
        <div class="font-bold mt-6">
            {{ $t('HACK.customization.titles.chart') }}
            <span class="font-normal text-red-600">{{ $t('HACK.customization.required') }}</span>
        </div>
        <input
            class="border border-black box-border w-full mt-2 p-2 pr-6"
            :class="{ 'border-red-500': !chartConfig.title.text }"
            :placeholder="$t('HACK.customization.titles.placeholder')"
            :aria-label="$t('HACK.customization.titles.chart')"
            type="text"
            v-model="chartConfig.title.text"
        />

        <div class="font-bold mt-6">
            {{ $t('HACK.customization.titles.subtitle') }}
        </div>
        <input
            class="border border-black box-border w-full mt-2 p-2 pr-6"
            :placeholder="$t('HACK.customization.titles.placeholder')"
            :aria-label="$t('HACK.customization.titles.subtitle')"
            type="text"
            v-model="chartConfig.subtitle.text"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChartStore } from '../../stores/chartStore';

const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);
</script>

<style lang="scss"></style>
