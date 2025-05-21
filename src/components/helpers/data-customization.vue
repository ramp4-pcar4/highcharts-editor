<template>
    <div class="graph-customization">
        <slot></slot>
        <div class="font-bold mt-6">{{ $t('editor.customization.dataSeries') }}</div>
        <div class="relative mt-2" :class="hybrid ? 'w-2/3' : 'w-1/5'">
            <select
                class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                v-model="activeDataSeries"
                :aria-label="$t('editor.customization.dataSeries')"
            >
                <!-- Enable insert when exactly one row is selected, enable delete when any number of rows are selected -->
                <option v-for="series in dataSeries" :value="series">
                    {{ series }}
                </option>
            </select>
            <div class="select-arrow absolute right-2 top-1/2"></div>
        </div>

        <h2 class="font-bold mt-6">{{ $t('editor.customization.data.format') }}</h2>
        <div class="font-bold mt-4">{{ $t('editor.customization.data.seriesType') }}</div>
        <div class="relative mt-2" :class="hybrid ? 'w-1/2' : 'w-1/6'">
            <input
                disabled
                type="text"
                class="border border-black w-full p-2 rounded bg-white"
                :value="chartType"
                :aria-label="$t('editor.customization.data.seriesType')"
                v-if="hybrid"
            />
            <!-- TODO: decide if should allow changing series type in hybrid customization - may lead to complications -->
            <div v-else>
                <select
                    class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                    v-model="chartType"
                    :aria-label="$t('editor.customization.data.seriesType')"
                    @change="changeChartType"
                >
                    <option v-for="series in Object.keys(seriesOptions)" :key="series" :value="series">
                        {{ $t(`editor.customization.data.series.${series}`) }}
                    </option>
                </select>
                <div class="select-arrow absolute right-2 top-1/2"></div>
            </div>
        </div>

        <div v-if="chartType !== 'pie'">
            <div class="font-bold mt-4">{{ $t('editor.customization.data.colour') }}</div>
            <div class="flex flex-col mt-2" :class="hybrid ? 'w-1/2' : 'w-1/6'">
                <div
                    class="colour-dropdown w-full rounded border border-gray-500 flex items-center justify-between cursor-pointer"
                    @click="() => (showColourPicker = !showColourPicker)"
                    @keypress.enter="() => (showColourPicker = !showColourPicker)"
                    tabindex="0"
                >
                    <div class="flex w-full h-full bg-white rounded">
                        <div
                            class="rounded border-r border-gray-400 w-10"
                            tabindex="0"
                            :style="{ 'background-color': (activeSeries as SeriesData).color }"
                        ></div>
                        <div class="flex items-center px-3">{{ (activeSeries as SeriesData).color }}</div>
                        <div class="flex items-center justify-center pr-2 ml-auto">
                            <span class="select-arrow"></span>
                        </div>
                    </div>
                </div>
                <div
                    v-if="showColourPicker"
                    class="w-full items-center justify-center border border-gray-300 rounded-md p-2 shadow-sm"
                >
                    <ColorPicker
                        :color="(activeSeries as SeriesData).color"
                        alpha-channel="hide"
                        :visible-formats="['hex']"
                        default-format="hex"
                        @color-change="updateColour"
                    >
                        <template #copy-button></template>
                    </ColorPicker>
                </div>
            </div>

            <div class="font-bold mt-4">{{ $t('editor.customization.data.dashStyle') }}</div>
            <div class="relative mt-2" :class="hybrid ? 'w-1/2' : 'w-1/6'">
                <select
                    class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                    v-model="(activeSeries as SeriesData).dashStyle"
                    :aria-label="$t('editor.customization.data.dashStyle')"
                >
                    <option v-for="dashStyle in Object.keys(dashOptions)" :key="dashStyle" :value="dashStyle">
                        {{ $t(`editor.customization.data.${dashStyle}`) }}
                    </option>
                </select>
                <div class="select-arrow absolute right-2 top-1/2"></div>
            </div>

            <div class="font-bold mt-4">{{ $t('editor.customization.data.pointMarker') }}</div>
            <div class="relative mt-2" :class="hybrid ? 'w-1/2' : 'w-1/6'">
                <select
                    class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                    v-model="(activeSeries as SeriesData).marker!.symbol"
                    :aria-label="$t('editor.customization.data.pointMarker')"
                >
                    <option v-for="pointMarker in Object.keys(markerOptions)" :key="pointMarker" :value="pointMarker">
                        {{ $t(`editor.customization.data.${pointMarker}`) }}
                    </option>
                </select>
                <div class="select-arrow absolute right-2 top-1/2"></div>
            </div>
        </div>

        <div v-else>
            <div class="font-bold mt-4">{{ $t('editor.customization.data.colours') }}</div>
            <div class="flex flex-col mt-2 w-1/6">
                <div class="flex flex-col" v-for="(color, index) in (activeSeries as SeriesData).colors" :key="index">
                    <div
                        class="colour-dropdown w-full rounded border border-gray-500 flex items-center justify-between cursor-pointer mb-2"
                        @click="() => (showPieColourPicker[index] = !showPieColourPicker[index])"
                        @keypress.enter="() => (showPieColourPicker[index] = !showPieColourPicker[index])"
                        tabindex="0"
                    >
                        <div class="flex w-full h-full bg-white rounded">
                            <div
                                class="rounded border-r border-gray-400 w-10"
                                tabindex="0"
                                :style="{ 'background-color': color }"
                            ></div>
                            <div class="flex items-center px-3">{{ color }}</div>
                            <div class="flex items-center justify-center pr-2 ml-auto">
                                <span class="select-arrow"></span>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="showPieColourPicker[index]"
                        class="w-full items-center justify-center border border-gray-300 rounded-md p-2 shadow-sm"
                    >
                        <ColorPicker
                            :color="color"
                            alpha-channel="hide"
                            :visible-formats="['hex']"
                            default-format="hex"
                            @color-change="(eventData) => updatePieColour(index, eventData.cssColor)"
                        >
                            <template #copy-button></template>
                        </ColorPicker>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useDataStore } from '../../stores/dataStore';
