<template>
  <div>
    <el-menu class="aside-menu">
      <el-menu-item onclick="location.href='/'" index="1" >
        <el-icon><i-ep-Menu /></el-icon>
        <template #title>
          <span>现有模型</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>

export default {
  name: 'SideNavigationBar',
}

</script>

<style lang="scss">

</style>
