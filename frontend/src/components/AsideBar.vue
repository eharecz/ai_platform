<template>
  <div>
    <el-menu :collapse="isCollapse" class="aside-menu">
      <el-menu-item onclick="location.href='/'" index="1" >
        <el-icon><Menu /></el-icon>
        <template #title>
          <span>可展示模型</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>

export default {
  name: 'SideNavigationBar',
  components: {
  },
  data() {
    return {
      isCollapse: false
    }
  },
  created() {
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isCollapse = isMobile;
  }
}
</script>

<style lang="scss">

</style>
