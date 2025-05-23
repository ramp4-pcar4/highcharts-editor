<template>
    <div id="app" class="app-container">
        <header
            class="editor-header sticky top-0 flex border-b border-black bg-gray-200 py-2 px-2 justify-between z-40"
        >
            <h1 class="w-mobile-full flex items-center truncate">
                <span class="font-semibold text-lg m-1">{{ $t('editor.title') }}</span>
            </h1>

            <button
                @click="changeLang"
                class="bg-white border border-black hover:bg-gray-100 font-bold p-2 ml-auto mr-4"
                v-if="!props.editor"
            >
                {{ appLang === 'en' ? $t('editor.lang.fr') : $t('editor.lang.en') }}
            </button>

            <button
                @click="emit('cancel')"
                class="bg-white border border-black hover:bg-gray-100 font-bold p-2 ml-auto mr-4"
                v-else
            >
                {{ $t('editor.label.cancel') }}
            </button>

            <button
                @click="saveChanges"
                class="bg-black border border-black text-white hover:bg-gray-900 font-bold p-2"
                :class="{ 'disabled hover:bg-gray-400': Object.keys(chartStore.chartConfig).length === 0 }"
                :disabled="Object.keys(chartStore.chartConfig).length === 0"
            >
                {{ $t('editor.saveChanges') }}
                <span v-if="saving" class="align-middle inline-block px-1">
                    <Spinner size="16px" color="#009cd1" class="ml-1 mb-1"></Spinner>
                </span>
            </button>
        </header>

        <div class="items-stretch flex">
            <SideMenu :lang="appLang"></SideMenu>
            <div class="grid-container z-20 w-full flex-grow min-w-0">
                <router-view :key="$route.path" :lang="appLang"></router-view>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useChartStore } from './stores/chartStore';
import { useI18n } from 'vue-i18n';

import SideMenu from './components/side-menu.vue';
import Spinner from './components/helpers/spinner.vue';

const props = defineProps({
    editor: {
        type: Boolean
    },
    lang: {
        type: String
    }
});

const emit = defineEmits(['cancel', 'saved']);

const i18n = useI18n();
const chartStore = useChartStore();
const appLang = ref('');
const saving = ref<boolean>(false);

let prevTitle = i18n.t('editor.customization.titles.chartTitle');

watch(i18n.locale, () => {
    const title = i18n.t('editor.customization.titles.chartTitle');
    if (!chartStore.chartConfig.title.text || chartStore.chartConfig.title.text === prevTitle) {
        chartStore.chartConfig.title.text = title;
    }
    prevTitle = title;
});

onMounted(() => {
    appLang.value = props.lang || 'en';
    i18n.locale.value = appLang.value;
});

const changeLang = (): void => {
    appLang.value = appLang.value === 'en' ? 'fr' : 'en';
    i18n.locale.value = appLang.value;
};

const saveChanges = (): void => {
    saving.value = true;
    emit('saved', chartStore.chartConfig);
    setTimeout(() => {
        saving.value = false;
    }, 1000);
};
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(1, calc(100%));
}
</style>