import { useChartStore } from '../../stores/chartStore';
import { SeriesData } from '../../definitions';

const props = defineProps({
    dataSeries: {
        type: Array<string>,
        required: true
    },
    chartType: {
        type: String,
        required: true
    },
    hybrid: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['loading']);

const dataStore = useDataStore();
const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);

const activeDataSeries = ref<string>('');
const activeSeries = computed(() => {
    if (Array.isArray(chartConfig.value.series)) {
        return chartConfig.value.series.find((s) => s.name === activeDataSeries.value);
    } else {
        return chartConfig.value.series;
    }
});
const showColourPicker = ref<boolean>(false);
const showPieColourPicker = ref<boolean[]>([]);

const chartType = ref<string>('');

const seriesOptions: Record<string, string> = {
    area: 'area',
    bar: 'bar',
    column: 'column',
    line: 'line',
    pie: 'pie',
    scatter: 'scatter',
    spline: 'spline'
};

const dashOptions: Record<string, string> = {
    dot: 'dot',
    dash: 'dash',
    solid: 'solid'
};

const markerOptions: Record<string, string> = {
    square: 'square',
    circle: 'circle',
    triangle: 'triangle'
};

onBeforeMount(() => {
    activeDataSeries.value = props.dataSeries[0];
    chartType.value = (activeSeries.value as SeriesData).type;
    if (chartType.value === 'pie') {
        const activeSeriesColors = (activeSeries.value as SeriesData)?.colors;
        if (activeSeriesColors) {
            for (let i = 0; i < activeSeriesColors.length; i++) {
                showPieColourPicker[i] = false;
            }
        }
    }
});

const updateColour = (eventData: any) => {
    (activeSeries.value as SeriesData).color = eventData.cssColor;
};

const updatePieColour = (index: number, color: string) => {
    (activeSeries.value as SeriesData).colors![index] = color;
};

const changeChartType = () => {
    emit('loading', true);
    const seriesNames = Object.values(dataStore.headers).slice(1);
    chartStore.updateConfig(chartType.value, seriesNames, dataStore.headers, dataStore.gridData);
    // set brief timeout to allow chart to re-render
    setTimeout(() => {
        emit('loading', false);
    }, 100);

    if (chartType.value === 'pie') {
        for (let i = 0; i < (activeSeries.value as SeriesData).colors!.length; i++) {
            showPieColourPicker[i] = false;
        }
    }
};
</script>

<style scoped lang="scss">
:deep(.vacp-color-inputs),
:deep(.vacp-copy-button),
:deep(.vacp-range-input-label-text--hue) {
    display: none;
}

.colour-dropdown {
    height: 40px;
}

.select-arrow {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid black;
}

select {
    background-color: white !important;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: none;
}
</style>
