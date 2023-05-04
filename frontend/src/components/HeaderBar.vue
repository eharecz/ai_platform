<template>
  <div>
    <el-menu mode="horizontal" :ellipsis="false" >
      <el-menu-item onclick="location.href='/'" class="logo" >
        <img src="@/assets/logo.png" fit="contain" />
        <el-text size="large" >大连理工大学AI模型训练展示</el-text>
      </el-menu-item>
      <div class="flex-grow" />
      <el-sub-menu index="1">
        <template #title>{{ username }}</template>
        <el-menu-item @click="logout">退出</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: 'TopNavigationBar',

  data() {
    return {
      userId: "",
      username: ""
    }
  },

  created() {
    this.userId = Cookies.get("userId");
    this.username = Cookies.get("username");

    if(typeof this.userId == 'undefined') {
      this.$router.push("/login");
    }
  },

  methods: {
    logout() {
      Cookies.remove("userId");
      Cookies.remove("username");
      Cookies.remove("password");
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

.flex-grow {
  flex-grow: 1;
}

</style>
