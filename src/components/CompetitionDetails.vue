<template>
  <div id="details">
    <div id="detailsLeft">
      <div id="detailstext">
        <span id="bisainame">{{name}}</span>
        <br />
        <br />
        <Icon type="md-alarm" color="#FFD700" size="23" />&nbsp;
        <span style="font-weight:bold;">比赛时间:&nbsp;</span>
        <br />
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{time}}</span>
        <br />
        <br />
        <Icon type="md-locate" color="#66CDAA" size="23" />&nbsp;
        <span style="font-weight:bold;">参赛范围:&nbsp;</span>
        <br />
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{scope}}</span>
        <br />
        <br />
        <Icon type="md-apps" color="#4876FF" size="23" />&nbsp;
        <span style="font-weight:bold;">比赛内容:&nbsp;</span>
        <br />
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{content}}</span>
        <br />
        <br />
        <Icon type="ios-briefcase" color="#FF7256" size="23" />&nbsp;
        <span style="font-weight:bold;">奖励:&nbsp;</span>
        <br />
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;奖励前10名</span>&nbsp;
        <span>每人1000金币</span>
        <br />
        <br />
        <Icon type="md-information-circle" color="#6495ED" size="23" />&nbsp;
        <span style="font-weight:bold;">比赛规则:&nbsp;</span>
        <br />
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{rules}}</span>
        <br />
        <br />
        <br />
      </div>
      <div id="detailsbutton">
        <Button id="detail_button" @click="modal6 = true" :disabled="isshow">{{anniu}}</Button>
        <Modal v-model="modal6" title="开始匹配" :loading="loading" @on-ok="asyncOK">
          <p>点击确定开始匹配，3s后进入比赛</p>
        </Modal>
      </div>
    </div>
    <div id="detailsRight">
      <ranking-lists toppic="../static/排行榜.png" tokenpic="../static/秒表.png" :info="list1"></ranking-lists>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import RankingLists from "./RankingLists";
export default {
  data() {
    return {
      current_num: "",
      id: "",
      name: "",
      anniu: "开始挑战",
      content: "",
      cptype: "一站到底",
      done: "",
      isshow: false,
      time: "",
      scope: "",
      rules: "",
      modal6: false,
      loading: true,
      list1: [
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "1"
        },
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "2"
        },
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "3"
        },
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "4"
        },
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "5"
        },
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "6"
        },
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "7"
        },
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "8"
        },
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "9"
        },
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "10"
        },
        {
          name: "虚位以待",
          value: "---",
          avatar: "",
          rank: "----"
        }
      ]
    };
  },
  components: {
    RankingLists
  },
  methods: {
    asyncOK() {
      setTimeout(() => {
        if (this.cptype === "一站到底") {
          this.modal6 = false;
          this.$router.push({
            name: "ArenaCompetition",
            params: { id: this.id }
          });
        } else if (this.cptype === "擂台PK") {
          this.modal6 = false;
          this.$router.push({
            name: "PkCompetition",
            params: { id: this.id }
          });
        }
      }, 3000);
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.done = this.$route.params.done;
    this.cptype = this.$route.params.cptype;
    let that = this;
    let params = new URLSearchParams();
    params.append("id", that.id);
    axios.post("competitioninfo.do", params).then(function(res) {
      that.name = res.data.name;
      that.time = res.data.time;
      that.scope = res.data.entry_scope;
      that.rules = res.data.rules;
      that.content = res.data.content;
    });
    let pa2 = new URLSearchParams();
    pa2.append("studentID", sessionStorage.getItem("token"));
    pa2.append("competitionID", that.id);
    axios.post("competitionScoreRankList.do", pa2).then(function(res) {//请求排行榜信息，对于不满11位自动添加额外的空数组元素
      if (res.data.length === 11) {
        that.list1 = res.data;
      } else {
        if (that.done === true) {
          that.list1 = [];
          that.current_num = res.data.length - 1;
          let i = 0;
          for (; i < that.current_num; i++) {
            that.list1.push(res.data[i]);
          }
          let lastone = res.data[i];

          for (let i = that.list1.length; i < 10; i++) {
            that.list1.push({
              name: "虚位以待",
              value: "---",
              avatar: "",
              rank: i
            });
          }
          that.list1.push(lastone);
        } else {
          that.list1 = [];
          that.current_num = res.data.length;
          let i = 0;
          for (; i < that.current_num; i++) {
            that.list1.push(res.data[i]);
          }

          for (let i = that.list1.length; i < 10; i++) {
            that.list1.push({
              name: "虚位以待",
              value: "---",
              avatar: "",
              rank: i
            });
          }
          that.list1.push({ name: "我", value: "---", avatar: "", rank: 999 });
        }
      }
    });

    if (that.done === false) {
      that.anniu = "开始挑战";
      that.isshow = false;
    } else if (that.done === true) {
      that.anniu = "今日已挑战";
      that.isshow = true;
    }

  }
};
</script>

<style scoped>
#details {
  display: flex;
  height: 600px;
  width: 100%;
}
#detailsLeft {
  height: 600px;
  width: 267px;
  margin: 30px 40px;
}
#detailsRight {
  height: 600px;
  width: 400px;
}
#detailstext {
  height: 280px;
  font-style: normal;
  font-size: 14px;
}
#bisainame{
  font-weight: bold;
  font-style: normal;
  font-size: 24px;
}
#detailsbutton {
  height: 100px;
  width: 100px;
  margin: 150px auto;
}
#detail_button {
  display: inline-block;
  height: 30px;
  width: 100px;
  margin: 0 0 40px 0;
  border-radius: 5px;
  text-align: center;
  background-color: rgb(66, 158, 243);
  color: aliceblue;
}
</style>
