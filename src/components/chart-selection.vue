<template>
    <div class="chart-selection m-6">
        <div class="text-2xl font-bold">{{ $t('editor.selection.title') }}</div>

        <!-- Main chart type selection (if only one chart type) -->
        <div class="font-bold mt-6">
            {{ enableHybrid ? $t('editor.selection.template1') : $t('editor.selection.template') }}
            <span class="text-red-600" v-if="enableHybrid">{{ $t('editor.customization.required') }}</span>
        </div>
        <div class="relative w-1/2 mt-2">
            <select
                class="border border-black w-full mt-2 p-2 rounded"
                v-model="chartType"
                :aria-label="enableHybrid ? $t('editor.selection.template1') : $t('editor.selection.template')"
                @change="handleChartSelection"
            >
                <option v-for="template in Object.keys(chartTemplates)" :key="template" :value="template">
                    {{ $t(`editor.selection.${template}`) }}
                </option>
            </select>
            <div class="select-arrow absolute right-2 top-1/2"></div>
        </div>

        <!-- Second chart type selection for hybrid charts -->
        <div v-if="enableHybrid">
            <div class="font-bold mt-6">
                {{ $t('editor.selection.template2') }}
                <span class="font-normal">{{ $t('editor.customization.optional') }}</span>
            </div>
            <div class="relative w-1/2 mt-2">
                <select
                    class="border border-black w-full mt-2 p-2 rounded"
                    v-model="hybridChartType"
                    :aria-label="$t('editor.selection.template2')"
                    @change="handleHybridSelection"
                >
                    <option v-for="template in Object.keys(hybridChartTemplates)" :key="template" :value="template">
                        {{ $t(`editor.selection.${template}`) }}
                    </option>
                </select>
                <div class="select-arrow absolute right-2 top-1/2"></div>
            </div>
        </div>

        <!-- Select which data series belongs to second chart type -->
        <div v-if="enableMultiselect && chartType !== hybridChartType && hybridChartType !== 'none'">
            <div class="font-bold mt-6">{{ $t('editor.selection.multiseries') }}</div>
            <div class="flex flex-col w-1/2 mt-2" v-if="Array.isArray(chartConfig.series)">
                <div
                    class="flex border border-black w-full h-[40px] rounded items-center justify-between cursor-pointer"
                    @click="openMultiSelect = !openMultiSelect"
                >
                    <div class="flex w-full h-full">
                        <div class="flex items-center" v-if="selectedHybridSeries.length">
                            <span
                                v-for="(series, index) in selectedHybridSeries"
                                :key="index"
                                :class="{ 'ml-2': index === 0 }"
                            >
                                {{ series }}<span v-if="index !== selectedHybridSeries.length - 1">,</span>
                            </span>
                        </div>
                        <div class="flex items-center justify-center pr-2 ml-auto">
                            <span class="select-arrow"></span>
                        </div>
                    </div>
                </div>

                <div
                    v-if="openMultiSelect"
                    class="flex flex-col border border-black rounded w-full bg-white rounded-md shadow-sm"
                >
                    <div
                        v-for="(series, index) in chartConfig.series"
                        :key="series.name"
                        class="p-2 cursor-pointer hover:bg-gray-200"
                        @click="toggleHybridSeries(series.name)"
                    >
                        <input
                            type="checkbox"
                            :value="index"
                            :checked="selectedHybridSeries.includes(series.name)"
                            :disabled="
                                selectedHybridSeries.length >= chartConfig.series.length - 1 &&
                                !selectedHybridSeries.includes(series.name)
                            "
                        />
                        <span class="ml-2">{{ series.name }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Preview of chart -->
        <div v-if="!loading">
            <div class="font-bold mt-6">{{ $t('editor.preview') }}</div>
            <div class="dv-chart-container items-stretch h-full w-full mt-2">
                <highchart :options="chartConfig"></highchart>
            </div>
        </div>

        <!-- Navigate to customization page -->
        <div class="flex items-center mt-4">
            <router-link class="ml-auto" :to="{ name: 'Customization' }">
                <button class="bg-black text-white border border-black hover:bg-gray-800 font-bold p-4 ml-auto">
                    {{ $t('editor.customization.title') }}
                </button>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useChartStore } from '../stores/chartStore';
