<template>
  <div>
    <el-header><HeaderBar/></el-header>
    <el-container>
      <el-aside><AsideBar/></el-aside>
      <el-container class="model_view" >
        <p v-if="loading" v-loading="true" element-loading-text="模型加载中..." class="loading" />
        <iframe :show="!loading" @load="loading=false" :src='"https://172.25.191.101:" + $route.query.port' ></iframe>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import HeaderBar from '@/components/HeaderBar.vue';
import AsideBar from '@/components/AsideBar.vue';

export default {
  name: 'ModelView',

  components: {
    HeaderBar,
    AsideBar
  },

  data() {
    return {
      loading: true
    }
  },
}

</script>

<style lang="scss" >

.model_view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.model_view div {
  width: 100%;
  height: 600px;
}

.model_view iframe {
  width: 100%;
  height: 100%;
  border: none;
}

</style>
