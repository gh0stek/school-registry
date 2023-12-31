<template>
  <md-card>
    <md-card-header class="card-chart">
      <div :id="chartId" class="ct-chart"></div>
    </md-card-header>

    <md-card-content>
      <slot name="content"></slot>
    </md-card-content>
  </md-card>
</template>
<script>
import * as Highcharts from 'highcharts'
import HighchartsDrilldown from 'highcharts/modules/drilldown'

HighchartsDrilldown(Highcharts)

export default {
  name: 'chart-card',
  props: {
    chartOptions: {
      type: Object,
    },
    dataBackgroundColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chartId: 'no-id',
      chartInstance: null,
    }
  },
  methods: {
    /***
     * Initializes the chart by merging the chart options sent via props and the default chart options
     */
    initChart() {
      if (!this.chartOptions) {
        return
      }
      const chartIdQuery = `${this.chartId}`
      this.chartInstance = Highcharts.chart(chartIdQuery, this.chartOptions)
    },
    /***
     * Assigns a random id to the chart
     */
    updateChartId() {
      const currentTime = new Date().getTime().toString()
      const randomInt = this.getRandomInt(0, currentTime)
      this.chartId = `div_${randomInt}`
    },
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
  },
  mounted() {
    this.updateChartId()
    this.$nextTick(() => {
      this.initChart()
    })
  },
  watch: {
    chartOptions: {
      handler() {
        this.initChart()
      },
      deep: true,
    },
  },
}
</script>
