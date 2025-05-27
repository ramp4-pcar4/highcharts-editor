<template>
    <div>
        <div class="mt-4">{{ $t('editor.data.modify') }}</div>
        <div class="flex mt-4">
            <button
                class="bg-black text-white border border-black hover:bg-gray-800 font-bold p-2"
                @click="emit('back')"
            >
                {{ $t('editor.datatable.uploadNew') }}
            </button>

            <!-- Row and column actions -->
            <div class="ml-auto">
                <select
                    class="border border-black mr-4 p-2 rounded bg-gray-300 focus:bg-white"
                    v-model="rowAction"
                    @change="handleRowAction()"
                    :aria-label="$t('editor.datatable.rowActions')"
                    :disabled="!Object.values(selectedRows).some((row) => row)"
                >
                    <option value="" hidden>{{ $t('editor.datatable.rowActions') }}</option>
                    <!-- Enable insert when exactly one row is selected, enable delete when any number of rows are selected -->
                    <option
                        v-for="action in Object.keys(rowActions)"
                        :key="action"
                        :value="action"
                        :disabled="
                            action === 'delete'
                                ? !Object.values(selectedRows).some((row) => row)
                                : !(Object.values(selectedRows).filter((row) => row).length === 1)
                        "
                    >
                        {{ $t(`editor.datatable.rowActions.${action}`) }}
                    </option>
                </select>

                <select
                    class="border border-black p-2 rounded bg-gray-300 focus:bg-white"
                    v-model="colAction"
                    @change="handleColAction()"
                    :aria-label="$t('editor.datatable.colActions')"
                    :disabled="!Object.values(selectedCols).some((col) => col)"
                >
                    <option value="" hidden>{{ $t('editor.datatable.colActions') }}</option>
                    <!-- Enable insert when exactly one col is selected, enable delete when any number of cols are selected -->
                    <option
                        v-for="action in Object.keys(colActions)"
                        :key="action"
                        :value="action"
                        :disabled="
                            action === 'delete'
                                ? !Object.values(selectedCols).some((col) => col)
                                : !(Object.values(selectedCols).filter((col) => col).length === 1)
                        "
                    >
                        {{ $t(`editor.datatable.colActions.${action}`) }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Datatable -->
        <div class="overflow-x-auto">
            <table class="table-auto border-collapse border-dotted border border-black w-full mt-8">
                <thead>
                    <tr class="bg-gray-200">
                        <td class="border border-gray-400 w-16 p-2 text-left align-middle">
                            <input
                                type="checkbox"
                                :checked="allRowsSelected"
                                @change="toggleAllRows"
                                :aria-label="$t('editor.datatable.selectAllRows')"
                            />
                        </td>
                        <th
                            class="border border-gray-400 p-2 text-left align-middle"
                            v-for="(header, colIdx) in headers"
                            :key="colIdx"
                        >
                            <div class="flex items-center w-full">
                                <span
                                    class="col-header flex-grow truncate"
                                    v-if="editingHeader !== colIdx"
                                    tabindex="0"
                                    @click="editColHeader(colIdx)"
                                    @focus="editColHeader(colIdx)"
                                >
                                    {{ header || $t('editor.untitled') }}
                                </span>
                                <input
                                    v-else
                                    :ref="(el) => (headerInput[colIdx] = el as HTMLInputElement | null)"
                                    class="col-header flex-grow w-0 max-w-[80%] box-border border border-black p-1"
                                    type="text"
                                    v-model="headers[colIdx]"
                                    @input="updateHeader(colIdx, headers[colIdx])"
                                    @blur="escEditCell"
                                    @keyup.enter="escEditCell"
                                />
                                <input
                                    class="ml-2"
                                    type="checkbox"
                                    v-model="selectedCols[colIdx]"
                                    :aria-label="$t('editor.datatable.selectCol')"
                                />
                            </div>
                        </th>
                        <th
                            class="border cursor-pointer border-dotted border-gray-400 p-2 text-center text-gray-600 w-[25px]"
                            @click="addNewCol"
                        >
                            + {{ $t('editor.datatable.addNewCol') }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="even:bg-gray-50" v-for="(row, rowIdx) in gridData" :key="rowIdx">
                        <td class="border border-gray-400 p-2 text-left">
                            <input
                                type="checkbox"
                                v-model="selectedRows[rowIdx]"
                                :aria-label="$t('editor.datatable.selectRow')"
                            />
                        </td>
                        <td
                            class="grid-cell border border-gray-400 p-2 text-left align-middle"
                            v-for="(value, colIdx) in row"
                            :key="colIdx"
                            @click="editCell(rowIdx, colIdx, value)"
                        >
                            <div class="flex items-center w-full">
                                <span
                                    class="grid-cell flex-grow truncate"
                                    v-if="editingCell.rowIdx !== rowIdx || editingCell.colIdx !== colIdx"
                                    tabindex="0"
                                    @click="editCell(rowIdx, colIdx, value)"
                                    @focus="editCell(rowIdx, colIdx, value)"
                                >
                                    {{ value }}
                                </span>

                                <input
                                    v-else
                                    :ref="
                                        (el) =>
                                            (gridCellInput[rowIdx * headers.length + colIdx] =
                                                el as HTMLInputElement | null)
                                    "
                                    class="grid-cell flex-grow w-0 max-w-[80%] box-border border border-black p-1"
                                    type="text"
                                    v-model="editingVal"
                                    tabindex="0"
                                    @input="updateCell(rowIdx, colIdx, ($event.target as HTMLInputElement).value)"
                                    @blur="escEditCell"
                                    @keyup.enter="escEditCell"
                                />
                            </div>
                        </td>
                        <td
                            class="border border-dotted border-gray-400 p-2"
                            :aria-label="$t('editor.datatable.addNewCol')"
                        >
                        </td>
                    </tr>
                    <tr :class="gridData.length % 2 === 0 ? 'bg-gray-50' : ''">
                        <td
                            class="border cursor-pointer border-dotted border-gray-400 p-2 text-center font-bold text-gray-600"
                            @click="addNewRow"
                        >
                            + {{ $t('editor.datatable.addNewRow') }}
                        </td>
                        <td
                            v-for="(header, colIdx) in headers"
                            :key="colIdx"
                            class="border border-dotted border-gray-400 p-2"
                        ></td>
                        <td class="border border-dotted border-gray-400 p-2"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="font-bold mt-8">{{ $t('editor.preview') }}</div>
        <!-- Preview of chart -->
        <div class="dv-chart-container items-stretch h-full w-full mt-2">
            <highchart :options="chartConfig"></highchart>
        </div>

        <div class="flex items-center mt-4">
            <router-link class="ml-auto" :to="{ name: 'ChartType' }">
                <button class="bg-black text-white border border-black hover:bg-gray-800 font-bold p-4 ml-auto">
                    {{ $t('editor.datatable.templates') }}
                </button>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, inject, onBeforeUnmount, onMounted, nextTick } from 'vue';
import { useDataStore } from '../stores/dataStore';
import { useChartStore } from '../stores/chartStore';

import Highcharts from 'highcharts';
import dataModule from 'highcharts/modules/data';

dataModule(Highcharts);

const props = defineProps({
    uploadedFile: {
        type: File
    },
    pastedFile: {
        type: String
    }
});

const emit = defineEmits(['back']);

const $papa: any = inject('$papa');
const dataStore = useDataStore();
const chartStore = useChartStore();

const headers = computed(() => dataStore.headers);
const gridData = computed(() => dataStore.gridData);
const chartConfig = computed(() => chartStore.chartConfig);

const headerInput = ref<(HTMLInputElement | null)[]>([]);
const gridCellInput = ref<(HTMLInputElement | null)[]>([]);

const editingHeader = ref(-1);
const editingCell = ref({ rowIdx: -1, colIdx: -1 });
const editingVal = ref('');

let selectedRows = reactive({});
let selectedCols = reactive({});
const rowAction = ref<string>('');
const colAction = ref<string>('');
const allRowsSelected = computed(
    () =>
        gridData.value.length > 0 &&
        Object.keys(selectedRows).length === gridData.value.length &&
        Object.values(selectedRows).every((val) => val)
);

const toggleAllRows = () => {
    const shouldSelectAll = !allRowsSelected.value;
    for (let i = 0; i < gridData.value.length; i++) {
        selectedRows[i] = shouldSelectAll;
    }
};
const addNewRow = () => {
    dataStore.addNewRow(gridData.value.length - 1, true);
    chartStore.insertRow(gridData.value.length);
}
const addNewCol = () => {
    dataStore.addNewCol(headers.value.length - 1, true); 
    chartStore.insertColumn(headers.value.length); 
}
const rowActions: Record<string, string> = {
    delete: 'delete',
    insertAbove: 'insertAbove',
    insertBelow: 'insertBelow'
};

const colActions: Record<string, string> = {
    delete: 'delete',
    insertLeft: 'insertLeft',
    insertRight: 'insertRight'
};

onMounted(() => {
    if (props.uploadedFile || props.pastedFile) {
        // parse uploaded file or pasted data
        $papa.parse(props.uploadedFile || props.pastedFile, {
            header: true, // first row headers
            skipEmptyLines: true,
            complete: (res) => {
                dataStore.setHeaders(res.meta.fields || []);
                dataStore.setGridData(res.data.map((row) => dataStore.headers.map((header) => row[header])));

                // default preview of datatable to line graph
                const categories = dataStore.gridData.map((row) => row[0]);
                const seriesData = dataStore.headers
                    .slice(1)
                    .map((_, colIdx) => dataStore.gridData.map((row) => parseFloat(row[colIdx + 1])));
                chartStore.setupConfig(
                    Object.values(dataStore.headers).slice(1),
                    categories,
                    seriesData,
                    dataStore.headers[0]
                );
            },
            error: (err) => {
                console.error('Error parsing file: ', err);
            }
        });
    } else if (Object.keys(chartStore.chartConfig).length > 0) {
        const config = chartStore.chartConfig;

        const headers = [chartStore.categoryLabel || ''].concat(config.series.map((s) => s.name));
        dataStore.setHeaders(headers);

        const categories = config.xAxis?.categories || [];
        const seriesData = config.series.map((s) => s.data || []);

        const gridData = categories.map((cat, rowIdx) => {
            return [cat].concat(seriesData.map((s) => s[rowIdx] ?? ''));
        });

        dataStore.setGridData(gridData);
    } else document.addEventListener('click', handleMouseClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleMouseClick);
});

// turn off grid edit inputs on mouse click
const handleMouseClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    // ignore if clicking on a grid cell element
    if (target.closest('.grid-cell') || target.closest('.col-header')) {
        return;
    } else {
        escEditCell();
    }
};

