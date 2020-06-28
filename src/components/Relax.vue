<template>
  <div id="u0">
    <div id="u1" class="image1">
      <img id="u1_img" class="img" src="../assets/image/u596.png" />
    </div>
    <div id="u2" class="text">
      <p>
        <span>嗨一下，帮你保持专注</span>
      </p>
    </div>
    <div id="u3" class="image2">
      <img id="u1_img" class="img" src="../assets/image/u595.svg" />
    </div>
    <div id="u4" class="countdown">
      <count-down
        v-on:start_callback="countDownS_cb(1)"
        v-on:end_callback="countDownE_cb(1)"
        :currentTime="1"
        :startTime="1"
        :endTime="30001"
        :tipTex="''"
        :tipTextEnd="''"
        :endText="''"
        :dayTxt="''"
        :minutesTxt="''"
        :secondsTxt="''"
      ></count-down>
    </div>
    <div id="u5">
      <h2>5分钟休息时间结束，即将进入下一番茄时间</h2>
      <br />
      <h2>你准备好了吗</h2>
      <br />
      <Button type="primary" to="/Study_card1">开始专注</Button>
    </div>
  </div>
</template>
<script>
import CountDown from "vue2-countdown";
export default {
  components: {
    CountDown
  },
  methods: {
    countDownS_cb: function(x) {
      console.log(x);
    },
    countDownE_cb: function(x) {
      this.$router.push({
        path: "/Relax"
      });
      document.getElementById("u5").style.display = "inline";
    }
  }
};
</script>
<style scoped>
#u0 {
  text-align: center;
}
#u1 {
  position: absolute;
  top: 250px;
  left: 520px;
}
#u2 {
  position: absolute;
  top: 300px;
  left: 690px;
  font-family: "Arial Normal", "Arial";
  font-weight: bold;
  font-style: normal;
  font-size: 20px;
  letter-spacing: normal;
  color: #333333;
  vertical-align: none;
  text-align: center;
  line-height: normal;
  text-transform: none;
}
#u3 {
  position: absolute;
  top: 360px;
  left: 710px;
}
#u4 {
  position: absolute;
  top: 370px;
  left: 750px;
}
#u5 {
  text-align: center;
  position: absolute;
  left: 530px;
  top: 500px;
  display: none;
}
</style>