<template>
  <div v-loading="loading">
    <div class="pane">
      <p id="canjia">
        我参加过的比赛
        <a @click="prepage1"><Icon type="ios-undo" size="20"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
        <a @click="nextpage1"><Icon type="ios-share-alt" size="20"/></a>
      </p>
      <div id="beforCompetition">
        <div style="margin-right:230px;" v-for="item in done_current_competition" :key="item.id">
          <competition-card
            :cptype="item.competition_type"
            :done="true"
            :id="item.id"
            :time="item.date"
            :scope="item.content"
            :rank="item.ranking"
            :name="item.name"
            :first_avatar="item.first_avatar"
            :second_avatar="item.second_avatar"
            :third_avatar="item.third_avatar"
          />
        </div>
      </div>
      <p id="dancibisai">
        单词比赛
        <a @click="prepage"><Icon type="ios-undo" size="20"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
        <a @click="nextpage"><Icon type="ios-share-alt" size="20"/></a>
      </p>
      <div id="doingCompetition">
        <div style="margin-right:230px;" v-for="item in doing_current_competition" :key="item.id">
          <competition-card
            :cptype="item.competition_type"
            :done="false"
            :id="item.id"
            :time="item.date"
            :scope="item.content"
            :rank="item.ranking"
            :name="item.name"
            :first_avatar="item.first_avatar"
            :second_avatar="item.second_avatar"
            :third_avatar="item.third_avatar"
          ></competition-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import competitionCard from "./competitionCard";
import axios from "axios";
export default {
  components: {
    competitionCard
  },
  data() {
    return {
      doing_current_page: 0,
      doing_group_total: 0,
      doing_current_competition: [],
      doing_competition_total: [],
      done_current_page: 0,
      done_group_total: 0,
      done_current_competition: [],
      done_competition_total: [],
      loading:false
    };
  },
  methods: {
    //可以参加的比赛的下一页
    nextpage() {
      if (this.doing_current_page + 1 >= this.doing_group_total) {
        return;
      }
      this.doing_current_page++;
      this.doing_current_competition = this.doing_competition_total.slice(
        this.doing_current_page * 3,
        this.doing_current_page * 3 + 3
      );
    },
    //可以参加的比赛的上一页
    prepage() {
      if (this.doing_current_page <= 0) {
        return;
      }
      this.doing_current_page--;
      this.doing_current_competition = this.doing_competition_total.slice(
        this.doing_current_page * 3,
        this.doing_current_page * 3 + 3
      );
    },
    //已经参加的比赛的下一页
    nextpage1() {
      if (this.done_current_page + 1 >= this.done_group_total) {
        return;
      }
      this.done_current_page++;
      this.done_current_competition = this.done_competition_total.slice(
        this.done_current_page * 3,
        this.done_current_page * 3 + 3
      );
    },
    //已经参加的比赛的下一页
    prepage1() {
      if (this.done_current_page <= 0) {
        return;
      }
      this.done_current_page--;
      this.done_current_competition = this.done_competition_total.slice(
        this.done_current_page * 3,
        this.done_current_page * 3 + 3
      );
    }
  },
  created() {
    this.loading=true;
    let that = this;
    let params = new URLSearchParams();
    params.append("studentid", sessionStorage.getItem("token"));
    axios.post("stulookcompetition.do", params).then(function(res) {
      that.done_competition_total = res.data[0];
      that.doing_competition_total = res.data[1];
      that.done_group_total = Math.ceil(that.done_competition_total.length / 3);
      that.doing_group_total = Math.ceil(
        that.doing_competition_total.length / 3
      );
      that.done_current_competition = that.done_competition_total.slice(0, 3);
      that.doing_current_competition = that.doing_competition_total.slice(0, 3);
      that.loading=false;
    });

  }
};
</script>
<style scoped>
.pane {
  padding: 10px;
}
#canjia{
  font-weight: bold;
  font-style: normal;
  font-size: 15px;
}
#dancibisai{
  font-weight: bold;
  font-style: normal;
  font-size: 15px;
  margin-top: 20px;
}
#beforCompetition {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 270px;
}
#doingCompetition {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 270px;
}
#nextanniu {
  width: 30px;
  height: 50px;
  background-color: green;
}
</style>
