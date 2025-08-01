<template>
    <div class="chart-customization-axes">
        <div v-if="chartConfig.series[0].type !== 'pie'">
            <div class="font-semibold mt-6">
                {{ $t('HACK.customization.axes.xaxis') }}
            </div>
            <input
                class="border text-sm md:text-base border-black box-border w-full mt-2 p-2 pr-6"
                :placeholder="$t('HACK.customization.axes.placeholder')"
                :aria-label="$t('HACK.customization.axes.xaxis')"
                type="text"
                v-model="chartConfig.xAxis.title.text"
            />

            <div class="font-semibold mt-6">
                {{ $t('HACK.customization.axes.yaxis') }}
            </div>
            <input
                class="border text-sm md:text-base border-black box-border w-full mt-2 p-2 pr-6"
                :placeholder="$t('HACK.customization.axes.placeholder')"
                :aria-label="$t('HACK.customization.axes.yaxis')"
                type="text"
                v-model="chartConfig.yAxis.title.text"
            />
        </div>
        <div class="mt-6" v-else>
            {{ $t('HACK.customization.axes.na') }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChartStore } from '../../stores/chartStore';

const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);
</script>

<style lang="scss"></style>
