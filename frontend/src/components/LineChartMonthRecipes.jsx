import React from 'react'

import { Line } from 'react-chartjs-2'

const defaultDataConfig = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    fill: false,
    lineTension: 0.3,
    borderColor: 'rgb(229, 89, 64)',
    borderCapStyle: 'round',
    pointBorderColor: 'rgba(229, 89, 64, 0.9)',
    pointBackgroundColor: 'rgba(229, 89, 64, 0.9)',
    borderWidth: 5,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(229, 89, 64, 0.9)',
    pointHoverBorderColor: 'rgba(229, 89, 64, 0.9)',
    pointHoverBorderWidth: 8,
    pointRadius: 5,
    data: []
  }]
}

const defaultOptions = {
  responsive: true,
  padding: {
    left: 10,
    bottom: 5
  },
  hover: {
    /* Prevents glitchy transition. See https://github.com/chartjs/Chart.js/issues/4393 */
    intersect: false
  },
  layout: {
    /* Prevent cutting off labels and tooltips */
    padding: {
      left: 20,
      right: 20
    }
  },
  scales: {
    xAxes: [{
      ticks: {
        fontSize: 20,
        fontFamily: 'Charter'
      },
      gridLines: {
        display: true,
        lineWidth: 3
      }
    }],
    yAxes: [{
      ticks: {
        fontSize: 20,
        fontFamily: 'Charter',
        beginAtZero: true,
        /* Only show integer values for ticks */
        callback: (value, index, values) => Math.round(value) === value ? value : ''
      },
      gridLines: {
        display: false
      }
    }]
  },
  tooltips: {
    displayColors: false,
    cornerRadius: 10,
    caretPadding: 8,
    footerFontSize: 15,
    titleFontSize: 15,
    bodyFontSize: 15,
    backgroundColor: '#4a4a4a',
    intersect: false,
    position: 'average',
    mode: 'index',
    callbacks: {
      label: (tooltipItem, data) =>
        tooltipItem.yLabel !== 1
          ? tooltipItem.yLabel + ' recipes'
          : tooltipItem.yLabel + ' recipe'
    }
  }
}

const defaultLegend = {
  display: false
}

const LineChart = ({ dataConfig = defaultDataConfig, data = [], options = defaultOptions, legend = defaultLegend }) => {
  dataConfig.datasets[0].data = data
  return (
    <div className="chart-container">
      <Line data={dataConfig}
        legend={legend}
        options={options}/>
    </div>
  )
}

export default LineChart