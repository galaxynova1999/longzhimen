<template>
  <div id="u0" v-if="myname!==''">
    <div id="u1">
      <div id="u1_0">
        <p>
          <router-link to="/studentmain">
            <span>
              <Icon type="md-home" />首页
            </span>
          </router-link>
        </p>
      </div>
      <div id="u1_1">
        <p>
          <router-link to="/RankingList">
            <span>排行榜</span>
          </router-link>
        </p>
      </div>
      <div id="u1_2">
        <p>
          <router-link to="/RankingList">
            <span>
              <Icon type="md-settings" />设置
            </span>
          </router-link>
        </p>
      </div>
      <div id="u1_3">
        <a
          href="https://www.yuque.com/books/share/156a5f6a-84e3-46e1-9b17-b4f5efb13474?#"
          target="_blank"
        >
          <Icon type="md-help-circle" />帮助
        </a>
      </div>
      <div id="u1_4">
        <p>
          <span @click="exit" style="cursor: pointer;">
            <Icon type="md-exit" />退出
          </span>
        </p>
      </div>
    </div>
    <div id="left">
      <div id="u6_up">
        <div id="u6_id_image">
          <Avatar icon="ios-person" :size="70" shape="circle" :src="myavatar" />
          <div id="u6_1">
            <span style="font-size: 25px;display: inline; padding-left: 20px">{{myname}}</span>
            <div style="margin-top: 0px;margin-left: 20px">
              <Icon type="ios-ribbon" />
              <span style="font-size: 15px">{{mycoin}}</span>
            </div>
          </div>
        </div>
        <ButtonGroup shape="circle" style="margin-top: 110px;margin-left:25px">
          <Button :class="state1" size="small" style="border:none;" @click="changetostate1">普通模式</Button>
          <Button :class="state2" size="small" style="border:none;" @click="changetostate2">疯狂模式</Button>
        </ButtonGroup>
        <Button
          id="punch"
          icon="md-flag"
          size="small"
          type="info"
          shape="circle"
          v-if="!is_signin"
          @click="punch"
        >打卡</Button>
        <Button
          icon="ios-calendar"
          size="small"
          type="info"
          style="position:absolute;top:110px;left:170px;background-color:white;color:rgb(255,177,40);border: none;;width: 125px"
          shape="circle"
          v-if="is_signin"
          @click="check"
        >查看打卡日历</Button>
      </div>
      <div id="u6_down">
        <Button
          type="text"
          id="btn1"
          :class="btn_type1"
          size="large"
          long
          style="margin-top: 20px;box-shadow: 0 0 10px rgb(74,199,103);"
          @click="navtostudy"
        >正在学习</Button>
        <Button
          type="text"
          id="btn2"
          :class="btn_type2"
          long
          style="margin-top: 30px;box-shadow: 0 0 10px rgb(192,192,192);"
          size="large"
          @click="navtostatistic"
        >学习统计</Button>
        <Button
          type="text"
          id="btn3"
          :class="btn_type3"
          long
          style="margin-top: 30px;box-shadow: 0 0 10px rgb(192,192,192);"
          size="large"
          @click="navtobook"
        >单词本</Button>
        <Button
          type="text"
          id="btn4"
          :class="btn_type4"
          long
          style="margin-top: 30px;box-shadow: 0 0 10px rgb(192,192,192);"
          size="large"
          @click="navtocompetition"
        >单词比赛</Button>
      </div>
    </div>
    <div id="right">
      <router-view></router-view>
    </div>
    <Modal v-model="modal1" title="打卡日历" :footer-hide="true">
      <Calendar :markDate="arr"></Calendar>
    </Modal>
  </div>
