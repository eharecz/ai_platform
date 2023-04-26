<template>
  <div>
    <el-menu mode="horizontal" :ellipsis="false" >
      <el-menu-item onclick="location.href='/'" class="logo" >
      <!-- <li style="display: flex; justify-content: center; height: 30px;"> -->
        <img src="@/assets/logo.png" fit="contain" />
        <el-text size="large" >大连理工大学AI模型训练展示</el-text>
      <!-- </li> -->
      </el-menu-item>
      <el-text size="large" tag="b" style="width: 100%; text-align: center;" >欢迎来到大连理工大学!</el-text>
      <el-sub-menu index="1">
        <template #title>{{ userName }}</template>
        <el-menu-item @click="logout">退出</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: 'TopNavigationBar',
  components: {
  },
  data() {
    return {
      userId: "",
      userName: ""
    }
  },
  created() {
    this.userId = Cookies.get("userId");
    this.userName = Cookies.get("userName");
    if(typeof this.userId == 'undefined') {
      this.$router.push("/login");
    }
  },
  methods: {
    logout() {
      Cookies.remove("userId");
      Cookies.remove("userName");
      Cookies.remove("userPassword");
      this.$router.push("/login");
    }
  }
}

</script>

<style lang="scss">

.logo img {
  width: 40px;
  height: 40px;
  margin-right: 1em;
}

</style>
