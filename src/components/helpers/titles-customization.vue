<template>
    <div class="chart-customization-title">
        <div class="font-bold mt-6">
            {{ $t('editor.customization.titles.chart') }}
            <span class="font-normal text-red-600">{{ $t('editor.customization.required') }}</span>
        </div>
        <input
            class="border border-black box-border w-full mt-2 p-2 pr-6"
            :class="{ 'border-red-500': !chartConfig.title.text }"
            :placeholder="$t('editor.customization.titles.placeholder')"
            :aria-label="$t('editor.customization.titles.chart')"
            type="text"
            v-model="chartConfig.title.text"
        />

        <div class="font-bold mt-6">
            {{ $t('editor.customization.titles.subtitle') }}
        </div>
        <input
            class="border border-black box-border w-full mt-2 p-2 pr-6"
            :placeholder="$t('editor.customization.titles.placeholder')"
            :aria-label="$t('editor.customization.titles.subtitle')"
            type="text"
            v-model="chartConfig.subtitle.text"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useChartStore } from '../../stores/chartStore';

const { t, locale } = useI18n();
const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);

if (!chartStore.chartConfig.title.text) {
    chartStore.chartConfig.title.text = t('editor.customization.titles.chartTitle');
}

// watching for language change and update depending on language
let prevTitle = t('editor.customization.titles.chartTitle');

watch(locale, () => {
    const title = t('editor.customization.titles.chartTitle');
    if (!chartStore.chartConfig.title.text || chartStore.chartConfig.title.text === prevTitle) {
        chartStore.chartConfig.title.text = title;
    }
    prevTitle = title;
});
</script>

<style lang="scss"></style>