import { useDataStore } from '../stores/dataStore';

import Highcharts from 'highcharts';
import dataModule from 'highcharts/modules/data';

dataModule(Highcharts);

const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);

const dataStore = useDataStore();
const seriesNames = computed(() => Object.values(dataStore.headers).slice(1));

const router = useRouter();

const enableHybrid = computed(() => {
    return Array.isArray(chartConfig.value.series) && chartConfig.value.series.length >= 2;
});

const enableMultiselect = computed(() => {
    return Array.isArray(chartConfig.value.series) && chartConfig.value.series.length > 2;
});

const chartType = ref<string>('');
const hybridChartType = ref<string>('');
const openMultiSelect = ref<boolean>(false);

const chartTemplates: Record<string, string> = {
    area: 'area',
    bar: 'bar',
    column: 'column',
    line: 'line',
    pie: 'pie',
    scatter: 'scatter',
    spline: 'spline'
};
const hybridChartTemplates: Record<string, string> = {
    none: 'none',
    area: 'area',
    column: 'column',
    line: 'line',
    scatter: 'scatter',
    spline: 'spline'
};

let selectedHybridSeries = ref<string[]>([]);

const loading = ref<boolean>(true);

onBeforeMount(() => {
    // case of directly accessing page with no data
    if (Object.keys(chartConfig.value).length === 0) {
        router.push({ name: 'Data' });
    }
});

onMounted(() => {
    chartType.value = chartStore.chartType ? chartStore.chartType : 'line';
    // default hybrid type to the same as main chart
    if (enableHybrid.value) {
        hybridChartType.value = chartStore.hybridChartType ? chartStore.hybridChartType : 'none';
    }

    // user manually uploaded existing highcharts config
    if (Object.keys(chartStore.chartConfig).length) {
        loading.value = false;
        return;
    }

    // construct line chart by default
    const categories = dataStore.gridData.map((row) => row[0]);
    const seriesData = dataStore.headers
        .slice(1)
        .map((_, colIdx) => dataStore.gridData.map((row) => parseFloat(row[colIdx + 1])));

    chartStore.setupConfig(seriesNames.value, categories, seriesData);
});

// handle chart type selection and update chart config (only called after config has been initialized in mounted)
const handleChartSelection = (): void => {
    loading.value = true;
    const otherSeries = enableMultiselect.value ? selectedHybridSeries.value : [seriesNames.value[1]];
    const seriesToUpdate = seriesNames.value.filter((name) => !otherSeries.includes(name));

    chartStore.updateConfig(chartType.value, seriesToUpdate, dataStore.headers, dataStore.gridData);

    if (enableHybrid.value && hybridChartType.value === chartType.value) {
        chartStore.setHybridChartType('none');
        selectedHybridSeries.value = [];
    }

    // set brief timeout to allow chart to re-render
    setTimeout(() => {
        loading.value = false;
    }, 100);
};

// modify the chart config to adapt to hybrid chart setup
const handleHybridSelection = (): void => {
    if (
        hybridChartType.value !== chartType.value &&
        hybridChartType.value !== 'none' &&
        selectedHybridSeries.value.length > 0
    ) {
        chartStore.updateHybridChart(selectedHybridSeries.value, hybridChartType.value);
        handleChartSelection();
    } else {
        chartStore.setHybridChartType('none');
        selectedHybridSeries.value = [];

        handleChartSelection();
    }
};

// add selected series to hybrid chart
const toggleHybridSeries = (series: string): void => {
    if (selectedHybridSeries.value.includes(series)) {
        selectedHybridSeries.value = selectedHybridSeries.value.filter((item) => item !== series);
    } else {
        selectedHybridSeries.value.push(series);
    }
    // logic to handle modifying the config
    handleHybridSelection();
};
</script>

<style lang="scss" scoped>
.select-arrow {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid black;
}

select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: none;
}
</style>
