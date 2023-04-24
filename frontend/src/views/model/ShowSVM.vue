<template>
  <div>
    <el-header><HeaderBar/></el-header>
    <el-container>
      <el-aside v-if="!isMobile"><AsideBar/></el-aside>
      <el-main class="main">
        <el-card>
          <h2 class="title">二维线性SVM算法演示</h2>
          <el-row :gutter="40">
            <el-col :span="24/columnPerRow" >
              <div ref="chart" class="chart"/>
            </el-col>
            <el-col :span="24/columnPerRow" >
              <el-table :data="points" header-align="center" border >
                <el-table-column label="x坐标">
                  <template #default="scope" >
                    <el-input @input="updateChart" v-model="scope.row.x" />
                  </template>
                </el-table-column>>
                <el-table-column label="y坐标">
                  <template #default="scope" >
                    <el-input @input="updateChart" v-model="scope.row.y" />
                  </template>
                </el-table-column>>
                <el-table-column label="聚类">
                  <template #default="scope" >
                    <el-select @input="updateChart" v-model="scope.row.label" >
                      <el-option :key="1" :label="1" :value="1" />
                      <el-option :key="2" :label="2" :value="2" />
                    </el-select>
                  </template>
                </el-table-column>>
              </el-table>
            </el-col>
            <el-col :span="24" >
              <el-button type="primary" class="compute" @click="getSVMFit">计算并绘制超平面</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts';
import HeaderBar from '@/components/HeaderBar.vue';
import AsideBar from '@/components/AsideBar.vue';

export default {
  name: 'show_svm',
  components: {
    HeaderBar,
    AsideBar
  },
  data() {
    return {
      isMobile: false,
      columnPerRow: 2,
      chart: '',
      points: [
        {x: 1.88, y: 4.60, label: 1},
        {x: 2.12, y: 3.54, label: 1},
        {x: 2.62, y: 2.93, label: 1},
        {x: 4.72, y: 7.32, label: 1},
        {x: 3.92, y: 6.29, label: 1},
        {x: 6.02, y: 2.61, label: 2},
        {x: 6.02, y: 2.30, label: 2},
        {x: 5.02, y: 1.36, label: 2},
        {x: 4.02, y: 2.68, label: 2},
        {x: 6.32, y: 6.05, label: 2},
      ],
      chartOptions: '',
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    this.updateChart();
  },
  created() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if(this.isMobile) this.columnPerRow = 1;

    // this.getSVMFit();
  },
  methods: {
    updateChart(line) {
      let chartOptions = {
        legend: { data: ['聚类1', '聚类2'] },
        tooltip: { 
          formatter: function(params) {
            return params.seriesName + ': (' + params.value[0] + ', ' + params.value[1] + ')';
          }
        },
        xAxis: {},
        yAxis: {},
        series: [
          {
            name: '聚类1',
            encode: { tooltip: [0, 1] },
            type: 'scatter',
            data: []
          },
          {
            name: '聚类2',
            encode: { tooltip: [0, 1] },
            type: 'scatter',
            data: []
          }
        ]
      };
      let min_x = this.points[0].x;
      let max_x = this.points[0].x;

      for(let i = 0; i < this.points.length; i++) {
        chartOptions.series[this.points[i].label - 1].data.push([this.points[i].x, this.points[i].y]);
        if(min_x > this.points[i].x) min_x = this.points[i].x;
        if(max_x < this.points[i].x) max_x = this.points[i].x;
      }

      if(typeof line != 'undefined') {
        let x_range = max_x - min_x;
        min_x -= x_range * 0.12;
        max_x += x_range * 0.12;
        let lineData = [[min_x, line.a * min_x + line.b], [max_x, line.a * max_x + line.b]];
        chartOptions.series.push({
          type: 'line',
          data: lineData,
          lineStyle: { color: '#f00', width: 1 },
        });
      }

      console.log(chartOptions);
      this.chart.setOption(chartOptions);
    },

    getSVMFit() {
      let self = this;
      axios({method: 'post', url: '/apis/model/svm/fit/', data: this.points}).then(function(res) {
        self.updateChart(res.data);
      });
    }
  }
}
</script>

<style lang="scss">

.main {
  padding: 40px !important;
  background-color: rgba(0, 0, 0, 0.02);
}

.title {
  text-align: center;
  margin-bottom: 5vh;
}

.chart {
  height: 60vh;
  // width: 100%;
}

.compute {
  width: 80%;
  margin: auto 10%;
}

</style>
