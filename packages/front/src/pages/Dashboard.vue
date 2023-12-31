<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <!-- :chart-options="emailsSubscriptionChart.options" -->
        <chart-card :chart-options="subjectsChartOptions">
          <template slot="content">
            <h4 class="title">Average and median grades in all subjects</h4>
            <p class="category">
              Click on the bar to display the distribution of grades by deciles
            </p>
          </template>
        </chart-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <chart-card :chart-options="studentsChartOptions">
          <template slot="content">
            <h4 class="title">Average grades of all students</h4>
            <p class="category">
              Click on the bar to display the student's grades in all subjects
            </p>
          </template>
        </chart-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ChartCard } from '@/components'
import axios from 'axios'

function getSubjectsChartData(data) {
  const series = [
    {
      name: 'Average',
      data: data.map((item) => ({
        name: item.subject,
        y: item.average,
        drilldown: item.subject,
      })),
    },
    {
      name: 'Median',
      data: data.map((item) => ({
        name: item.subject,
        y: item.median,
        drilldown: item.subject,
      })),
    },
  ]
  const drilldown = {
    series: data.map((item) => ({
      id: item.subject,
      data: Object.entries(item.distribution),
    })),
  }

  return {
    chart: {
      type: 'column',
      marginTop: 40,
    },
    title: '',
    xAxis: {
      type: 'category',
    },

    plotOptions: {
      series: {
        borderWidth: 0,
      },
    },
    series,
    drilldown,
  }
}

function getStudentsChartData(data) {
  const series = [
    {
      name: 'Average',
      data: data.map((item) => ({
        name: item.student,
        y: item.average,
        drilldown: item.student,
      })),
    },
  ]
  const drilldown = {
    series: data.map((item) => ({
      id: item.student,
      data: item.grades.map((grade) => [grade.subject, grade.grade]),
    })),
  }

  return {
    chart: {
      type: 'column',
      marginTop: 40,
    },
    title: '',
    xAxis: {
      type: 'category',
    },

    plotOptions: {
      series: {
        borderWidth: 0,
      },
    },
    legend: {
      enabled: false,
    },
    series,
    drilldown,
  }
}

export default {
  components: {
    ChartCard,
  },
  data() {
    return {
      subjectsChartOptions: null,
      studentsChartOptions: null,
    }
  },
  mounted() {
    this.getSubjectsData()
    this.getStudentsData()
  },
  methods: {
    async getSubjectsData() {
      try {
        const response = await axios.get(`${this.$apiURL}/analytics/subjects`)
        this.subjectsChartOptions = getSubjectsChartData(response.data)
      } catch (error) {
        this.notifyError()
      }
    },
    async getStudentsData() {
      try {
        const response = await axios.get(`${this.$apiURL}/analytics/students`)
        this.studentsChartOptions = getStudentsChartData(response.data)
      } catch (error) {
        this.notifyError()
      }
    },
    notifyError() {
      this.$notify({
        message: 'An error occurred. Try again later.',
        icon: 'error',
        horizontalAlign: 'center',
        verticalAlign: 'top',
        type: 'danger',
      })
    },
  },
}
</script>
