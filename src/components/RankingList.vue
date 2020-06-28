<template>
  <div>
    <div id="head"></div>
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
          <router-link to="/studentmain">
            <span>
              <Icon type="md-settings" />设置
            </span>
          </router-link>
        </p>
      </div>
      <div id="u1_3">
        <p>
          <a
            href="https://www.yuque.com/books/share/156a5f6a-84e3-46e1-9b17-b4f5efb13474?#"
            target="_blank"
          >
            <Icon type="md-help-circle" />帮助
          </a>
        </p>
      </div>
      <div id="u1_4">
        <p>
          <span>
            <Icon type="md-exit" />退出
          </span>
        </p>
      </div>
    </div>
    <div id="background_img">
      <div style="margin-left:150px;">
        <ranking-lists
          toppic="../static/排行榜时钟.png"
          tokenpic="../static/秒表.png"
          :info="list3"
          v-if="list3.length!=0"
        />
      </div>
      <div style="margin-left: 600px;">
        <ranking-lists
          toppic="../static/排行榜日历.png"
          tokenpic="../static/奖牌.png"
          :info="list1"
          v-if="list1.length!=0"
        />
      </div>
      <div style="margin-left: 1050px;">
        <ranking-lists
          toppic="../static/排行榜礼物.png"
          tokenpic="../static/奖杯.png"
          :info="list2"
          v-if="list2.length!=0"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RankingLists from "./RankingLists";
import axios from "axios";
export default {
  data() {
    return {
      list1: [],
      list2: [],
      list3: []
    };
  },
  components: {
    RankingLists
  },
  beforeCreate() {
    //请求排行榜数据
    let that = this;
    let params = new URLSearchParams();
    params.append("studentID", sessionStorage.getItem("token"));
    axios.post("showRanking.do", params).then(function(res) {
      that.list1 = res.data.signinDaysRankList;
      that.list2 = res.data.coinRankList;
      that.list3 = res.data.dayPeriodRankList;
    });
  }
};
</script>

<style scoped>
#head {
  background-image: url("../assets/image/头.png");
  background-size: 1600px 55px;
  background-repeat: no-repeat;
  height: 55px;
}
#background_img {
  position: relative;
  background-image: url("../assets/image/背景图.jpg");
  background-size: 1600px 898px;
  background-repeat: no-repeat;
  height: 900px;
  z-index: -10;
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
</style>
