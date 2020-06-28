<template>
  <div id="main">
    <Form
      :rules="ruleCustom"
      :label-width="100"
      style="margin-top: 30px"
      ref="formCustom"
      :model="formCustom"
    >
      <FormItem label="旧密码">
        <Input type="password" v-model="formCustom.oldpasswd" style="width: 400px"/>
      </FormItem>
      <FormItem label="新密码" prop="passwd">
        <Input type="password" style="width: 400px" v-model="formCustom.passwd" />
      </FormItem>
      <FormItem label="确认新密码" prop="passwdCheck">
        <Input type="password" style="width: 400px" v-model="formCustom.passwdCheck" />
      </FormItem>
      <FormItem>
        <Button type="primary" style="width: 200px;height: 45px;" @click="confirm2('formCustom')">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import axios from 'axios'
export default {
  name: "changepassword",
  data() {
    //验证两次输入是否为空
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formCustom.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("passwdCheck");
        }
        callback();
      }
    };
    //验证二次输入的密码和第一次输入的是否相同
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.formCustom.passwd) {
        callback(new Error("两次输入不匹配"));
      } else {
        callback();
      }
    };
    return {
      formCustom: {
        passwd: "",
        passwdCheck: "",
        oldpasswd:""
      },
      ruleCustom: {
        passwd: [{ validator: validatePass, trigger: "blur" }],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }]
      }
    };
  },
  methods: {
    //第二步完成提交前验证
    confirm2(name) {
      let that=this;
      this.$refs[name].validate(valid => {
        if (valid) {
          let params=new URLSearchParams();
          params.append("id",sessionStorage.getItem("token"));
          params.append("oldpassword",that.formCustom.oldpasswd);
          params.append("newpassword",that.formCustom.passwd);
          axios.post("updatepassword.do",params)
          .then(function (res) {
             if(res.data==="success"){
               that.$Message.success("修改成功!请重新登录");
               that.$router.push("/");
               sessionStorage.removeItem("token");
               sessionStorage.removeItem("type");
             }
             else{
               that.$Message.error("修改失败，请检查原有密码是否正确");
             }
          })
        } else {

        }
      });
    }
  }
};
</script>

<style scoped>
#step {
  width: 600px;
}
#main {
  margin-left: 50px;
  margin-top: 50px;
}
#img {
  width: 100px;
  display: block;
  margin-left: 19%;
  margin-top: 30px;
}
#hint {
  font-size: 20px;
  font-weight: bold;
  margin-left: 20%;
  display: block;
}
</style>
