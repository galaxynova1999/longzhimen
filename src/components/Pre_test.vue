<template>
  <div>
    <div id="u0">
      <div id="u257" class="二级标题">
        <div id="u257_div"></div>
        <div id="u258_text" class="text">
          <p>
            <Icon type="md-create" />
            <span style="text-decoration:none;">学前检测 （计划检测 28 题）</span>
          </p>
        </div>
        <div id="u3_img">
          <img src="../assets/image/时钟.png" />
        </div>
        <div id="u4" class="countdown">
          <count-down
            v-on:start_callback="countDownS_cb(1)"
            v-on:end_callback="countDownE_cb(1)"
            :startTime="new Date().getTime()"
            :endTime="new Date().getTime()+180000"
            :tipTex="''"
            :tipTextEnd="''"
            :endText="'计时结束'"
            :dayTxt="''"
            :secondsTxt="''"
          ></count-down>
        </div>
        <Divider></Divider>
      </div>
    </div>
    <div id="question" v-if="pre_test_question.length!=0">
      <!-- 文字题 -->
      <p
        v-if="pre_test_question[current_page].istext"
      >{{current_page+1}}.{{pre_test_question[current_page].exercise}}</p>
      <!-- 语言题 -->
      <span v-if="!pre_test_question[current_page].istext">{{current_page+1}}.</span>
      <Button
        icon="md-volume-mute"
        size:large
        @click="speak"
        :class="sound"
        v-if="!pre_test_question[current_page].istext"
      ></Button>
      <!-- 进度环 -->
      <div id="progress">
        <Progress
          :percent="current_progress"
          v-if="!pre_test_question[current_page].istext"
          hide-info
          :stroke-color="'#FF9900'"
        />
      </div>
    </div>
    <div id="option" v-if="pre_test_question.length!=0">
      <Button
        :class="btn_type1"
        long
        shape="circle"
        size="large"
        @click="OP_A"
      >{{pre_test_question[current_page].option_a}}</Button>
      <Button
        :class="btn_type2"
        style="margin-top:25px;"
        long
        shape="circle"
        size="large"
        @click="OP_B"
      >{{pre_test_question[current_page].option_b}}</Button>
      <Button
        :class="btn_type3"
        style="margin-top:25px;"
        long
        shape="circle"
        size="large"
        @click="OP_C"
      >{{pre_test_question[current_page].option_c}}</Button>
      <Button
        :class="btn_type4"
        style="margin-top:25px;"
        long
        shape="circle"
        size="large"
        @click="OP_D"
      >{{pre_test_question[current_page].option_d}}</Button>
    </div>
    <div style="text-align:center;margin-top:150px;">
      <Button id="success" type="success" @click="prepage" v-if="isfirst">
        <Icon type="ios-arrow-back"></Icon>上一题
      </Button>
      <Button type="success" @click="nextpage" style="box-shadow: 0 0 10px rgb(74,199,103);">
        下一题
        <Icon type="ios-arrow-forward"></Icon>
      </Button>
    </div>
    <!-- 对话框 -->
    <Modal
      v-model="modal1"
      width="400"
      :closable="false"
      :footer-hide="true"
      :mask-closable="false"
    >
      <div style="text-align:center">
        <img src="..\assets\image\时间到了.png" />
        <div style="width:200px;margin-left:80px;">
          <Button
            type="success"
            style="box-shadow: 0 0 10px rgb(74,199,103);"
            long
            to="./studentmain"
          >开始学习</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import CountDown from "vue2-countdown";