const editColHeader = (colIdx: number) => {
    escEditCell();
    editingHeader.value = colIdx;

    // focus the selected column header
    nextTick(() => {
        headerInput.value[colIdx]?.focus();
    });
};

const editCell = (rowIdx: number, colIdx: number, val: string) => {
    escEditCell();
    editingCell.value = { rowIdx: rowIdx, colIdx: colIdx };
    editingVal.value = val;

    // focus the selected grid cell input
    nextTick(() => {
        const cellIdx = rowIdx * headers.value.length + colIdx;
        gridCellInput.value[cellIdx]?.focus();
    });
};

const escEditCell = () => {
    editingHeader.value = -1;
    editingCell.value = { rowIdx: -1, colIdx: -1 };
    editingVal.value = '';
};

const updateHeader = (headerIdx: number, val: string) => {
    chartStore.updateHeader(headerIdx, val);
};

const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    dataStore.updateCell(rowIdx, colIdx, val);
    // update chart config with new series value
    chartStore.updateVal(rowIdx, colIdx, val);
};

const handleRowAction = (): void => {
    const rowIdxs = Object.keys(selectedRows).filter((idx) => selectedRows[idx]);
    switch (rowAction.value) {
        case rowActions.delete: {
            dataStore.deleteRows(rowIdxs);
            chartStore.deleteRow(rowIdxs.map((rowIdx) => parseInt(rowIdx)));
            selectedRows = reactive({}); // reset the selections
            break;
        }
        case rowActions.insertBelow: {
            dataStore.addNewRow(rowIdxs[0], true);
            chartStore.insertRow(parseInt(rowIdxs[0]) + 1);
            break;
        }
        case rowActions.insertAbove: {
            dataStore.addNewRow(rowIdxs[0], false);
            chartStore.insertRow(parseInt(rowIdxs[0]));
            const newIdx = (parseInt(rowIdxs[0]) + 1).toString();
            selectedRows[rowIdxs[0]] = false;
            selectedRows[newIdx] = true; //reselect the previous selected row
            break;
        }
    }
    rowAction.value = '';
};

const handleColAction = (): void => {
    const colIdxs = Object.keys(selectedCols).filter((idx) => selectedCols[idx]);
    switch (colAction.value) {
        case colActions.delete: {
            dataStore.deleteCols(colIdxs);
            chartStore.deleteColumn(colIdxs.map((colIdx) => parseInt(colIdx)));
            selectedCols = reactive({}); // reset the selections
            break;
        }
        case colActions.insertRight: {
            dataStore.addNewCol(colIdxs[0], true);
            chartStore.insertColumn(parseInt(colIdxs[0]) + 1);
            break;
        }
        case colActions.insertLeft: {
            dataStore.addNewCol(colIdxs[0], false);
            chartStore.insertColumn(parseInt(colIdxs[0]));
            const newIdx = (parseInt(colIdxs[0]) + 1).toString();
            selectedCols[colIdxs[0]] = false;
            selectedCols[newIdx] = true; //reselect the previous selected col
            break;
        }
    }

    // clear col action selection
    colAction.value = '';
};
</script>

<style lang="scss">
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
