<template>
  <div id="all" v-loading="loading">
    <div id="pk">
      <div id="person1">
        <div id="touxiang1">
          <Avatar icon="ios-person" size="97" :src="myavatar" />
        </div>
        <div id="jindu">
          <p style="font-weight:bold;">&nbsp;&nbsp;&nbsp;{{myname}}</p>
          <Progress
            vertical
            :percent="this.current_grades"
            status="active"
            :stroke-width="30"
            id="jindutiao"
          />
        </div>
      </div>
      <div id="timu">
        <div id="shijian" style="font-size:25px;">{{second}}s</div>
        <Icon
          type="ios-flash"
          style="margin-left:194px;position:absolute;top:113px;color:yellow;"
          size="38"
        />
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
          <Avatar icon="ios-person" size="97" :src="otheravatar" />
        </div>
        <div id="jindu">
          <p style="font-weight:bold;">&nbsp;&nbsp;&nbsp;{{othername}}</p>
          <Progress
            vertical
            :percent="this.Robot"
            status="active"
            :stroke-width="30"
            type="yellow"
            id="jindutiao"
          />
        </div>
      </div>
    </div>
    <Modal
      v-model="modal2"
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
      modal2: false,
      current_rank: 0,
      wrong: 0,
      right: 0,
      myname: "",
      myavatar: "",
      othername: "",
      otheravatar: "",
      id: "",
      time1: "",
      minutes: 0,
      seconds: 12,
      isnext: false,
      current_num: 0,
      subject_total_num: 0,
      current_grades: 0,
      Robot: 0,
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
    // 倒计时
    num(n) {
      return n < 10 ? "" + n : "" + n;
    },
    // 倒计时
    timer() {
      let _this = this;
      this.time1 = setInterval(function() {
        if (_this.seconds === 0 && _this.minutes !== 0) {
          _this.seconds = 59;
          _this.minutes -= 1;
        } else if (_this.minutes === 0 && _this.seconds === 0) {
          _this.nextsubject();
        } else {
          _this.seconds -= 1;
        }
      }, 1000);
    },
    checkanswerA() {
      if (this.isnext === true) return;
      this.isnext = true;
      if (random(1, 7) > 4 && this.current_num <= 5) {
        this.Robot = this.Robot + 10;
      } else if (random(1, 7) > 4 && this.current_num > 5) {
        this.Robot = this.Robot + 40;
      }
      if (this.subject_total[this.current_num].answer === "A") {
        //判断答案是A，渲染选项，自动跳转，熟悉度加减
        this.right++;
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiarityup.do", params);
        if (this.current_num <= 5) {
          this.current_grades = this.current_grades + 10;
        } else {
          this.current_grades = this.current_grades + 40;
        }
        this.isA = "right";
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
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      }
    },
    checkanswerB() {
      if (this.isnext === true) return;
      this.isnext = true;
      if (random(1, 7) > 4 && this.current_num <= 5) {
        this.Robot = this.Robot + 10;
      } else if (random(1, 7) > 4 && this.current_num > 5) {
        this.Robot = this.Robot + 40;
      }
      if (this.subject_total[this.current_num].answer === "B") {
        this.right++;
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiarityup.do", params);
        if (this.current_num <= 5) {
          this.current_grades = this.current_grades + 10;
        } else {
          this.current_grades = this.current_grades + 40;
        }
        this.isB = "right";
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
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      }
    },
    checkanswerC() {
      if (this.isnext === true) return;
      this.isnext = true;
      if (random(1, 7) > 4 && this.current_num <= 5) {
        this.Robot = this.Robot + 10;
      } else if (random(1, 7) > 4 && this.current_num > 5) {
        this.Robot = this.Robot + 40;
      }
      if (this.subject_total[this.current_num].answer === "C") {
        this.right++;
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiarityup.do", params);
        if (this.current_num <= 5) {
          this.current_grades = this.current_grades + 10;
        } else {
          this.current_grades = this.current_grades + 40;
        }
        this.isC = "right";
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
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      }
    },
    checkanswerD() {
      if (this.isnext === true) return;
      this.isnext = true;
      if (random(1, 7) > 4 && this.current_num <= 5) {
        this.Robot = this.Robot + 10;
      } else if (random(1, 7) > 4 && this.current_num > 5) {
        this.Robot = this.Robot + 40;
      }
      if (this.subject_total[this.current_num].answer === "D") {
        this.right++;
        this.word_id = this.subject_total[this.current_num].word_id;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.word_id);
        axios.post("familiarityup.do", params);
        if (this.current_num <= 5) {
          this.current_grades = this.current_grades + 10;
        } else {
          this.current_grades = this.current_grades + 40;
        }
        this.isD = "right";
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
        let time = setTimeout(() => {
          this.nextsubject();
        }, 1000);
      }
    },
    nextsubject() {
      if (this.current_num === 6) {
        //共有7题 到达边界时自动退出
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
        this.modal2 = true;
        clearInterval(this.time1);
        return;
      }
      this.current_num++;
      this.isnext = false;
      this.isA = "";
      this.isB = "";
      this.isC = "";
      this.isD = "";
      this.seconds = 12;
    }
  },
  mounted() {
    // 倒计时
    this.timer();
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
    let that = this;
    let params = new URLSearchParams();
    params.append("studentid", sessionStorage.getItem("token"));
    axios.post("arenapk.do", params).then(function(res) {
      that.myname = res.data[7].myname;
      that.myavatar = res.data[7].myavatar;
      that.othername = res.data[7].othername;
      that.otheravatar = res.data[7].otheravatar;
      that.subject_total = res.data.slice(0, 7);
      that.subject_total_num = that.subject_total.length;
      that.loading = false;
    });
  },
  beforeDestroy() {
    clearInterval(this.time1);
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
  width: 80px;
  height: 80px;
  margin: 15px 75px 30px;
  background-color: #f5f7f9;
  background-color: rgba(0, 0, 0, 0);
}
#touxiang2 {
  width: 80px;
  height: 80px;
  margin: 13px 85px 30px;
  background-color: #f5f7f9;
  background-color: rgba(0, 0, 0, 0);
}
#jindu {
  height: 400px;
  width: 150px;
  margin: 0 0 0 40px;
  text-align: center;
}
#jindutiao {
  padding-left: 43px;
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
  padding-top: 11px;
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