<template>
  <div>
    <el-form class="register-form" ref="ref-registerform" :model="registerForm" :rules="registerRules" >

      <h3>注 册</h3>

      <el-form-item prop="username" >
        <input type="text" v-model="registerForm.username" required />
        <div class="input-underline" ></div>
        <label>用户名</label>
      </el-form-item>

      <el-form-item prop="email" >
        <input type="text" v-model="registerForm.email" required />
        <div class="input-underline" ></div>
        <label>邮箱</label>
      </el-form-item>

      <el-form-item prop="phone" >
        <input type="text" v-model="registerForm.phone" required />
        <div class="input-underline" ></div>
        <label>手机号</label>
      </el-form-item>

      <el-form-item prop="password" >
        <input type="password" v-model="registerForm.password" required />
        <div class="input-underline" ></div>
        <label>密码</label>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="register" >注册</el-button>
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
import md5 from 'js-md5';
import axios from "axios";

export default {

  name: "RegisterForm",

  data() {
    return {
      registerForm: {
        username: "",
        email: "",
        phone: "",
        password: "",
      },
      tipDialog: {
        visible: false,
        title: '',
        message: '',
        confirm: ()=>{},
      }
    };
  },

  methods: {
    register() {
      let self = this;

      // 密码长度检测，小于32对其进行md5加密
      let passwordLength = this.registerForm.password.length;
      if(1 < passwordLength && passwordLength < 32) this.registerForm.password = md5(this.registerForm.password);

      // 登录请求，非0刷新页面，0跳转主页
      axios({method: 'post', url: '/apis/user/register/', data: this.registerForm}).then(function(response) {
        if(response.data.code != 0) {
          self.tipDialog.title = '注册失败';
          self.tipDialog.message = response.data.message;
          self.tipDialog.visible = true;
          self.tipDialog.confirm = self.resetRegisterForm;
        }else {
          self.tipDialog.title = '注册成功';
          self.tipDialog.message = response.data.message;
          self.tipDialog.visible = true;
          self.tipDialog.confirm = self.reloadPage;
        }
      });
    },
    resetRegisterForm() {
      this.tipDialog.title = '';
      this.tipDialog.message = '';
      this.tipDialog.visible = false;

      this.registerForm.password = '';
    },
    reloadPage() {
      location.reload();
    }
  },
};
</script>

<style scoped>
.register-form{
  margin: 0 0.6rem;
}
.register-form h3 {
  text-align: center;
  font-size: 2.3rem;
  padding-bottom: 15px;
  width: 100%;
  /* 大写 */
  text-transform: uppercase;
}
.register-form input {
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
.register-form input:focus {
  /* border: rgb(180, 193, 255) solid 1px; */
  outline: none;
  background: rgba(255, 255, 255, 0.04);
}
.register-form label {
  font-size: 1rem;
  position: absolute;
  bottom: 10px;
  left: 1rem;
  color: rgba(65, 65, 65, 0.6);
  pointer-events: none;
  transition: all 0.3s ease;
}
/* 关联input与label  input的focus触发会改变label的属性  */
.register-form input:focus ~ label,
.register-form input:valid ~ label {
  /* :valid选择器是如果合法触发，所以输入框记得加required属性 */
  transform: translateY(-1.8rem) translateX(-0.5rem);
  font-size: 0.85rem;
  letter-spacing: 0.05rem;
  /* color: rgba(75, 105, 254, 0.7); */
}
.register-form .input-underline {
  position: absolute;
  bottom: 0px;
  height: 1.4px;
  width: 95%;
  left: 2.5%;
}
.register-form .security-code-box .input-underline {
  width: 55%;
}
/* 不理解这里加before选择器是为了什么 */
.register-form .input-underline:before {
  position: absolute;
  content: "";
  height: 100%;
  width: 100%;
  /* background: rgba(75, 105, 254, 0.7); */
  background: rgba(129, 129, 129, 0.3);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.register-form input:focus ~ .input-underline:before{
  transform: scaleX(1);
}
.register-form button {
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
.register-form .security-code-box >>> div {
  display: flex;
  justify-content: space-between;
}
.register-form .security-code-button {
  background-image: linear-gradient(
    130deg,
    #93a8f1b6 0%,
    rgba(152, 171, 255, 0.6) 100%
  );
  font-size: 0.9rem;
  width: 35%;
}
</style>