</template>
<script>
import axios from "axios";
import Calendar from "vue-calendar-component";
export default {
  components: {
    Calendar
  },
  data() {
    return {
      myname: "",
      mycoin: "",
      myavatar: "",
      is_signin: true,
      state1: "",
      state2: "",
      btn_type1: "success",
      btn_type2: "",
      btn_type3: "",
      btn_type4: "",
      modal1: false,
      arr: [],
      current_study_status: ""
    };
  },
  methods: {
    changetostate2() {
      let that = this;
      if (this.current_study_status === 1) {
        this.$Message.warning("你已经在疯狂模式啦！");
        return;
      } else {
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        axios.post("changestudystatus.do", params);
        this.$Message.success("你已经切换到疯狂模式，题量将会增加哦！");
        that.current_study_status = 1;
        that.state1 = "unselected";
        that.state2 = "selected";
      }
    },
    changetostate1() {
      let that = this;
      if (this.current_study_status === -1) {
        this.$Message.warning("你已经在普通模式啦！");
        return;
      } else {
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        axios.post("changestudystatus.do", params);
        this.$Message.success("你已经切换到普通模式");
        that.current_study_status = -1;
        that.state1 = "selected";
        that.state2 = "unselected";
      }
    },

    //点击正在学习按钮
    navtostudy() {
      document.getElementById("btn1").style =
        "box-shadow: 0 0 10px rgb(74,199,103);margin-top: 20px;";
      document.getElementById("btn2").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 30px;";
      document.getElementById("btn3").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 30px;";
      document.getElementById("btn4").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 30px;";
      this.btn_type1 = "success";
      this.btn_type2 = "";
      this.btn_type3 = "";
      this.btn_type4 = "";
      this.$router.push("/Studying");
    },
    //点击学习统计按钮
    navtostatistic() {
      document.getElementById("btn1").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 20px;";
      document.getElementById("btn2").style =
        "box-shadow: 0 0 10px rgb(74,199,103);margin-top: 30px;";
      document.getElementById("btn3").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 30px;";
      document.getElementById("btn4").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 30px;";
      this.btn_type1 = "";
      this.btn_type2 = "success";
      this.btn_type3 = "";
      this.btn_type4 = "";
      this.$router.push("/Analyse");
    },
    //点击单词本按钮
    navtobook() {
      document.getElementById("btn1").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 20px;";
      document.getElementById("btn3").style =
        "box-shadow: 0 0 10px rgb(74,199,103);margin-top: 30px;";
      document.getElementById("btn2").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 30px;";
      document.getElementById("btn4").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 30px;";
      this.btn_type1 = "";
      this.btn_type2 = "";
      this.btn_type3 = "success";
      this.btn_type4 = "";
      this.$router.push("/Book");
    },
    //点击单词比赛按钮
    navtocompetition() {
      document.getElementById("btn1").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 20px;";
      document.getElementById("btn4").style =
        "box-shadow: 0 0 10px rgb(74,199,103);margin-top: 30px;";
      document.getElementById("btn3").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 30px;";
      document.getElementById("btn2").style =
        "box-shadow: 0 0 10px rgb(192,192,192);margin-top: 30px;";
      this.btn_type1 = "";
      this.btn_type2 = "";
      this.btn_type3 = "";
      this.btn_type4 = "success";
      this.$router.push("/Competition");
    },
    //查看打卡日历
    check() {
      if (this.arr.length === 0) {
        setTimeout(function() {
          this.modal1 = true;
        }, 800);
      } else this.modal1 = true;
    },
    //打卡
    punch() {
      let that = this;
      this.mycoin+=1;
      let params = new URLSearchParams();
      params.append("studentID", sessionStorage.getItem("token"));
      axios.post("signin.do", params).then(function(res) {
        if (res.data === 1) {
          that.is_signin = !that.is_signin;
          axios.post("signinCalendar.do", params).then(function(res) {
            //打卡完成马上请求日历
            that.arr = res.data;
          });
          that.$Message.success("打卡成功");
        }
      });
    },
    //退出
    exit() {
      let params = new URLSearchParams();
      params.append("studentid", sessionStorage.getItem("token"));
      axios.post("logout.do", params);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("type");
      this.$router.push("/");
    }
  },
  created() {
    let that = this;
    let params = new URLSearchParams();
    let params2 = new URLSearchParams();
    //传参数请求学生信息
    params.append("studentid", sessionStorage.getItem("token"));
    params2.append("studentID", sessionStorage.getItem("token"));
    axios.post("listlogininfo.do", params).then(function(res) {
      let data = res.data;
      that.myname = data.studentname;
      that.mycoin = data.coin;
      that.myavatar = data.avatar;
      that.current_study_status = res.data.current_study_status;
      if (that.current_study_status === -1) {
        that.state1 = "selected";
        that.state2 = "unselected";
      } else {
        that.state1 = "unselected";
        that.state2 = "selected";
      }
    });
    axios.post("showSignin.do", params2).then(function(res) {
      if (res.data === 1) {
        that.is_signin = false;
      } else {
        axios.post("signinCalendar.do", params2).then(function(res) {
          that.arr = res.data;
        });
        that.is_signin = true;
      }
    });
  }
};
</script>
<style scoped>
.selected {
  background-color: rgb(255, 177, 40);
}
.unselected {
  color: black;
}

#u0 {
  background-image: url("../assets/image/首页.png");
  background-size: 1600px 760px;
  background-repeat: no-repeat;
  height: 760px;
  width: 1600px;
}
#u1_0 {
  position: absolute;
  top: 15px;
  left: 940px;
  font-size: 15px;
}
#u1_1 {
  position: absolute;
  top: 15px;
  left: 1040px;
}
#u1_2 {
  position: absolute;
  top: 15px;
  left: 1120px;
}
#u1_3 {
  position: absolute;
  top: 15px;
  left: 1200px;
}
#u1_4 {
  position: absolute;
  top: 15px;
  left: 1280px;
}
#left {
  background-color: white;
  position: absolute;
  top: 86px;
  left: 287px;
  height: 450px;
  width: 303px;
  border-radius: 10px;
}
#right {
  background-color: white;
  border-radius: 10px;
  height: 620px;
  width: 712px;
  position: absolute;
  top: 86px;
  left: 611px;
}
#u6_up {
  height: 145px;
  background-image: url("../assets/image/头像.png");
  border-bottom-style: solid;
  border-width: 1px;
  border-color: #d8d8d8;
}
#u6_id_image {
  position: absolute;
  top: 20px;
  left: 30px;
}
#u6_1 {
  position: relative;
  left: 5px;
  float: right;
  top: 10px;
}
#u6_down {
  margin-left: 25px;
  height: 310px;
  width: 250px;
}
.success {
  background-color: rgb(74, 199, 103);
  box-shadow: 5px 5px 15px black;
  color: white;
}
#punch {
  position: absolute;
  top: 110px;
  left: 190px;
  background-color: white;
  color: rgb(255, 177, 40);
  border: none;
  width: 90px;
}
</style>
