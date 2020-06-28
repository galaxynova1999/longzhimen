<template>
  <div id="main">
    <div id="logo">
      <img src="../assets/image/u24.png" style="width: 50px; height: 40px" />
      <span style="font-size: 35px;">单词赢</span>
      <br />
      <span>三天背完小升初 七天背完中高考</span>
    </div>
    <div id="input">
      <Input clearable id="inputname" placeholder="账户" prefix="ios-contact" v-model="username" />
      <Input
        clearable
        id="inputpwd"
        placeholder="密码"
        prefix="ios-hand"
        type="password"
        v-model="password"
      />
    </div>
    <div id="option">
      <Checkbox id="autologin" v-model="autologin">自动登录</Checkbox>
      <a href id="forgetpwd">忘记密码</a>
    </div>
    <Button @click.native="login" id="subbtn" size="large" type="primary">登录</Button>
    <div id="buttom">
      <span>帮助</span>
      <Divider type="vertical" />
      <span>隐私</span>
      <Divider type="vertical" />
      <span>条款</span>
    </div>
    <Divider size="small" />
    <span style="margin-left: 42%">Copyright&copy; 四大天王有五个是常识出品</span>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data: function() {
    return {
      value: "",
      autologin: true,
      username: "",
      password: ""
    };
  },
  methods: {
    //登录功能
    login: function() {
      let that = this;
      //输入检查
      if (this.username === "" || this.password === "") {
        this.$Notice.error({
          title: "用户名或密码不能为空"
        });
        return;
      }
      let params = new URLSearchParams();
      params.append("username", that.username);
      params.append("password", that.password);
      axios
        .post("login.do", params)
        .then(function(res) {
          if (res.data.status === "success" && res.data.des === "teacher") {
            //登录成功存储token
            sessionStorage.setItem("token", that.username);
            sessionStorage.setItem("type", res.data.des);
            that.$router.push("/teachermain");
          } else if (
            res.data.status === "success" &&
            res.data.des === "student"
          ) {
            sessionStorage.setItem("token", that.username);
            sessionStorage.setItem("type", res.data.des);
            that.$router.push("/studentmain");
          } else if (res.data.status === "failed") {
            that.$Notice.error({
              title: "用户名或密码错误",
              desc: res.data.des
            });
          }
        })
        .catch(function(err) {
          that.$Notice.error({
            title: "网络连接错误"
          });
        });
    }
  }
};
</script>

<style scoped>
#main {
  height: 750px;
  margin-left: 150px;
  margin-right: 150px;
  background-image: url("../assets/image/login_background.jpg");
  background-attachment: fixed;
}

#logo {
  padding-left: 40%;
  padding-top: 160px;
}

#inputname {
  display: block;
  width: 350px;
  margin-top: 30px;
  margin-left: 35%;
}

#inputpwd {
  display: block;
  margin-top: 20px;
  width: 350px;
  margin-left: 35%;
}

#autologin {
  margin-left: 35%;
  display: inline;
}

#option {
  margin-top: 20px;
}

#forgetpwd {
  padding-left: 200px;
}

#subbtn {
  width: 350px;
  margin-left: 35%;
  margin-top: 20px;
}

#buttom {
  margin-left: 43%;
  margin-top: 200px;
}
</style>
