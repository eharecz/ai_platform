<template>
  <div>
    <el-header><HeaderBar/></el-header>
    <el-container>
      <el-aside><AsideBar/></el-aside>
      <el-main class="main" >
        <el-row><el-alert class="area_alert" title="训练模型" type="info" :closable="false" /></el-row>

        <el-row :gutter="40" >
          <el-col v-for="model in trainModel" :span="6" :key="model.modelId" >
            <el-card shadow="always" :body-style="{ padding: '0px' }" >
              <div class="card-information" >
                <div class="card-title" >{{ model.modelName }}</div>
                <div class="card-description" >{{ model.description }}</div>
                <el-button class="card-button" type="primary" plain @click="gotoModel(model.containerPort)" >进入体验</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row><el-alert class="area_alert" title="演示模型" type="info" :closable="false" /></el-row>

        <el-row :gutter="40" >
          <el-col v-for="model in showModel" :span="6" :key="model.modelId" >
            <el-card shadow="always" :body-style="{ padding: '0px' }" >
              <div class="card-information" >
                <div class="card-title" >{{ model.modelName }}</div>
                <div class="card-description" >{{ model.description }}</div>
                <el-button class="card-button" type="primary" plain @click="gotoModel(model.containerPort)" >进入体验</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </el-main>
    </el-container>
  </div>
</template>

<script>
// import Cookies from "js-cookie";
import axios from "axios";

import HeaderBar from '@/components/HeaderBar.vue';
import AsideBar from '@/components/AsideBar.vue';

export default {
  name: 'HomeView',

  components: {
    HeaderBar,
    AsideBar
  },

  data() {
    return {
      cardNumPerRow: 4,
      trainModel: [],
      showModel: [],
    }
  },

  created() {
      this.getAllModel();
      setInterval(()=>{ this.getAllModel();}, 10000);
  },

  methods: {
    getAllModel() {
      let self = this;

      axios({method: 'get', url: '/apis/model/getAllModel'}).then(function(response) {
        self.trainModel = [];
        self.showModel = [];
        for(let i = 0; i < response.data.length; i++) {
          if(response.data[i].containerId == undefined) continue;

          if(response.data[i].modelType == 'train') {
            self.trainModel.push(response.data[i]);
          }else {
            self.showModel.push(response.data[i]);
          }
        }
      });
    },
    gotoModel(port) {
      this.$router.push({path: "model", query: {port: port}});
    }
  }
}
</script>

<style lang="scss" >

.el-col {
  margin-bottom: 40px;
}

.el-row {
  margin-bottom: 50px;
}

.card-information {
  padding: 16px;
  position: relative;
}

.card-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6em;
  width: 100%;
  border-radius: 3px;
  color: aliceblue;
  text-align: center;
  font: bold 30px Arial;
  user-select: none;
  background-color: #00b0b0;
}

.card-description {
  margin: 18px 10px;
  height: 12em;
  text-indent: 2em;
  font: 12px/2 Arial;
  white-space: pre-line;
}

.card-button {
  position: absolute;
  width: 100px;
  height: 34px;
  right: 15px;
  bottom: 20px;
}

</style>
