import { App } from 'vue';
import i18n from './src/lang';
import HighchartsEditor from './src/app.vue';

const highchartsI18n = i18n;
export { highchartsI18n };

export { highchartsMessages } from './src/lang';

export default {
    install(app: App): void {
        app.component('highcharts-accessible-configuration-kit', HighchartsEditor);
    }
};

export { HighchartsEditor };
