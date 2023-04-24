<template>
  <el-container class="login-wrapper">
    <el-main class="login-content">
      <el-card class="login-card" >
        <h2 class="login-title">欢迎登录</h2>
        <el-input maxlength="32" v-model="loginForm.userName" placeholder="请输入用户名" />
        <el-input type="password" maxlength="31" v-model="loginForm.userPassword" placeholder="请输入密码" />
        <div class="login-operation">
          <el-button type="primary" @click="login">登录</el-button>
        </div>
      </el-card>
    </el-main>
    <el-footer/>
  </el-container>
</template>

<script>
import Cookies from "js-cookie";
import md5 from 'js-md5';
import axios from "axios";

export default {
  name: 'HomeView',
  components: {

  },
  data() {
    return {
      loginForm: {
        userName: '',
        userPassword: ''
      }
    }
  },
  created() {

    let userId = Cookies.get("userId");
    let userName = Cookies.get("userName");
    let userPassword = Cookies.get("userPassword");

    if(typeof userId != 'undefined') {
      this.$router.push("/");
    }else {
      userName = '';
      userPassword = '';
    }

    this.loginForm.userName = userName;
    this.loginForm.userPassword = userPassword;
  },
  methods: {
    login() {
      let self = this;
      let passwordLength = this.loginForm.userPassword.length;
      if(1 < passwordLength && passwordLength < 32) this.loginForm.userPassword = md5(this.loginForm.userPassword);

      axios({method: 'post', url: '/apis/user/login/', data: this.loginForm}).then(function(res) {
        console.log('sdfsdf' + res.data);
        if(Object.keys(res.data).length == 0) {
          location.reload();
        }else {
          Cookies.set("userId", res.data.id, { expires: 1 });
          Cookies.set("userName", res.data.username, { expires: 1 });
          Cookies.set("userPassword", res.data.password, { expires: 1 });
          self.$router.push("/");
        }
      })
    }
  }
}
</script>

<style lang="scss">

.login-wrapper {
  height: 100vh;
  background-image: url("@/assets/background.jpg");
  background-size: 100% auto;
}

.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  margin: 10% auto;
  background-color: #fff;
  width: max(250px, 20vw) !important;
  border-radius: 4px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: xx-large;
  text-align: center;
  margin-bottom: 30px;
}

.login-card .el-input {
  margin-bottom: 20px;
}

.login-operation {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-operation .el-button {
  margin: 20px auto;
  width: 90%;
  height: 2.5em;
}

</style>
