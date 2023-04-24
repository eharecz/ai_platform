<template>
  <div>
    <el-header><HeaderBar/></el-header>
    <el-container>
      <el-aside><AsideBar/></el-aside>
      <el-main class="main">
        <el-row :gutter="40">
          <el-col v-for="card in cards" :span="24/cardNumPerRow" :key="card.modelId" >
            <el-card shadow="always" :body-style="{ padding: '0px' }" >
              <img class="card-image" :src="card.modelImage" />
              <div class="card-information">
                <div size="large" class="card-title" >{{ card.modelName }}</div>
                <div size="small" class="card-description" >{{ card.modelDescription }}</div>
                <el-button class="card-button" type="primary" plain @click="gotoModel(card.modelId)" >进入体验</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
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
      cards: [
        // {
        //   modelId: "show_svm",
        //   modelName: "二维线性SVM算法演示",
        //   modelDescription: "二维线性SVM是一种基于最大间隔分割超平面的分类器，它能够在二维平面上找到一个最优的超平面来将两类数据分开。本演示对上述问题进行了简单展示。",
        //   modelImage: require("@/assets/model_svm.png"),
        // },
        {
          modelId: "train_svm",
          modelName: "SVM多分类器算法训练演示",
          modelDescription: "本演示尝试对SVM训练进行简化，以简洁易懂的形式完成对SVM模型的训练。",
          modelImage: require("@/assets/model_svm.png"),
        },
        // {
        //   modelId: "show_face_landmark",
        //   modelName: "实时人脸关键点检测",
        //   modelDescription: "人脸关键点检测是一种计算机视觉技术，可以识别人脸的各个关键点位置，如眼睛、鼻子、嘴巴等。本演示展示了视频人脸的实时捕捉和关键点标定。",
        //   modelImage: require("@/assets/model_face_landmark.png"),
        // },
      ]
    }
  },
  created() {
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if(isMobile) this.cardNumPerRow = 1;
  },
  methods: {
    gotoModel(modelId) {
      this.$router.push("/model/" + modelId);
    }
  }
}
</script>

<style lang="scss">

.el-col {
  margin-bottom: 40px;
}

.card-image {
  object-fit: contain;
  width: 100%;
}

.card-information {
  padding: 16px;
  position: relative;
}

.card-title {
  font-size: large;
  margin: 10px;
}

.card-description {
  margin-bottom: 18px;
  height: 8em;
  text-indent: 2em;
  font-size: small;
}

.card-button {
  position: absolute;
  width: 6em;
  height: 5em;
  right: 2em;
  bottom: 2.5em;
}

</style>
