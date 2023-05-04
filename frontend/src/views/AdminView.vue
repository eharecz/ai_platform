<template>
  <div>
    <el-header>
      <el-menu mode="horizontal" :ellipsis="false" >
        <el-menu-item onclick="location.href='/'" class="logo" >
          <img src="@/assets/logo.png" fit="contain" />
          <el-text size="large" >大连理工大学AI模型训练展示</el-text>
        </el-menu-item>
        <div class="flex-grow" />
        <el-menu-item onclick="location.href='https://dlut314.gitbook.io/ai_platform/'" >开发文档</el-menu-item>
      </el-menu>
    </el-header>

    <el-container>
      <el-tabs tab-position="left" >

        <el-tab-pane label="用户管理" >
          <el-row>
            <el-col :offset="2" :span="20" >
              <el-button type="primary" @click="addUserConfirm" >添加用户</el-button>
            </el-col>
            <el-col :offset="2" :span="20" >
              <el-table :data="userData" >
                <el-table-column prop="userId" label="用户Id" width="100" />
                <el-table-column prop="username" label="用户名" width="150" />
                <el-table-column prop="password" label="密码" width="350" />
                <el-table-column prop="role" label="角色" width="100" />
                <el-table-column prop="email" label="邮箱" width="250" />
                <el-table-column prop="phone" label="手机" width="250" />

                <el-table-column label="编辑" width="250" >
                  <template #default="scope" >
                    <el-button type="primary" @click="updateUserConfirm(scope.row)" >修改信息</el-button>
                    <el-button type="danger" @click="removeUserConfirm(scope.row)" >删除用户</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="模型管理" >
          <el-row>
            <el-col :offset="1" :span="22" >
              <el-button type="primary" @click="addModelConfirm" >创建模型</el-button>
            </el-col>
            <el-col :offset="1" :span="22" >
              <el-table :data="modelData" >
                <el-table-column prop="modelId" label="模型Id" width="100" />
                <el-table-column prop="modelName" label="模型名称" width="150" />
                <el-table-column prop="modelPath" label="模型路径" width="250" />
                <el-table-column prop="modelType" label="模型类型" width="100" />
                <el-table-column prop="authName" label="作者" width="100" />
                <el-table-column prop="description" label="描述" width="250" />
                <el-table-column prop="containerId" label="容器Id" width="300" />
                <el-table-column prop="containerPort" label="容器端口" width="100" />

                <el-table-column label="编辑" width="250" >
                  <template #default="scope" >
                    <el-button type="primary" @click="updateModelConfirm(scope.row)" >修改信息</el-button>
                    <el-button type="danger" @click="removeModelConfirm(scope.row)" >删除模型</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>

      </el-tabs>
    </el-container>

    <el-dialog v-model="userDialog.visible" title="用户信息" width="30%" >
      <el-form label-width="120px" >
        <el-form-item label="用户名" ><el-input v-model="userDialog.user.username" /></el-form-item>
        <el-form-item label="密码" ><el-input v-model="userDialog.user.password" /></el-form-item>
        <el-form-item label="角色" >
          <el-select v-model="userDialog.user.role " >
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="normal" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" ><el-input v-model="userDialog.user.email" /></el-form-item>
        <el-form-item label="手机" ><el-input v-model="userDialog.user.phone" /></el-form-item>

        <el-form-item>
          <el-button type="primary" @click="userDialog.confirm" >确认</el-button>
          <el-button @click="userDialog.visible=false" >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="modelDialog.visible" title="模型信息" width="30%" >
      <el-form label-width="120px" >
        <el-form-item label="模型名称" ><el-input v-model="modelDialog.model.modelName" /></el-form-item>
        <el-form-item v-if="modelDialog.showUpload" label="模型文件" >
          <el-upload :auto-upload="false" :limit="1" :on-change="beforeUpload" >
            <template #trigger>
              <el-button type="primary">上传压缩文件</el-button>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="模型类型" >
          <el-select v-model="modelDialog.model.modelType " >
            <el-option label="训练模型" value="train" />
            <el-option label="展示模型" value="show" />
          </el-select>
        </el-form-item>
        <el-form-item label="作者" ><el-input v-model="modelDialog.model.authName" /></el-form-item>
        <el-form-item label="描述" ><el-input v-model="modelDialog.model.description" /></el-form-item>

        <el-form-item>
          <el-button type="primary" @click="modelDialog.confirm" >确认</el-button>
          <el-button @click="modelDialog.visible=false" >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
import axios from "axios";

