<template>
  <div>
    <el-form class="login-form" ref="ref-loginform" :model="loginForm" >

      <h3>登 录</h3>

      <el-form-item prop="account" >
        <input type="text" v-model="loginForm.username" required />
        <div class="input-underline" ></div>
        <label>账户</label>
      </el-form-item>

      <el-form-item prop="password" >
        <input type="password" v-model="loginForm.password" required />
        <div class="input-underline" ></div>
        <label>密码</label>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login" >登录</el-button>
      </el-form-item>

    </el-form>

    <el-dialog v-model="tipDialog.visible" :title="tipDialog.title" width="30%" >
      <span>{{ tipDialog.message }}</span>
      <template #footer>
        <span class="dialog-footer" >
          <el-button type="primary" @click="tipDialog.confirm" >确定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import Cookies from "js-cookie";
import md5 from 'js-md5';
import axios from "axios";

export default {
  name: "LoginForm",

  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      tipDialog: {
        visible: false,
        title: '',
        message: '',
        confirm: ()=>{}
      }
    };
  },

  created() {
    // 基于userId判断是否登录
    if(typeof Cookies.get("userId") != 'undefined') this.$router.push("/");
  },

  methods: {
    login() {
      let self = this;

      // 密码长度检测，小于32对其进行md5加密
      let passwordLength = this.loginForm.password.length;
      if(1 < passwordLength && passwordLength < 32) this.loginForm.password = md5(this.loginForm.password);

      // 登录请求，非0刷新页面，0跳转主页
      axios({method: 'post', url: '/apis/user/login/', data: this.loginForm}).then(function(response) {
        if(response.data.code != 0) {
          self.tipDialog.title = '登录失败';
          self.tipDialog.message = response.data.message;
          self.tipDialog.visible = true;
          self.tipDialog.confirm = self.resetLoginForm;
        }else {
          self.$router.push("/");
        }
      });
    },
    resetLoginForm() {
      this.tipDialog.title = '';
      this.tipDialog.message = '';
      this.tipDialog.visible = false;
      this.tipDialog.confirm = ()=>{};

      this.loginForm.password = '';
    }
  },
};
</script>

<style scoped>
.login-form {
  margin: 0 0.6rem;
}
.login-form h3 {
  text-align: center;
  font-size: 2.3rem;
  padding-bottom: 15px;
  width: 100%;
  /* 大写 */
  text-transform: uppercase;
}
.login-form input {
  font-size: 1rem;
  background: rgba(39, 39, 41, 0.025);
  /* background: rgba(255, 255, 255, 0); */
  border-radius: 0.5rem;
  padding-left: 1rem;
  /* border: 1px solid transparent; */
  border: none;
  height: 46px;
  width: 100%;
  line-height: 150%;
  color: #25262b;
}
.login-form input:focus {
  /* border: rgb(180, 193, 255) solid 1px; */
  outline: none;
  background: rgba(255, 255, 255, 0.04);
}
.login-form label {
  font-size: 1rem;
  position: absolute;
  bottom: 10px;
  left: 1rem;
  color: rgba(65, 65, 65, 0.6);
  pointer-events: none;
  transition: all 0.3s ease;
}
/* 关联input与label  input的focus触发会改变label的属性  */
.login-form input:focus ~ label,
.login-form input:valid ~ label {
  /* :valid选择器是如果合法触发，所以输入框记得加required属性 */
  transform: translateY(-1.8rem) translateX(-0.5rem);
  font-size: 0.85rem;
  letter-spacing: 0.05rem;
  /* color: rgba(75, 105, 254, 0.7); */
}
.login-form .input-underline {
  position: absolute;
  bottom: 0px;
  height: 1.4px;
  width: 95%;
  left: 2.5%;
}
.login-form .security-code-box .input-underline {
  width: 55%;
}
/* 不理解这里加before选择器是为了什么 */
.login-form .input-underline:before {
  position: absolute;
  content: "";
  height: 100%;
  width: 100%;
  /* background: rgba(75, 105, 254, 0.7); */
  background: rgba(129, 129, 129, 0.3);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.login-form input:focus ~ .input-underline:before {
  transform: scaleX(1);
}
.login-form button {
  width: 100%;
  background-image: linear-gradient(
    130deg,
    rgb(75, 105, 254) 0%,
    rgba(150, 152, 253, 0.75) 100%
  );
  border-radius: 10px;
  backdrop-filter: blur(24px);
  border: none;
  cursor: pointer;
  height: 48px;
  font-size: 16px;
}
.login-form .security-code-box >>> div {
  display: flex;
  justify-content: space-between;
}
.login-form .security-code-button {
  background-image: linear-gradient(
    130deg,
    #93a8f1b6 0%,
    rgba(152, 171, 255, 0.6) 100%
  );
  width: 35%;
  font-size: 0.9rem;
}
</style>
