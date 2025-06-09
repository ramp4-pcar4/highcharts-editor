import { defineConfig } from 'vite';
import type { UserConfigExport } from 'vite';

import vue from '@vitejs/plugin-vue';
import dsv from '@rollup/plugin-dsv';
import path from 'path';

const baseConfig: UserConfigExport = {
    plugins: [
        vue(),
        dsv()
    ],
    define: {
        'process.env': process.env
    },
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    build: {
        target: 'esnext'
    },
    server: {
        open: '/'
    }
};

export default defineConfig(() => {
    if (process.argv.includes('plugin')) {
        Object.assign(baseConfig.build!, {
            lib: {
                entry: path.resolve(__dirname, './highcharts-plugin.ts'),
                name: 'HighchartsEditor',
                fileName: 'highcharts-editor'
            },
            rollupOptions: {
                external: ['vue', 'pinia', 'vue-final-modal', 'vue-papa-parse'],
                output: {
                    globals: {
                        vue: 'Vue',
                        pinia: 'Pinia',
                        'vue-final-modal': 'VueFinalModal',
                        'vue-papa-parse': 'VuePapaParse'
                    },
                    inlineDynamicImports: true,
                    dir: 'dist'
                }
            },
            copyPublicDir: false
        });
    }

    return baseConfig;
});
