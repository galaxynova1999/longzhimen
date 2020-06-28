<template>
  <div id="u0">
    <div id="u1">
      <div id="u1_countdown">
        <count-down
          style="display:inline;"
          v-on:end_callback="countDownE_cb(1)"
          :startTime="new Date().getTime()"
          :endTime="new Date().getTime()+1500000"
          :secondsTxt="''"
        ></count-down>
      </div>
      <div id="newword">
        <p>当前生词数:{{current_words}}</p>
      </div>
      <div id="memory_times">
        <p>{{current_state}}:{{current_times}}</p>
      </div>
    </div>
    <div id="middle" style="position: absolute;left: 500px;top: 120px">
      <router-view @getMessage="showMsg"></router-view>
    </div>
    <Button id="exit" type="text" @click="exit">退出</Button>
  </div>
</template>
<script>
import CountDown from "vue2-countdown";
import studycard from "./studycard";
export default {
  data() {
    return {
      current_words: "",
      current_state: "",
      current_times: ""
    };
  },
  components: {
    CountDown,
    studycard
  },
  methods: {
    exit(){
      this.$router.push("/studentmain")
    },
    countDownE_cb: function(x) {
      this.$router.push({
        path: "/Relax"
      });
    },
    showMsg(val) {
      this.current_state = val.state;
      this.current_words = val.words;
      this.current_times = val.times;
    }
  }
};
</script>
<style scoped>
  #exit{
    position: absolute;
    top: 650px;
    left: 1000px;
    background-color: rgb(74, 199, 103);
    color: white;
    width: 160px;
    height: 40px;
    box-shadow: 0 0 5px rgb(74, 199, 103);
  }
#u0 {
  position: relative;
  height: 760px;
  width: 1600px;
  background-image: url("../assets/image/学习卡片.png");
  background-size: 1600px 761px;
  background-repeat: no-repeat;
}
#newword {
  position: absolute;
  height: 100px;
  width: 100px;
  margin-left: 370px;
  font-weight: bold;
  font-size: 15px;
  top: 48px;
}
#memory_times {
  position: absolute;
  height: 20px;
  width: 100px;
  margin-left: 480px;
  font-weight: bold;
  font-size: 15px;
  top: 48px;
}
#u1_countdown {
  text-align: center;
  position: absolute;
  height: 30px;
  width: 90px;
  margin-left: 1130px;
  top: 40px;
  font-size: 20px;
  color: white;
}
#middle {
  position: absolute;
  left: 500px;
  top: 120px;
}
</style>
