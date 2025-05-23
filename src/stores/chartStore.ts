import { defineStore } from 'pinia';
import { HighchartsConfig, SeriesData } from '../definitions';

const chartTemplates: Record<string, string> = {
    area: 'area',
    bar: 'bar',
    column: 'column',
    line: 'line',
    pie: 'pie',
    scatter: 'scatter',
    spline: 'spline'
};

export const useChartStore = defineStore('chartProperties', {
    state: () => ({
        chartType: 'line' as string,
        hybridChartType: '' as string,
        categoryLabel: '' as string,
        chartSeries: [] as string[],
        chartConfig: {} as HighchartsConfig,
        defaultColours: [
            '#2caffe',
            '#544fc5',
            '#00e272',
            '#fe6a35',
            '#6b8abc',
            '#d568fb',
            '#2ee0ca',
            '#fa4b42',
            '#feb56a',
            '#91e8e1'
        ]
    }),

    actions: {
        /* Set highcharts type **/
        setChartType(chartType: string): void {
            this.chartType = chartType;
        },

        /* Set hybrid highcharts type **/
        setHybridChartType(chartType: string): void {
            this.hybridChartType = chartType;
        },

        /* Clear highcharts config **/
        clearChartConfig(): void {
            this.chartConfig = {};
        },

        /* Set highcharts config (from imported json file) **/
        setChartConfig(chartConfig: HighchartsConfig): void {
            // add mandatory fields blank (for customization section)
            // TODO: tons of edge cases here depending on the complexity of a chart configuration
            this.chartConfig = {
                ...chartConfig,
                title: {
                    text: chartConfig.title?.text || ''
                },
                subtitle: {
                    text: chartConfig.subtitle?.text || ''
                },
                xAxis: {
                    ...chartConfig.xAxis,
                    title: {
                        text: chartConfig.xAxis?.title?.text || ''
                    }
                },
                yAxis: Array.isArray(chartConfig.yAxis)
                    ? chartConfig.yAxis
                    : {
                          ...chartConfig.yAxis,
                          title: {
                              text: chartConfig.yAxis?.title?.text || ''
                          }
                      },
                series: ((chartConfig.series as SeriesData[]) || []).map((series) => ({
                    ...series,
                    type: series.type || '',
                    color: series.color || '',
                    dashStyle: series.dashStyle || '',
                    marker: {
                        ...series.marker,
                        symbol: series.marker?.symbol || ''
                    }
                }))
            };
        },

        /* Set default highcharts config **/
        setupConfig(seriesNames: string[], cats: string[], seriesData: number[][], categoryLabel = ''): void {
            this.chartConfig = {
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: cats,
                    title: {
                        text: ''
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                series: seriesNames.map((name, index) => ({
                    name,
                    type: 'line',
                    color: this.defaultColours[index],
                    dashStyle: 'solid',
                    marker: {
                        symbol: 'circle'
                    },
                    data: seriesData[index]
                }))
            };
            this.setChartType('line');
            this.categoryLabel = categoryLabel;
        },

        /* Update highcharts configuration for chart type **/
        updateConfig(type: string, series: string[], headers: string[], gridData: string[][]): void {
            switch (type) {
                case chartTemplates.area: {
                    this.setChartType('area');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateAreaChart(series, seriesData);
                    break;
                }
                case chartTemplates.bar: {
                    this.setChartType('bar');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateBarChart(series, seriesData);
                    break;
                }
                case chartTemplates.column: {
                    this.setChartType('column');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateColumnChart(series, seriesData);
                    break;
                }
                case chartTemplates.line: {
                    this.setChartType('line');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateLineChart(series, seriesData);
                    break;
                }
                case chartTemplates.scatter: {
                    this.setChartType('scatter');
                    // check if there exist categories (string values as first col) or if data is formatted as points in (x, y)
                    const firstColNumeric = gridData.every((row) => !isNaN(parseFloat(row[0])));
                    if (firstColNumeric) {
                        const seriesData = gridData.map((row) => ({
                            x: parseFloat(row[0]),
                            y: parseFloat(row[1])
                        }));
                        const seriesNames = Object.values(headers).slice(1);
                        this.updateScatterPlot(seriesNames, seriesData);
                    } else {
                        const seriesData = headers
                            .slice(1)
                            .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));
                        this.updateScatterPlot(series, seriesData);
                    }

                    break;
                }
                case chartTemplates.spline: {
                    this.setChartType('spline');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateSplineChart(series, seriesData);
                    break;
                }
                case chartTemplates.pie: {
                    this.setChartType('pie');
                    const data = gridData.map((row) => ({
                        name: row[0],
                        y: parseFloat(row[1])
                    }));

                    const seriesNames = Object.values(headers).slice(1);
                    this.updatePieChart(seriesNames, data);
                    break;
                }
            }
        },

        /* Update data series after deleting row(s) **/
        deleteRow(rowIdxs: number[]): void {
            const sortedRowIdxs = [...rowIdxs].sort((a, b) => b - a);
            // assuming all indices are valid
            sortedRowIdxs.forEach((rowIdx: number) => {
                this.chartConfig.xAxis.categories.splice(rowIdx, 1);
                this.chartConfig.series.forEach((series: SeriesData) => {
                    series.data?.splice(rowIdx, 1);
                });
            });
        },

        /* Update data series after deleting column(s) **/
        deleteColumn(colIdxs: number[]): void {
            const sortedColIdxs = [...colIdxs].sort((a, b) => b - a);
            sortedColIdxs.forEach((colIdx: number) => {
                this.chartConfig.series.splice(colIdx - 1, 1);
            });
        },

        /* Update data series after inserting row **/
        insertRow(rowIdx: number): void {
            this.chartConfig.xAxis.categories.splice(rowIdx, 0, '');
            this.chartConfig.series.forEach((series: SeriesData) => {
                series.data?.splice(rowIdx, 0, 0);
            });
        },

        /* Update data series after inserting column **/
        insertColumn(colIdx: number): void {
            const defaultData = new Array(this.chartConfig.xAxis.categories.length).fill(0);
            const newSeries: SeriesData = {
                name: 'Untitled',
                type: this.chartType,
                data: defaultData
            };
            this.chartConfig.series.splice(colIdx - 1, 0, newSeries);
        },

        /* Update header (series names) value **/
        updateHeader(colIdx: number, name: string): void {
            this.chartConfig.series[colIdx - 1].name = name;
        },

        /* Update a single series value after data grid cell has been modified **/
        updateVal(rowIdx: number, colIdx: number, val: string): void {
            if (colIdx) {
                this.chartConfig.series[colIdx - 1].data[rowIdx] = parseInt(val);
            } else {
                this.chartConfig.xAxis.categories[rowIdx] = val;
            }
        },

        /* Update highcharts configuration for line chart **/
        updateLineChart(seriesNames: string[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'line',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for bar chart **/
        updateBarChart(seriesNames: string[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'bar',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: {
                              symbol: 'circle'
                          },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for scatter plot **/
        updateScatterPlot(
            seriesNames: string[],
            seriesData: { x: number; y: number }[] | number[][],
            cats?: string[]
        ): void {
            // re-initialize chart config for special x y case of scatter plot data
            if (typeof seriesData === 'object') {
                this.chartConfig = {
                    title: {
                        text: 'Basic Chart'
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        ...(cats ? { categories: cats } : {}),
                        title: {
                            text: ''
                        }
                    },
                    yAxis: {
                        title: {
                            text: ''
                        }
                    },
                    series: seriesNames.map((name, index) => ({
                        name: name,
                        type: 'scatter',
                        color: this.defaultColours[index],
                        dashStyle: 'solid',
                        marker: {
                            symbol: 'circle'
                        },
                        data: seriesData[index]
                    }))
                };
            } else {
                this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                    seriesNames.includes(series.name)
                        ? {
                              name: series.name,
                              type: 'scatter',
                              color: this.defaultColours[index],
                              dashStyle: 'solid',
                              marker: { symbol: 'circle' },
                              data: seriesData[index]
                          }
                        : series
                );
            }
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for column chart **/
        updateColumnChart(seriesNames: string[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'column',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: {
                              symbol: 'circle'
                          },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for area chart **/
        updateAreaChart(seriesNames: string[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'area',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for spline chart **/
        updateSplineChart(seriesNames: string[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'spline',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for pie chart **/
        updatePieChart(seriesNames: string[], seriesData: { name: string; y: number }[]): void {
            // following would support pie chart as part of hybrid charts
            // this.chartConfig.series = this.chartConfig.series.map((series, index) =>
            //     seriesNames.includes(series.name) ? { name: seriesNames[0], type: 'pie', data: seriesData[index] } : series
            // );

            // TODO: this is the default selection: make it so that user can choose which series to display
            const selectedSeries = seriesNames[0];

            this.chartConfig.series = this.chartConfig.series.map((series) => {
                if (series.name === selectedSeries) {
                    return {
                        ...series,
                        type: 'pie',
                        data: seriesData,
                        color: this.defaultColours[0]
                    };
                } else {
                    return {
                        ...series,
                        data: [],
                        type: 'line'
                    };
                }
            });

            this.chartConfig.legend = { enabled: false };
        },

        /* Update highcharts configuration for hybrid chart **/
        updateHybridChart(hybridSeries: string[], hybridType: string): void {
            this.setHybridChartType(hybridType);
            this.chartConfig.series.forEach((series, index) => {
                if (hybridSeries.includes(series.name)) {
                    // TODO: may need to adjust based on what hybrid options become available in the future
                    const baseConfig = {
                        name: series.name,
                        type: hybridType,
                        color: series.color,
                        dashStyle: 'solid',
                        data: series.data,
                        marker: {
                            symbol: 'circle'
                        }
                    };
                    this.chartConfig.series[index] = baseConfig;
                }
            });
        }
    }
});
