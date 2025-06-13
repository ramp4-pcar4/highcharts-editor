export interface HighchartsConfig {
    chart?: {
        type: string;
    };
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
    series: SeriesData[] | { data: SeriesData[] };
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
