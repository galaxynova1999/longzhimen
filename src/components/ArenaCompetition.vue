<template>
  <div id="all" v-loading="loading">
    <div id="pk">
      <div id="person1">
        <div id="touxiang1">
          <p>错误</p>
          <span>{{wrong_num}}</span>
          <span>次</span>
        </div>
        <div id="daojv">
          <div id="daojvbiaoti">道具</div>
          <Badge :count="canwrong_num" type="info" show-zero>
            <img src="../assets/image/wrong.png" id="daojvyi" @click="wrong_num_reduce" />
          </Badge>
          <div id="shuoming">
            <span id="zi">错误次数-</span>
            <span style="color:#1E90FF;font-weight: bold;">1</span>
          </div>
          <Badge :count="canadd_time" type="warning" show-zero>
            <img src="../assets/image/zhong.png" id="daojvyi" @click="addtime" />
          </Badge>
          <span id="zier">答题时间+</span>
          <span style="color:#FF7F00;font-weight: bold;">2</span>
        </div>
      </div>
      <div id="timu">
        <div id="shijian" style="font-size:25px;">
          <Icon type="ios-flash" style="color:yellow;" size="38" />
          {{minutes}}分{{second}}秒
        </div>
        <div id="biaoti" v-if="subject_total_num !== 0">
          <div id="yingyv">
            <span>{{subject_total[current_num].problem.split("#")[0]}}</span>
          </div>
          <div id="fanyi">
            <span>{{subject_total[current_num].problem.split("#")[1]}}</span>
          </div>
        </div>
        <div id="answer" v-if="subject_total_num !== 0">
          <Button
            id="xvanxiang"
            @click="checkanswerA"
            :class="isA"
          >{{subject_total[current_num].option_a}}</Button>
          <Icon id="is_A_right" size="35" v-if="isA === 'right'" type="md-checkmark" />
          <Icon id="is_A_wrong" size="35" v-if="isA === 'wrong'" type="md-close" />
          <Button
            id="xvanxiang"
            @click="checkanswerB"
            :class="isB"
          >{{subject_total[current_num].option_b}}</Button>
          <Icon id="is_B_right" size="35" v-if="isB === 'right'" type="md-checkmark" />
          <Icon id="is_B_wrong" size="35" v-if="isB === 'wrong'" type="md-close" />
          <Button
            id="xvanxiang"
            @click="checkanswerC"
            :class="isC"
          >{{subject_total[current_num].option_c}}</Button>
          <Icon id="is_C_right" size="35" v-if="isC === 'right'" type="md-checkmark" />
          <Icon id="is_C_wrong" size="35" v-if="isC === 'wrong'" type="md-close" />
          <Button
            id="xvanxiang"
            @click="checkanswerD"
            :class="isD"
          >{{subject_total[current_num].option_d}}</Button>
          <Icon id="is_D_right" size="35" v-if="isD === 'right'" type="md-checkmark" />
          <Icon id="is_D_wrong" size="35" v-if="isD === 'wrong'" type="md-close" />
        </div>
      </div>
      <div id="person2">
        <div id="touxiang2">
          <Avatar icon="ios-person" size="102" :src="avatar" />
          <br />
        </div>
        <div id="jindu">
          <p style="font-weight: bold;">{{name}}</p>
          <Progress
            vertical
            :percent="this.current_grades"
            status="active"
            :stroke-width="30"
            type="yellow"
          />
        </div>
      </div>
    </div>
    <Modal
      v-model="modal1"
      title="比赛结束!"
      :closable="false"
      :mask-closable="false"
      cancel-text
      width="430"
      @on-ok="ok"
    >
      <div>
        <div style="width:200px;margin-left:80px;">
          <span>
            <Icon type="md-checkmark-circle" color="#63B8FF" size="20" />
            &nbsp;&nbsp;回&nbsp;答&nbsp;正&nbsp;确：{{right}}题
          </span>
          <br />
          <span>
            <Icon type="md-close-circle" color="#FF7256" size="20" />
            &nbsp;&nbsp;回&nbsp;答&nbsp;错&nbsp;误：{{wrong}}题
          </span>
          <br />
          <span>
            <Icon type="md-trophy" color="#98FB98" size="20" />
            &nbsp;&nbsp;得&nbsp;分：{{current_grades}}分
          </span>
          <br />
          <span>
            <Icon type="md-stats" color="#C6E2FF" size="20" />
            &nbsp;&nbsp;你&nbsp;的&nbsp;排&nbsp;名&nbsp;为：{{current_rank}}
          </span>
          <br />
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "axios";
function random(lower, upper) {
  return Math.floor(Math.random() * (upper - lower)) + lower;
}
export default {
  data() {
    return {
      loading: false,
      modal1: false,
      name: "",
      avatar: "",
      id: "",
      word_id: "",
      time2: "",
      current_rank: 0,
      wrong: 0,
      right: 0,
      minutes: 2,
      seconds: 59,
      isnext: false,
      current_num: 0,
      subject_total_num: 0,
      current_grades: 0,
      wrong_num: 0,
      canwrong_num: 0,
      canadd_time: 0,
      isA: "",
      isB: "",
      isC: "",
      isD: "",
      subject_total: []
    };
  },
  methods: {
    ok() {
      this.$Message.info("比赛结束！");
      this.$router.push("Competition");
    },
    beforeunloadHandler(e) {
      e = e || window.event;
      if (e) {
        e.returnValue = "您是否确认离开此页面-您输入的数据可能不会被保存";
        this.$router.push("/Competition");
      }
      this.$router.push("/Competition");
      return "您是否确认离开此页面-您输入的数据可能不会被保存";
    },
    // 倒计时
    num(n) {
      return n < 10 ? "" + n : "" + n;
    },
    checkisout() {
      if (this.wrong_num >= 10) {
        this.id = this.$route.params.id;
        let params = new URLSearchParams();
        params.append("studentID", sessionStorage.getItem("token"));
        params.append("competitionID", this.id);
        params.append("scorestr", this.current_grades);
        let that = this;
        axios.post("finishCompetition.do", params).then(function(res) {
          that.current_rank = res.data;
        });
        this.isnext = true;
        this.modal1 = true;
        clearInterval(this.time2);
      }
    },
    // 倒计时
    timer() {
      var _this = this;
      this.time2 = setInterval(function() {
        if (_this.seconds === 0 && _this.minutes !== 0) {
          _this.seconds = 59;
          _this.minutes -= 1;
        } else if (_this.minutes === 0 && _this.seconds === 0) {
          //一站到底时间到了自动提交
          _this.id = _this.$route.params.id;
          let params = new URLSearchParams();
          params.append("studentID", sessionStorage.getItem("token"));
          params.append("competitionID", _this.id);
          params.append("scorestr", _this.current_grades);
          let that = this;
          axios.post("finishCompetition.do", params).then(function(res) {
            that.current_rank = res.data;
          });
          //.then(function(res){})
          _this.modal1 = true;
          _this.isnext === true;
          clearInterval(_this.time2);
        } else {
          _this.seconds -= 1;
        }
      }, 1000);
    },
    wrong_num_reduce() {
      if (this.isnext === true) return;
      if (this.canwrong_num > 0 && this.wrong_num > 0) {
        this.canwrong_num--;
        this.wrong_num--;
      }
    },
    addtime() {
      if (this.isnext === true) return;
      if (this.canadd_time > 0) {
        this.canadd_time--;
        if (this.seconds + 2 >= 60) {
          this.minutes += 1;
          this.seconds -= 58;
        } else {
          this.seconds = this.seconds + 2;
        }
      }
    },
    checkanswerA() {
      if (this.isnext === true) return;
      this.isnext = true;
      if (this.subject_total[this.current_num].answer === "A") {
        //回答正确后返回熟悉度up已经自动跳到下一题
        this.right++;
        this.current_grades = this.current_grades + 5;
        this.isA = "right"; //渲染正确背景颜色，以及对应的icon
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiarityup.do", params);
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "A" &&
        this.subject_total[this.current_num].answer === "B"
      ) {
        this.wrong++;
        this.isA = "wrong";
        this.isB = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "A" &&
        this.subject_total[this.current_num].answer === "C"
      ) {
        this.wrong++;
        this.isA = "wrong";
        this.isC = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "A" &&
        this.subject_total[this.current_num].answer === "D"
      ) {
        this.wrong++;
        this.isA = "wrong";
        this.isD = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      }
    },
    checkanswerB() {
      if (this.isnext === true) return;
      this.isnext = true;
      if (this.subject_total[this.current_num].answer === "B") {
        this.right++;
        this.current_grades = this.current_grades + 5;
        this.isB = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiarityup.do", params);
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "B" &&
        this.subject_total[this.current_num].answer === "A"
      ) {
        this.wrong++;
        this.isB = "wrong";
        this.isA = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "B" &&
        this.subject_total[this.current_num].answer === "C"
      ) {
        this.wrong++;
        this.isB = "wrong";
        this.isC = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "B" &&
        this.subject_total[this.current_num].answer === "D"
      ) {
        this.wrong++;
        this.isB = "wrong";
        this.isD = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      }
    },
    checkanswerC() {
      if (this.isnext === true) return;
      this.isnext = true;
      if (this.subject_total[this.current_num].answer === "C") {
        this.right++;
        this.current_grades = this.current_grades + 5;
        this.isC = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiarityup.do", params);
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "C" &&
        this.subject_total[this.current_num].answer === "A"
      ) {
        this.wrong++;
        this.isC = "wrong";
        this.isA = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "C" &&
        this.subject_total[this.current_num].answer === "B"
      ) {
        this.wrong++;
        this.isC = "wrong";
        this.isB = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "C" &&
        this.subject_total[this.current_num].answer === "D"
      ) {
        this.wrong++;
        this.isC = "wrong";
        this.isD = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      }
    },
    checkanswerD() {
      if (this.isnext === true) return;
      this.isnext = true;
      if (this.subject_total[this.current_num].answer === "D") {
        this.right++;
        this.current_grades = this.current_grades + 5;
        this.isD = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiarityup.do", params);
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "D" &&
        this.subject_total[this.current_num].answer === "A"
      ) {
        this.wrong++;
        this.isD = "wrong";
        this.isA = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "D" &&
        this.subject_total[this.current_num].answer === "B"
      ) {
        this.wrong++;
        this.isD = "wrong";
        this.isB = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      } else if (
        this.subject_total[this.current_num].answer !== "D" &&
        this.subject_total[this.current_num].answer === "C"
      ) {
        this.wrong++;
        this.isD = "wrong";
        this.isC = "right";
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiaritydown.do", params);
        this.wrong_num++;
        this.checkisout();
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      }
    },
    nextsubject() {
      this.current_num++;
      this.isnext = false;
      this.isA = "";
      this.isB = "";
      this.isC = "";
      this.isD = "";
      if (this.current_num >= 20) {
        //一战到底一共20题当回答结束后自动提交
        this.id = this.$route.params.id;
        let params = new URLSearchParams();
        params.append("studentID", sessionStorage.getItem("token"));
        params.append("competitionID", this.id);
        params.append("scorestr", this.current_grades);
        let that = this;
        axios.post("finishCompetition.do", params).then(function(res) {
          that.current_rank = res.data;
        });
        //this.rank=res.data;
        this.modal1 = true;
        this.isnext === true;
        clearInterval(this.time2);
      }
    }
  },
  mounted() {
    // 倒计时
    this.timer();
    window.addEventListener("beforeunload", e => {
      this.beforeunloadHandler(e);
    });
  },
  watch: {
    econd: {
      handler(newVal) {
        this.num(newVal);
      }
    },
    minute: {
      handler(newVal) {
        this.num(newVal);
      }
    }
  },
  computed: {
    second: function() {
      return this.num(this.seconds);
    },
    minute: function() {
      return this.num(this.minutes);
    }
  },
  created() {
    this.loading = true;
    this.id = this.$route.params.id;
    let that = this;
    let params = new URLSearchParams();
    params.append("studentid", sessionStorage.getItem("token"));
    params.append("id", this.id);
    axios.post("onesteptotheend.do", params).then(function(res) {
      that.name = res.data.name;
      that.avatar = res.data.avatar;
      that.subject_total = res.data.problem;
      that.canwrong_num = Number(res.data.prop1);
      that.canadd_time = Number(res.data.prop2);
      that.subject_total_num = that.subject_total.length;
      that.loading = false;
    });
  },
  beforeDestroy() {
    clearInterval(this.time2);
    window.removeEventListener("beforeunload", e => {
      this.beforeunloadHandler(e);
    });
  }
};
</script>
<style scoped>
.right {
  background-color: #00cd00;
  color: #ffffff;
}
.wrong {
  background-color: #ff4040;
  color: #ffffff;
}
#all {
  width: 100%;
  height: 800px;
  background-image: url("../assets/image/u659.png");
  padding-top: 65px;
}
#center {
  width: 1000px;
  height: 700px;
  background-color: aquamarine;
  margin: 50px auto;
}
#pk {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 950px;
  height: 600px;
  margin: 0px auto 0;
}
#person1 {
  width: 200px;
  height: 550px;
  margin-top: 0;
}
#touxiang1 {
  width: 97px;
  height: 97px;
  margin: 13px 74px 30px;
  background-color: rgba(255, 99, 99);
  border-radius: 48px;
  font-weight: bold;
  color: #f5f7f9;
  text-align: center;
  padding-top: 25px;
}
#touxiang2 {
  width: 80px;
  height: 80px;
  margin: 12px 83px 30px;
  background-color: #f5f7f9;
  background-color: rgba(0, 0, 0, 0);
}
#daojv {
  height: 350px;
  width: 170px;
  margin: 30px 40px 0;
  background-color: rgb(239, 249, 255);
  border-radius: 10px;
}
#jindu {
  height: 350px;
  width: 50px;
  margin: 10px 119px 0;
}
#daojvbiaoti {
  height: 45px;
  background-color: rgb(46, 180, 255);
  text-align: center;
  color: #f5f7f9;
  font-size: 17px;
  padding-top: 9px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin: 0 0 20px 0;
}
#shuoming {
  height: 30px;
  margin: 0 0 10px 0;
}
#zi {
  margin: 0 0 0 50px;
  color: #1e90ff;
  font-weight: bold;
}
#zier {
  margin: 0 0 0 50px;
  color: #ff7f00;
  font-weight: bold;
}
#daojvyi {
  margin: 0 0 0 43px;
}
#timu {
  width: 450px;
  height: 550px;
  background-color: rgba(0, 0, 0, 0);
}
#shijian {
  width: 153px;
  height: 63px;
  background-color: #1e90ff;
  margin: 37px 175px;
  padding-top: 9px;
  border-radius: 20px;
  text-align: center;
  font-size: 20px;
  color: white;
}
#biaoti {
  display: flex;
  flex-wrap: wrap;
  width: 400px;
  height: 130px;
  font-size: 15px;
  margin: 0 50px;
}
#yingyv {
  width: 400px;
  margin: 5px 0 0 0;
  font-size: 20px;
  font-weight: bold;
  word-wrap: break-word;
}
#fanyi {
  width: 300px;
  height: 20px;
  margin: 0 0 0 0;
  font-size: 13px;
  font-weight: bold;
  word-break: break-all;
}
#answer {
  width: 400px;
  margin: 5px 50px 0;
}
#xvanxiang {
  margin: 10px 0 0 0;
  border-radius: 5px;
  font-size: 17px;
  width: 355px;
  position: relative;
  border-radius: 8px;
}
#is_A_right {
  margin-left: 10px;
  position: absolute;
  top: 345px;
  color: #00cd00;
}
#is_A_wrong {
  margin-left: 10px;
  position: absolute;
  top: 345px;
  color: #ff4040;
}
#is_B_right {
  margin-left: 10px;
  position: absolute;
  top: 390px;
  color: #00cd00;
}
#is_B_wrong {
  margin-left: 10px;
  position: absolute;
  top: 390px;
  color: #ff4040;
}
#is_C_right {
  margin-left: 10px;
  position: absolute;
  top: 430px;
  color: #00cd00;
}
#is_C_wrong {
  margin-left: 10px;
  position: absolute;
  top: 430px;
  color: #ff4040;
}
#is_D_right {
  margin-left: 10px;
  position: absolute;
  top: 475px;
  color: #00cd00;
}
#is_D_wrong {
  margin-left: 10px;
  position: absolute;
  top: 475px;
  color: #ff4040;
}
#person2 {
  width: 200px;
  height: 550px;
  margin-top: 0px;
}
</style>