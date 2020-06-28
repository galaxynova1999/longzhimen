<style scoped xmlns:Header="http://www.w3.org/1999/html">
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

</style>
<template>
  <div class="layout">
    <Layout>
      <Header style="background-color: #17233d;position: relative">
          <img src="../assets/image/u24.png" style="width: 45px;margin-top: 13px">
          <span style="font-size: 25px;line-height: 25px;position: absolute;top: 14px;color: white;left: 110px">龙之门单词赢学习平台</span>
          <span style="font-size: 15px;position: absolute;top: 18px;left: 370px;color: white">教师端</span>
      </Header>
      <Layout>
        <Sider :style="{background: '#f8f8f9'}" hide-trigger>
          <Avatar shape="square" :src="avatar" :size="70" style="margin-left: 60px;margin-top: 15px" />
          <p style="font-size: 15px;margin-left: 78px;margin-top: 10px">{{myname}}</p>
          <Menu :open-names="['1','2','3']"  width="auto" style="background-color: #f8f8f9">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>我的信息
              </template>
              <MenuItem name="1-1">个人信息</MenuItem>
              <MenuItem name="1-2" to="changepwd">修改密码</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>学习管理
              </template>
              <MenuItem name="2-1" to="classlist">班级列表</MenuItem>
              <MenuItem name="2-2" to="studentlist">学生名册</MenuItem>
              <MenuItem name="2-3" to="statistics">学习统计</MenuItem>
              <MenuItem name="2-4" to="teachercompetition">单词比赛</MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>系统设置
              </template>
              <MenuItem @click.native="exit" name="3-1">退出</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px',background: '#fff'}">
          <router-view />
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  import axios from 'axios'
export default {
  name: "teacheradmin",
  data() {
    return {
      myname:"",
      avatar:""
    };
  },
  created() {
    let that=this;
    let params=new URLSearchParams();
    params.append("id",sessionStorage.getItem("token"));
    axios.post("teacherinfo.do",params)
    .then(function (res) {
       that.myname=res.data.name;
       that.avatar=res.data.avatar;
    })

  },
  methods: {
    //退出时清空token
    exit() {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("type");
      this.$router.push("/");
    }
  }
};
</script>
