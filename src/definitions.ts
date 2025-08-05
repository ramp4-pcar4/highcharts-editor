export interface HighchartsConfig {
    chart?: {
        type: string;
    };
    lang?: ExportMenuOptions;
    title: {
        text: string;
    };
    credits?: {
        enabled: boolean;
    };
    subtitle: {
        text: string;
    };
    yAxis: {
        title: {
            text: string;
        };
    };
    xAxis: {
        title: {
            text: string;
        };
        categories: (number | string)[];
    };
    data?: {
        csv: string;
        csvURL: string;
        enablePolling: boolean;
    };
    colors?: string[];
    plotOptions?: any;
    exporting?: {
        buttons: {
            contextButton: {
                menuItems: string[];
            };
        };
        enabled?: boolean;
    };
    legend?: {
        enabled?: boolean;
    };
    tooltip?: {
        footerFormat?: string;
        format?: string;
        headerFormat?: string;
        pointFormat?: string;
        useHTML?: boolean;
    };
    series: SeriesData[] | { data: SeriesData[] };
}

export interface ExportMenuOptions {
    viewFullscreen: string;
    printChart: string;
    downloadPNG: string;
    downloadJPEG: string;
    downloadPDF: string;
    downloadSVG: string;
    downloadCSV: string;
    downloadXLS: string;
    viewData: string;
}

export interface SeriesData {
    name: string;
    type: string;
    color?: string;
    colors?: string[];
    y?: number;
    marker?: {
        symbol: string;
    };
    dashStyle?: string;
    data?: number[];
    visible?: boolean;
}

export enum CurrentView {
    Data = 'data',
    Template = 'template',
    Customization = 'customization'
}
