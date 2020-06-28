<template>
  <div  v-loading="loading">
    <div id="u2">
      <div id="button1">
        <Button id="textbook" to="Textbook">切换单词书</Button>
      </div>
    </div>
    <Divider></Divider>
    <div id="u3">
      <div style="margin-left:10px">
        <Icon type="md-people" size="30" />
      </div>
      <div id="class" style="margin-left:10px">
        <p>{{myclassname}}</p>
      </div>
      <div id="u3_button">
        <Button
          @click="ready"
          type="primary"
          shape="circle"
          style="box-shadow: 0 0 10px #D8D8D8;"
          v-if="pre_status"
        >学前检测</Button>
      </div>
      <div id="u3_img">
        <img src="../assets/image/VS.png" />
      </div>
      <div id="score_1">{{score1}}</div>
      <div id="score_2">{{score2}}</div>
      <div id="u3_text1">
        <span>学前检测</span>
      </div>
      <div id="u3_text2">
        <span>学后检测</span>
      </div>
    </div>
    <div id="book_icon" style="margin-left:10px">
      <Icon type="ios-book" size="30" />
    </div>
    <div id="book" style="margin-left:10px">
      <p>{{mytextbook}}</p>
    </div>
    <div id="u4">
      <div id="u4_jinduhuan">
        <i-circle :percent="percent" stroke-color="lightgreen">
          <span class="demo-Circle-inner" style="font-size:24px">{{percentage}}</span>
        </i-circle>
      </div>
      <div id="u4_button1">
        <Button
          type="success"
          shape="circle"
          style="width:150px;box-shadow: 0 0 10px rgb(74,199,103);"
          @click="continuestudy"
        >继续学习</Button>
      </div>
      <div id="u4_button2">
        <router-link :to="{name:'Consolidate',params:{bookid:bookid}}">
          <Button
            type="warning"
            shape="circle"
            style="width:150px;box-shadow: 0 0 10px rgb(255,177,40);"
          >巩固学习</Button>
        </router-link>
      </div>
    </div>
    <div id="unit">
      <div v-for="item in danyuan" style="margin-left:20px;margin-bottom:10px;" :key="item.unit">
        <loop :unit="item.unit" :status="item.status" :bookid="bookid"></loop>
      </div>
    </div>
    <Modal v-model="modal2" :closable="false" :footer-hide="true" :mask-closable="false">
      <div style="text-align:center;">
        <img id="u209_img" src="../assets/image/u209.png" width="300" />
        <p>
          <span style="text-decoration: none;font-weight:bold;color:gray;">3分钟测出你的词汇掌握水平</span>
          <br />
          <span style="text-decoration: none;color:gray;">根据检测结果定制针对性学习方案</span>
        </p>
        <br />
        <p>
          <span style>你需要在3分钟内完成以下题目，请保持专注</span>
        </p>
        <br />
        <Button type="primary" :to="{name:'Pre_test',params:{bookid:bookid}}" id="start">立即开始</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "axios";
import loop from "./loop";
export default {
  components: {
    loop
  },
  data() {
    return {
      current_unit: "",
      score1: "",
      score2: "",
      modal2: false,
      danyuan: [],
      bookid: "",
      myclassname: "",
      mytextbook: "",
      percent: 0,
      percentage: "",
      pre_status: false,
      loading:false
    };
  },
  methods: {
    //点击继续学习
    ready() {
      this.modal2 = true;
    },
    continuestudy() {
      //   带参数正在学习的单元数跳
      this.$router.push({
        name: "studycard",
        params: { unit: this.current_unit,bookid:this.bookid}
      });
    }
  },
  mounted() {
    this.loading=true;
    let that = this;
    //传参数获取正在学习的课本名、现在的进度、单元
    let params = new URLSearchParams();
    params.append("studentid", sessionStorage.getItem("token"));
    axios.post("currentstudy.do", params).then(function(res) {
      let data = res.data;
      that.bookid = res.data.bookid;
      that.myclassname = data.classname;
      that.mytextbook = data.bookname;
      that.percent = Number(data.percent.slice(0, data.percent.length - 1));
      that.percentage = data.percent;
      if (data.isParticipatePriorTest === 1) {
        that.pre_status = false;
        that.score1 = data.priortest_score;
      } else {
        that.pre_status = true;
        that.score1 = "?";
      }
      if (data.consolidation_score === 0) {
        that.score2 = "?";
      } else {
        that.score2 = data.consolidation_score;
      }

      let array = [];
      for (let i = 0; i < res.data.unit.length; i++) {
        array.push({ unit: i + 1, status: res.data.unit[i] });
        if (res.data.unit[i] === "ongoing") {
          that.current_unit = i + 1;
        }
      }

      that.danyuan = array;
      that.loading=false;
    });
  }
};
</script>
<style scoped>
#u2 {
  width: 690px;
  height: 40px;
}
#u3_img {
  position: absolute;
  top: 100px;
  left: 320px;
}
#score_1 {
  position: absolute;
  top: 110px;
  left: 225px;
  font-size: 30px;
  color: rgb(255, 177, 40);
}
#score_2 {
  position: absolute;
  top: 110px;
  left: 440px;
  font-size: 30px;
}
#button1 {
  position: absolute;
  height: 30px;
  top: 15px;
  left: 500px;
}
#u3_text1 {
  position: absolute;
  top: 150px;
  left: 220px;
  font-size: 15px;
  color: rgb(255, 177, 40);
}
#u3_text2 {
  position: absolute;
  top: 150px;
  left: 425px;
  font-size: 15px;
}
#u3_button {
  position: absolute;
  left: 550px;
}
#u4 {
  position: absolute;
  top: 230px;
  left: 300px;
}
#u4_button1 {
  position: absolute;
  top: 130px;
  left: -110px;
}
#u4_button2 {
  position: absolute;
  top: 130px;
  left: 90px;
}
#u5 {
  height: 150px;
  width: 711px;
  position: absolute;
  top: 450px;
  display: flex;
  flex-wrap: wrap;
}
#class {
  position: absolute;
  top: 90px;
  left: 30px;
  font-size: 18px;
}
#book {
  position: absolute;
  top: 220px;
  left: 30px;
  font-size: 18px;
}
#book_icon {
  position: absolute;
  top: 220px;
  left: 0;
}
#unit {
  height: 150px;
  width: 711px;
  margin-top: 320px;
  display: flex;
  flex-wrap: wrap;
}
#textbook {
  background-color: rgb(249, 249, 249);
  color: black;
  width: 200px;
  border: none;
}
</style>