import axios from "axios";
export default {
  data() {
    return {
      isfirst: false,
      timer: "",
      current_progress: 0,
      sound: "",
      istext: true,
      arr: [],
      modal1: false,
      btn_type1: "",
      btn_type2: "",
      btn_type3: "",
      btn_type4: "",
      //问题数组
      current_answer: [],
      right_answer: [],
      current_page: 0,
      page_total: 2,
      pre_test_question: []
    };
  },
  components: {
    CountDown
  },
  methods: {
    //发音
    speak() {
      this.current_progress = 0;
      let that = this;
      this.timer = setInterval(function() {
        if (that.current_progress >= 100) return;
        that.current_progress += 10;
      }, 100);
      this.audio = new Audio();
      this.audio.src = this.pre_test_question[this.current_page].exercise;
      let playPromiser = this.audio.play();
      this.sound = "playing";
      this.audio.onended = () => {
        that.sound = "";
        clearInterval(that.timer);
        that.current_progress = 100;
      };
    },
    //选项高亮和保存答案方法
    OP_A() {
      this.btn_type1 = "info";
      this.btn_type2 = "";
      this.btn_type3 = "";
      this.btn_type4 = "";
      this.current_answer[this.current_page] = "A";
    },
    OP_B() {
      this.btn_type1 = "";
      this.btn_type2 = "info";
      this.btn_type3 = "";
      this.btn_type4 = "";
      this.current_answer[this.current_page] = "B";
    },
    OP_C() {
      this.btn_type1 = "";
      this.btn_type2 = "";
      this.btn_type3 = "info";
      this.btn_type4 = "";
      this.current_answer[this.current_page] = "C";
    },
    OP_D() {
      this.btn_type1 = "";
      this.btn_type2 = "";
      this.btn_type3 = "";
      this.btn_type4 = "info";
      this.current_answer[this.current_page] = "D";
    },
    //计时器方法
    countDownS_cb: function(x) {},
    countDownE_cb: function(x) {
      this.$Message.warning("您已超时");
      this.$router.push({ path: "/studentmain" });
    },
    //上一页，下一页方法
    prepage() {
      this.current_progress = 0;
      if (this.current_page <= 0) {
        return;
      } else {
        if (this.current_page - 1 === 0) {
          this.isfirst = false;
        }
        this.current_page--;
        this.btn_type1 = "";
        this.btn_type2 = "";
        this.btn_type3 = "";
        this.btn_type4 = "";
        if (this.current_answer[this.current_page] === "A") {
          this.btn_type1 = "info";
          this.btn_type2 = "";
          this.btn_type3 = "";
          this.btn_type4 = "";
        }
        if (this.current_answer[this.current_page] === "B") {
          this.btn_type1 = "";
          this.btn_type2 = "info";
          this.btn_type3 = "";
          this.btn_type4 = "";
        }
        if (this.current_answer[this.current_page] === "C") {
          this.btn_type1 = "";
          this.btn_type2 = "";
          this.btn_type3 = "info";
          this.btn_type4 = "";
        }
        if (this.current_answer[this.current_page] === "D") {
          this.btn_type1 = "";
          this.btn_type2 = "";
          this.btn_type3 = "";
          this.btn_type4 = "info";
        }
      }
    },
    nextpage() {
      this.isfirst = true;
      this.current_progress = 0;
      if (this.current_page + 1 === this.page_total) {
        //判题
        if (this.current_answer.length < 28) {
          this.$Message.warning("您还有未完成的题目");
          return;
        }
        let score = 0;
        for (let i = 0; i < this.current_answer.length; i++) {
          if (this.current_answer[i] === this.right_answer[i]) {
            score += 10;
            this.arr.push({
              wordid: this.pre_test_question[this.current_page].word_id,
              right: 1
            });
          } else {
            this.arr.push({
              wordid: this.pre_test_question[this.current_page].word_id,
              right: 0
            });
          }
        }
        //TODO 答题完成跳转
        let that = this;
        this.$Message.success("您本课程学前测试获得了" + score + "分");
        //更改熟悉度
        let params2 = new URLSearchParams();
        params2.append("studentid", "2017214881");
        params2.append("status", JSON.stringify(this.arr));
        axios.post("familiaritychange.do", params2);
        //传学前测试答案
        let params = new URLSearchParams();
        params.append("scorestr", score);
        params.append("textbookID", this.$route.params.bookid);
        params.append("studentID", sessionStorage.getItem("token"));
        axios.post("addPriortestScore.do", params).then(function(res) {
          if (res.data === "0") {
            that.$Message.error("网络出现某些错误，请重试");
            return;
          } else {
            that.modal1 = true;
          } // 跳转 that.modal1=true;
        });
        return;
      }
      this.current_page++;
      this.btn_type1 = "";
      this.btn_type2 = "";
      this.btn_type3 = "";
      this.btn_type4 = "";
      if (this.current_answer[this.current_page] === "A") {
        this.btn_type1 = "info";
        this.btn_type2 = "";
        this.btn_type3 = "";
        this.btn_type4 = "";
      }
      if (this.current_answer[this.current_page] === "B") {
        this.btn_type1 = "";
        this.btn_type2 = "info";
        this.btn_type3 = "";
        this.btn_type4 = "";
      }
      if (this.current_answer[this.current_page] === "C") {
        this.btn_type1 = "";
        this.btn_type2 = "";
        this.btn_type3 = "info";
        this.btn_type4 = "";
      }
      if (this.current_answer[this.current_page] === "D") {
        this.btn_type1 = "";
        this.btn_type2 = "";
        this.btn_type3 = "";
        this.btn_type4 = "info";
      }
    }
  },
  created() {
    let that = this;
    let params = new URLSearchParams();
    params.append("studentid", sessionStorage.getItem("token"));
    params.append("textbookid", this.$route.params.bookid);
    axios.post("preschooltest.do", params).then(function(res) {
      //获取学前测试题目、选项
      that.pre_test_question = res.data;
      //如果是语言题，显示语音按钮,不是，显示文字题
      for (let i = 0; i < that.pre_test_question.length; i++) {
        if (that.pre_test_question[i].exercise.search("http") === -1) {
          that.pre_test_question[i].istext = true;
        } else that.pre_test_question[i].istext = false;
      }
      //保存答案
      that.page_total = that.pre_test_question.length;
      for (let i = 0; i < that.pre_test_question.length; i++) {
        that.right_answer.push(that.pre_test_question[i].answer);
      }
    });
  }
};
</script>
<style scoped>
.playing {
  background-color: rgb(255, 246, 230);
}
#u3_img {
  position: absolute;
  left: 500px;
  top: 12px;
}
#u258_text {
  margin-top: 20px;
  margin-left: 30px;
  font-size: 20px;
  font-family: "Microsoft YaHei";
  font-weight: bold;
}
#u4 {
  position: absolute;
  left: 555px;
  top: 22px;
  font-size: 25px;
  font-weight: bold;
  color: #ffcc00;
}
#question {
  margin-left: 30px;
  height: 30px;
  font-size: 20px;
  font-weight: bold;
}
#option {
  text-align: center;
  margin-top: 30px;
  margin-left: 30px;
  height: 205px;
  width: 400px;
}
.info {
  background-color: rgb(46, 180, 255);
}
#progress {
  width: 150px;
  position: absolute;
  top: 100px;
  left: 100px;
}
#success {
  margin-right: 150px;
  box-shadow: 0 0 10px rgb(74, 199, 103);
}
</style>
