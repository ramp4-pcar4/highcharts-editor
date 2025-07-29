<template>
    <div class="h-full">
        <div class="font-bold text-lg">{{ $t('HACK.data.paste.label') }}</div>
        <div class="mt-2">{{ $t('HACK.data.paste.description') }}</div>

        <textarea
            class="paste-box border border-black h-2/3 w-full mt-4 p-2"
            @keydown="handleKeyDown"
            v-model="pastedData"
            :placeholder="$t('HACK.data.paste.placeholder')"
            :aria-label="$t('HACK.data.paste.placeholder')"
        ></textarea>

        <div class="flex mt-4">
            <button
                class="bg-black text-white rounded border border-black hover:bg-gray-900 font-bold p-4"
                :class="{ 'disabled hover:bg-gray-400': !pastedData }"
                :disabled="!pastedData"
                @click="
                    () => {
                        emit('import', pastedData);
                        $vfm.close('paste-data');
                    }
                "
            >
                {{ $t('HACK.label.import') }}
            </button>
            <button
                class="bg-white border border-black rounded hover:bg-gray-100 font-bold p-4 ml-8"
                @click="$vfm.close('paste-data')"
            >
                {{ $t('HACK.label.cancel') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useVfm } from 'vue-final-modal'

const vfm = useVfm();
const emit = defineEmits(['import']);

const props = defineProps({
    pastedData: {
        type: String
    }
});

const pastedData = ref<string>('');

onMounted(() => {
    pastedData.value = props.pastedData || '';
});

// handle various key combination events
const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && event.ctrlKey) {
        emit('import', pastedData.value);
        vfm.close('paste-data');
    } else if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        pastedData.value += '\n';
    }
};
</script>
<style lang="scss">
.paste-box {
    height: 200px;
}
</style>
