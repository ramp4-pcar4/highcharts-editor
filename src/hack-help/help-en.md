# Getting Started

The Highcharts Accessible Configuration Kit (HACK) is a tool to help you easily create and edit highcharts. You can upload data in a datatable format through a CSV, XLS, or XLSX file or by pasting the data directly. You can also import an existing highcharts using a JSON file on the side menu. For a multi-series chart, this is an example of a valid datatable format:

<p style=" display: inline-block; border-radius:8px; font-family: monospace; background: #f3f4f6; padding: 14px; margin-top: 10px;margin-bottom: 10px;">
Year, Company 1, Company 2, Company 3, Company 4<br>
2020,59,24,58,47<br>
2021,83,79,88,83.33<br>
2022,65,72,75,70.66<br>
2023,40,56,21,65
</p>

which corresponds to this chart:

![Sample chart](samplechart.png)

The first column should correspond to the x-axis category followed by its labels. By default, when you import data it will automatically be displayed as a line chart, which you can later change in the templates tab.

Note that the data format might need to be different to properly display different types of charts. For a single series chart or a pie chart there should only be one column. This is an example of a valid datatable for a single series/pie chart:

<p style=" display: inline-block; border-radius:8px; font-family: monospace; background: #f3f4f6; padding: 14px; margin-top: 10px;margin-bottom: 10px;">
"Sport","Responses" <br>
"Badminton",4 <br>
"Volleyball",24 <br>
"Other",9 <br>
"Soccer",21 <br>
"Basketball",42
</p>

When switched to a pie chart this looks like:
![Sample pie chart](piechart.png)


# Datatable


When data is uploaded, there will be a datatable populated with the data along with a preview of the chart. On this page, you can edit the datatable values and manipulate the rows and columns. The chart preview will update in real time.

![Sample datatable](datatable.png)


# Templates


In the templates tab, you can choose the type of chart you want to represent your dataset with. For a single-type chart, you can choose between area chart, bar chart, column chart, line chart, pie chart, spline chart, and scatter plot.

Line charts are great for representing changes and trends over time.
![Sample line chart](linechart.png)

Similarly, spline charts are line charts that have smooth curves instead of straight line segments.
![Sample spline chart](splinechart.png)

Area Charts are typically used to graph trends over time and show magnitude or volume.
![Sample area chart](areachart.png)

Bar and column charts are simple and effective for comparing different categories.
![Sample bar chart](barchart.png)
![Sample column chart](columnchart.png)

Pie charts are good for representing percentages and comparing parts that make up a whole.
![Sample pie chart](piechart.png)

#### Hybrid Charts

You can also represent your data in the form of a hybrid chart— two charts in one. Choose a second template to represent your data with and select the data series you want to transfer to the second template.

![Sample hybrid chart](hybridchart.png)


# Customization

In the customization tab, you can customize every aspect of your chart. Use the chart titles section to set a chart title and subtitle. In the data series tab, you can customize the colour, line type, and point marker symbol for individual data series. You can add x-axis and y-axis titles in the Axes tab. In the advanced tab, you can directly edit the JSON file of the chart.


# Exporting


On the side menu, you can easily export your highcharts configuration as a JSON file. JSON files can be reimported and edited again later.
In the context menu on any chart preview, you may print your chart or download it as a PNG, JPEG, PDF, SVG, CSV, or XLS. Note that saving as a CSV or XLS means only the datatable is saved, not the template or customization.

![Sample chart](contextmenu.gif)


# Accessibility

This tool follows the WCAG 2.1 "AA" compliant.

#### Keyboard Navigation

Keyboard functionality is provided as an alternative for users who are unable to use a mouse. Use the Tab key to navigate across all the controls on the page. Press Shift-Tab to go back one step. Press Enter or Spacebar keys to activate links and controls.

#### Mobile Devices

This program is designed to be usable and responsive on mobile devices.