<template>
  <div>
    <div id="u0">
      <div id="u257" class="二级标题">
        <div id="u257_div"></div>
        <div id="u258_text" class="text">
          <p>
            <Icon type="md-create" />
            <span style="text-decoration:none;">巩固测试</span>
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
            :secondsTxt="''"
          ></count-down>
        </div>
        <Divider></Divider>
      </div>
    </div>
    <div id="question" v-if="con_test_question.length!=0">
      <p>{{current_page+1}}.{{con_test_question[current_page].exercise}}</p>
    </div>
    <div id="option" v-if="con_test_question.length!=0">
      <Button
        :class="btn_type1"
        long
        shape="circle"
        size="large"
        @click="OP_A"
      >{{con_test_question[current_page].option_a}}</Button>
      <Button
        :class="btn_type2"
        style="margin-top:15px;"
        long
        shape="circle"
        size="large"
        @click="OP_B"
      >{{con_test_question[current_page].option_b}}</Button>
      <Button
        :class="btn_type3"
        style="margin-top:15px;"
        long
        shape="circle"
        size="large"
        @click="OP_C"
      >{{con_test_question[current_page].option_c}}</Button>
      <Button
        :class="btn_type4"
        style="margin-top:15px;"
        long
        shape="circle"
        size="large"
        @click="OP_D"
      >{{con_test_question[current_page].option_d}}</Button>
    </div>
    <div style="text-align:center;margin-top:150px;">
      <Button
        type="success"
        @click="prepage"
        style="margin-right:150px;box-shadow: 0 0 10px rgb(74,199,103);"
        v-if="isfirst"
      >
        <Icon type="ios-arrow-back"></Icon>上一题
      </Button>
      <Button type="success" @click="nextpage" style="box-shadow: 0 0 10px rgb(74,199,103);">
        下一题
        <Icon type="ios-arrow-forward"></Icon>
      </Button>
    </div>
  </div>
</template>
<script>
import CountDown from "vue2-countdown";
import axios from "axios";
export default {
  data() {
    return {
      isfirst: false,
      btn_type1: "",
      btn_type2: "",
      btn_type3: "",
      btn_type4: "",
      //问题数组
      current_answer: [],
      right_answer: [],
      current_page: 0,
      page_total: 2,
      con_test_question: []
    };
  },
  components: {
    CountDown
  },
  methods: {
    //选项高亮方法
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
      if (this.current_page + 1 === this.page_total) {
        //判题
        if (this.current_answer.length != this.right_answer.length) {
          this.$Message.warning("您还有未完成的题目");
          return;
        }
        let score = 0;
        for (let i = 0; i < this.current_answer.length; i++) {
          if (this.current_answer[i] === this.right_answer[i]) {
            //巩固测试一题28分
            score += 28;
          }
        }
        //TODO 答题完成跳转
        let that = this;
        this.$Message.success("您巩固测试获得了" + score + "分");
        let params = new URLSearchParams();
        params.append("scorestr", score);
        params.append("textbookID", this.$route.params.bookid);
        console.log(this.$route.params.bookid);
        params.append("studentID", sessionStorage.getItem("token"));
        axios.post("addConsolidatetestScore.do", params).then(function(res) {
          if (res.data === "0") {
            that.$Message.error("网络出现某些错误，请重试");
            return;
          } else {
            that.$router.push({ path: "/studentmain" });
          }
        });
        return;
      }
      this.current_page++;
      this.btn_type1 = "";
      this.btn_type2 = "";
      this.btn_type3 = "";
      this.btn_type4 = "";
      //选中选项高亮方法
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
    axios.post("consolidation.do", params).then(function(res) {
      that.con_test_question = res.data;
      //保存答案
      that.page_total = that.con_test_question.length;
      for (let i = 0; i < that.con_test_question.length; i++) {
        that.right_answer.push(that.con_test_question[i].answer);
      }
    });
  }
};
</script>
<style scoped>
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
</style>
