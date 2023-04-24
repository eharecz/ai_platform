<template>
  <div>
    <el-header><HeaderBar/></el-header>
    <el-container>
      <el-aside><AsideBar/></el-aside>
      <el-main class="main">
        <video ref="video" autoplay></video>
      </el-main>
    </el-container>
  </div>
</template>

<script>
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
    }
  },
  created() {
    // let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  },
  methods: {
  }
}
</script>

<style lang="scss">

.main {
  padding: 40px !important;
  background-color: rgba(0, 0, 0, 0.02);
}

</style>
