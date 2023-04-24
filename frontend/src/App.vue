<template>
  <router-view class="fill-page"/>
</template>

<style lang="scss">

* {
  margin: 0;
  padding: 0;
}

.fill-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.el-header {
  padding: 0 !important;
  box-shadow: 0px 0px 4px rgba(0,0,0,0.1);
  z-index: 100;
}

.el-aside {
  width: 9.5em !important;
  box-shadow: 2px 0px 4px rgba(0,0,0,0.05);
  z-index: 90;
}

</style>
