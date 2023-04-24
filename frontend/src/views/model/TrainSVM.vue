<template>
  <div>
    <el-header><HeaderBar/></el-header>
    <el-container>
      <el-aside><AsideBar/></el-aside>
      <el-main class="main" >
        <el-card>
          <h2 class="title" >SVM多分类器算法训练演示</h2>
          <el-row :gutter="40" >
            <el-col :offset="1" :span="22" >
              <div class="tip-card" >
                <h4>TIP</h4>
                <p>上传csv格式为 x坐标，y坐标以及所属分类(1或-1)，例： 23.12, 36.71, -1</p>
              </div>
            </el-col>
            <el-col :offset="1" :span="22" >
              <el-divider content-position="center" >超参数设置</el-divider>
            </el-col>
            <el-col :offset="1" :span="6" >
              <span>迭代次数：</span>
              <el-input-number v-model="epochs"  controls-position="right" :min="1" :max="1000" />
            </el-col>
            <el-col :span="6" >
              <span>迭代间歇</span>
              <el-tooltip effect="light" content="为充分展示SVM训练过程，建议间隔100毫秒以上" placement="top" ><el-text type="danger" > * </el-text></el-tooltip>
              <span>：</span>
              <el-input-number v-model="interval" controls-position="right" :step="10" :min="0" :max="1000" />
            </el-col>
            <el-col :offset="1" :span="22" >
              <el-divider content-position="center" >训练概况</el-divider>
            </el-col>
            <el-col :offset="1" :span="8" style="display: flex; flex-direction: column; align-items: center;" >
              <el-upload ref="upload" :disabled="state>1" :limit="1" :auto-upload="false" :on-change="uploadCSV" >
                <span style="margin-right: 10px;" >训练数据：</span>
                <el-button v-if="state==0" type="primary" >上传CSV文件</el-button>
                <el-button v-if="state==1" type="success" >重新上传CSV文件</el-button>
                <el-button v-if="state>1" type="info" disabled >暂停上传</el-button>
              </el-upload>
              <el-result v-if="state<2" icon="success" title="还未训练" sub-title="快进行训练感受一下吧" style="margin-top: 60px;" >
                <template #extra>
                  <el-button type="primary" @click="startTrain" :disabled="state==0" >开始训练</el-button>
                </template>
              </el-result>
              <el-result v-if="state==2" icon="success" title="训练中" sub-title="请耐心等待结果吧" style="margin-top: 60px;" :loading="loading" >
                <template #extra>
                  <el-button type="success" @click="removeTrain" >暂停训练</el-button>
                </template>
              </el-result>
              <el-result v-if="state==3" icon="success" title="训练完成" sub-title="快导出训练权重分享一下吧" style="margin-top: 60px;" >
                <template #extra>
                  <el-button type="warning" @click="removeTrain" >重新训练</el-button>
                  <el-button type="primary" @click="exportWeights" >导出训练权重</el-button>
                </template>
              </el-result>
            </el-col>
            <el-col :span="14" >
              <div ref="data_chart" style="height: 400px;" />
            </el-col>
            <el-col :offset="1" :span="10" >
            </el-col>
            <el-col :offset="1" :span="22" >
              <el-divider content-position="center" >训练过程</el-divider>
            </el-col>
            <el-col :offset="1" :span="22" >
              <el-tabs model-value="graph" type="border-card" >
                <el-tab-pane label="迭代图表" name="graph">
                  <el-empty v-if="state<=1" description="暂无图像，请快上传数据并训练吧" />
                  <div ref="graph_a_chart" :v-show="state>1" style="height: 400px;" />
                  <div ref="graph_b_chart" :v-show="state>1" style="height: 400px;" />
                </el-tab-pane>
                <el-tab-pane label="详细输出" name="logs">
                  <el-empty v-if="state<=1" description="暂无日志，请快上传数据并训练吧" />
                  <el-input ref="logs" v-if="state>1" v-model="logs" :rows="14" type="textarea" placeholder="暂无日志输出" readonly :input="scrollToBottom" />
                </el-tab-pane>
              </el-tabs> 
            </el-col>
          </el-row>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Cookies from "js-cookie";
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
      state: 0,       // 0未上传数据 1已上传数据但未开始 2已上传数据且已开始 3已上传数据且已完成
      epochs: 300,
      interval: 200,
      timer: null,
      w: [0, 0],
      b: 0,
      logs: '',
      data_chart_option: {
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
      },
      graph_chart_option: {
        xAxis: { type: 'value' },
        yAxis: { type: 'value' },
        series: [
          {
            data: [[1, 2]],
            type: 'line',
            smooth: true
          }
        ]
      },
      data_chart: '',
      graph_a_chart: '',
      graph_b_chart: '',
    }
  },
  mounted() {
    this.initDataChart();
  },
  created() {
    this.updateState();
  },
  methods: {
    initDataChart() {
      this.data_chart = echarts.init(this.$refs.data_chart);
      this.data_chart.setOption(this.data_chart_option);
      this.graph_a_chart = echarts.init(this.$refs.graph_a_chart);
      this.graph_b_chart = echarts.init(this.$refs.graph_b_chart);
    },

    uploadCSV(file) {
      let userId = Cookies.get("userId");
      const formData = new FormData();

      if(file.size == 0) return;

      formData.append('file', file.raw);
      formData.append('userId', userId);
      axios.post('/apis/model/svm/uploadData', formData).then(response => {
        console.log(response.data);
        this.$refs.upload.clearFiles();
        this.updateState();
      });
    },
    updateState() {
      let self = this;
      let userId = Cookies.get("userId");

      axios.post('/apis/model/svm/getTrain', {userId: userId}).then(response => {
        let max_x = 0;
        let min_x = 0;

        if(Object.keys(response.data).length != 0) {
          this.state = 0;
          // console.log(response.data);
          if(Object.keys(response.data.data).length != 0 && (Object.keys(response.data.weights).length == 0 || response.data.weights.epoch == 0)) this.state = 1;
          if(Object.keys(response.data.data).length != 0 && response.data.weights.epoch > 0) this.state = 2;
          if(Object.keys(response.data.weights).length != 0 && response.data.weights.epoch + 1 == response.data.hyperparameter.epochs) this.state = 3;
          let data_chart_option = self.data_chart_option;

          for(let i = 0; i < response.data.data.length; i++) {
            if(response.data.data[i][2] == -1) {
              data_chart_option.series[0].data.push(response.data.data[i].slice(0, 2));
            }else {
              data_chart_option.series[1].data.push(response.data.data[i].slice(0, 2));
            }
            if(response.data.data[i][0] > max_x) max_x = response.data.data[i][0];
            if(response.data.data[i][0] < min_x) min_x = response.data.data[i][0];
          }

          if(Object.keys(response.data.weights).length != 0) {
            self.w = response.data.weights.w;
            self.b = response.data.weights.b;
            let a = - self.w[0] / self.w[1];
            let b = - self.b / self.w[1];
            let x_range = max_x - min_x;
            min_x -= x_range * 0.12;
            max_x += x_range * 0.12;
            let lineData = [[min_x, a * min_x + b], [max_x, a * max_x + b]];
            data_chart_option.series[2] = {
              type: 'line',
              data: lineData,
              lineStyle: { color: '#f00', width: 1 },
              tooltip: 'y=' + a + '*x + ' + b
            };
          }

          self.data_chart.setOption(data_chart_option);

          self.logs = response.data.logs;

          if(Object.keys(response.data.graph).length != 0) {
            let graph_a_data = [];
            let graph_b_data = [];
            for(let i = 0; i < response.data.graph.b.length; i++) {
              graph_a_data.push([i, -response.data.graph.w[i][0] / response.data.graph.w[i][1]]);
              graph_b_data.push([i, -response.data.graph.b[i] / response.data.graph.w[i][1]]);
            }

            let graph_a_option = self.graph_chart_option;
            let graph_b_option = self.graph_chart_option;
            graph_a_option.series[0].data = graph_a_data;
            self.graph_a_chart.setOption(graph_a_option);
            graph_b_option.series[0].data = graph_b_data;
            self.graph_b_chart.setOption(graph_b_option);
          }
        }
      });
    },
    generateDownload(filename, filecontent) {
      //定义文件内容，类型必须为Blob 否则createObjectURL会报错
      let content = new Blob([filecontent])	 
      //生成url对象
      let  urlObject = window.URL || window.webkitURL || window	
      let url = urlObject.createObjectURL(content)	
      //生成<a></a>DOM元素
      let el = document.createElement('a')
      //链接赋值
      el.href = url
      el.download =filename
      //必须点击否则不会下载
      el.click()		
      //移除链接释放资源		
      urlObject.revokeObjectURL(url)
    },
    exportWeights() {
      let weights = {w: this.w, b: this.b};
      let content = JSON.stringify(weights);
      this.generateDownload('weights.pth', content);
    },
    startTrain() {
      let self = this;
      let userId = Cookies.get("userId");
      axios.post('/apis/model/svm/startTrain', { userId: userId, hyperparameter: { epochs: this.epochs, interval: this.interval } }).then(() => {
        self.timer = setInterval(() => {self.updateState();},1000);
        self.updateState();
      });
    },
    removeTrain() {
      let userId = Cookies.get("userId");
      if(this.timer != null) clearInterval(this.timer);
      axios.post('/apis/model/svm/deleteTrain', {userId: userId}).then(() => {location.reload();});
    },
      scrollToBottom() {
        const inputElement = this.$refs.logs.$refs.textarea;
        inputElement.scrollTop = inputElement.scrollHeight;
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

.tip-card {
  padding: 16px 32px;
  background-color: rgba(236, 245, 255, 1);
  border-radius: 4px;
  border-left: 5px solid rgba(64, 158, 255, 1);
  text-align: left;
}

.tip-card h4 {
  margin-bottom: 5px;
}

.tip-card p {
  text-indent: 2em;
  font-size: small;
}

</style>