export default {
  name: 'AdminView',

  data() {
    return {
      userData: [],
      modelData: [],
      tipDialog: {
        visible: false,
        title: '',
        message: '',
        confirm: ()=>{}
      },
      userDialog: {
        visible: false,
        user: {},
        confirm: ()=>{}
      },
      modelDialog: {
        visible: false,
        file: '',
        showUpload: true,
        model: {},
        confirm: ()=>{}
      }
    }
  },

  created() {
    let self = this;
    let userId = Cookies.get("userId");
    if(userId == undefined) this.$router.push("/login");

    // 查看角色权限
    axios({method: 'get', url: '/apis/user/getUser/'}).then(function(response) {
      if(response.data.role != 'admin') self.$router.push("/login");
      self.getAllUser();
      self.getAllModel();
      setInterval(()=>{
        self.getAllUser();
        self.getAllModel();
      }, 10000);
    });
  },

  methods: {
    getAllUser() {
      let self = this;

      axios({method: 'get', url: '/apis/user/getAllUser/'}).then(function(response) {
        self.userData = response.data;
      });
    },
    getAllModel() {
      let self = this;

      axios({method: 'get', url: '/apis/model/getAllModel/'}).then(function(response) {
        self.modelData = response.data;
      });
    },
    addUserConfirm() {
      this.userDialog.visible = true;
      this.userDialog.user = {username: '', password: '', role: 'normal', email: '', phone: ''};
      this.userDialog.confirm = ()=>{this.addUser(this.userDialog.user);};
    },
    addUser(user) {
      let self = this;

      this.userDialog.visible = false;

      axios({method: 'post', url: '/apis/user/addUser/', data: user}).then(function(response) {
        if(response.data.result == true) self.getAllUser();
      });
    },
    updateUserConfirm(user) {
      this.userDialog.visible = true;
      this.userDialog.user = user;
      this.userDialog.confirm = ()=>{this.updateUser(this.userDialog.user);};
    },
    updateUser(user) {
      let self = this;

      this.userDialog.visible = false;

      axios({method: 'post', url: '/apis/user/updateUser/', data: user}).then(function(response) {
        if(response.data.result == true) self.getAllUser();
      });
    },
    removeUserConfirm(user) {
      this.tipDialog.title = '危险操作';
      this.tipDialog.message = '操作不可逆，确认删除该用户？' + '用户名：' + user.username;
      this.tipDialog.visible = true;
      this.tipDialog.confirm = ()=>{this.removeUser(user.userId);};
    },
    removeUser(userId) {
      let self = this;

      this.tipDialog.visible = false;

      axios({method: 'post', url: '/apis/user/removeUser/', data: {userId: userId}}).then(function(response) {
        if(response.data.result == true) self.getAllUser();
      });
    },
    addModelConfirm() {
      this.modelDialog.visible = true;
      this.modelDialog.showUpload = true;
      this.modelDialog.model = {modelName: '', modelPath: '', modelType: 'train', authName: '', description: ''};
      this.modelDialog.confirm = ()=>{this.addModel();};
    },
    addModel() {
      let self = this;
      let uploadData = new FormData();

      if (this.modelDialog.file == undefined) {
        alert('模型文件不得为空！');
        return ;
      }

      this.modelDialog.visible = false;

      uploadData.append('file', this.modelDialog.file);
      uploadData.append('model', JSON.stringify(this.modelDialog.model));
      axios({method: 'post', url: '/apis/model/addModel/', data: uploadData}).then(function(response) {
        if(response.data.modelId != 0) self.getAllModel();
      });
    },
    updateModelConfirm(model) {
      this.modelDialog.visible = true;
      this.modelDialog.showUpload = false;
      this.modelDialog.model = model;
      this.modelDialog.confirm = ()=>{this.updateModel(this.modelDialog.model);};
    },
    updateModel(model) {
      let self = this;

      this.modelDialog.visible = false;

      axios({method: 'post', url: '/apis/model/updateModel/', data: model}).then(function(response) {
        if(response.data.result == true) self.getAllModel();
      });
    },
    removeModelConfirm(model) {
      this.tipDialog.title = '危险操作';
      this.tipDialog.message = '操作不可逆，确认删除该模型？' + '模型名称：' + model.modelName;
      this.tipDialog.visible = true;
      this.tipDialog.confirm = ()=>{this.removeModel(model.modelId);};
    },
    removeModel(modelId) {
      let self = this;

      this.tipDialog.visible = false;

      axios({method: 'post', url: '/apis/model/removeModel/', data: {modelId: modelId}}).then(function(response) {
        if(response.data.result == true) self.getAllModel();
      });
    },
    beforeUpload(file) {
      this.modelDialog.file = file.raw;
    }
  }
}
</script>

<style lang="scss" >

.logo img {
  width: 40px;
  height: 40px;
  margin-right: 1em;
}

.flex-grow {
  flex-grow: 1;
}

.el-tabs {
  width: 100%;
}

.el-tab-pane {
  padding: 100px 0;
}

</style>
