<template>
  <div>
    <div id="top">
      <span id="u0">{{current_word.english}}</span>
      <div id="u1">
        <span style="font-size: 23px">/ {{current_word.phonetic_symbol}} /</span>
        <Button id="u2" :class="sound" icon="ios-mic" shape="circle" @click="speak">发音</Button>
      </div>
    </div>

    <div id="u3" v-if="current_state==='1'">
      <div>
        <Button id="u4" :class="renshise">1</Button>
        <Button id="u5" :class="renshise" @click="renshi" shape="circle">认识</Button>
      </div>
      <div id="u6">
        <Button id="u7" :class="burenshise">2</Button>
        <Button id="u8" :class="burenshise" @click="burenshi" shape="circle">不认识</Button>
      </div>
      <div id="u9">
        <Button id="u10" :class="killitse">3</Button>
        <Button id="u11" :class="killitse" @click="killit" shape="circle">滚瓜烂熟</Button>
      </div>
    </div>
    <div v-if="current_state==='2'">
      <span class="x3">例句：</span>
      <Card class="xx4" dis-hover :padding="5">
        <span id="xx5">1.{{current_word.englishInstance1}}</span>
        <span id="xx7">2.{{current_word.englishInstance2}}</span>
      </Card>
      <div style="margin-top: 30px">
        <Button :class="remse" style="height:40px">1</Button>
        <Button
          :class="remse"
          @click="remember"
          shape="circle"
          style="margin-left: 20px;width: 500px;height:40px"
        >想起来了</Button>
      </div>
      <div style="margin-top: 10px">
        <Button :class="didntremse" style="height:40px">2</Button>
        <Button
          :class="didntremse"
          @click="didntremember"
          shape="circle"
          style="margin-left: 20px;width: 500px;height:40px"
        >没想起来</Button>
      </div>
    </div>
    <div v-if="current_state==='3'">
      <span id="x1">单词解释：</span>
      <span id="x2">{{current_word.chinese}}</span>
      <span class="x3">例句：</span>
      <Card class="x4" dis-hover :padding="0">
        <span id="x5">1.{{current_word.englishInstance1}}</span>
        <span id="x6">{{current_word.chineseInstance1}}</span>
        <span id="x7">2.{{current_word.englishInstance2}}</span>
        <span id="x8">{{current_word.chineseInstance2}}</span>
      </Card>
      <div id="x9" style="margin-top: 50px;margin-left: 230px">
        <Button id="x10" @click="rethinkright" icon="md-male" v-if="beforeselect">回想正确</Button>
        <Button id="x11" @click="rethinkwrong" icon="md-female" v-if="beforeselect">回想错误</Button>
        <Button id="x12" @click="nextword" v-if="afterselect">下一个</Button>
      </div>
    </div>
    <Modal v-model="modal1" width="400" :closable="false" :footer-hide="true">
      <div style="text-align:center">
        <img src="..\assets\image\时间到了.png" />
        <div style="width:200px;margin-left:80px;">
          <Button
            type="success"
            style="box-shadow: 0 0 10px rgb(74,199,103);"
            long
            @click="tospell"
          >开始拼写</Button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "studycard",
  data() {
    return {
      current_state: "1",
      current_word: "",
      current_word_index: 0,
      rethinktimes: 0,
      words: [],
      words_total: 15,
      sound: "",
      audio: "",
      renshise: "",
      burenshise: "",
      killitse: "",
      remse: "",
      didntremse: "",
      beforeselect: true,
      afterselect: false,
      modal1: false
    };
  },
  methods: {
    //学习结束，跳转至拼写阶段
    tospell() {
      this.$router.push({ path: "/spellword", query: { name: this.words } });
    },
    //发音
    speak() {
      let that = this;
      this.audio = new Audio();
      this.audio.src = this.current_word.pronunciation;
      let playPromiser = this.audio.play();
      this.sound = "playing";
      this.audio.onended = () => {
        that.sound = "";
      };
    },
    //认识
    renshi() {
      this.renshise = "selected";
      let that = this;
      let time = setTimeout(() => {
        that.clear();
        that.beforeselect = true;
        that.afterselect = false;
        that.current_state = "3";
      }, 500);
    },
    //不认识
    burenshi() {
      this.burenshise = "selected";
      let that = this;
      let time = setTimeout(() => {
        that.clear();
        that.current_state = "2";
      }, 500);
    },
    //TODO 滚瓜烂熟的情况
    killit() {},
    //想起来了
    remember() {
      this.remse = "selected";
      let that = this;
      let time = setTimeout(() => {
        that.clear();
        that.beforeselect = true;
        that.afterselect = false;
        that.current_state = "3";
      }, 500);
    },
    //没想起来
    didntremember() {
      this.didntremse = "selected";
      let that = this;
      let time = setTimeout(() => {
        that.clear();
        that.current_state = "3";
        that.beforeselect = false;
        that.afterselect = false;
      }, 800);
      let time1 = setTimeout(() => {
        that.clear();
        that.current_state = "2";
      }, 2000);
    },
    //回想正确，增加熟悉度
    rethinkright() {
      this.beforeselect = false;
      this.afterselect = true;
      this.rethinktimes++;
      let that = this;
      let params = new URLSearchParams();
      params.append("studentid", sessionStorage.getItem("token"));
      params.append("wordid", this.current_word.id);
      axios.post("familiarityup.do", params);
      this.$emit("getMessage", {
        state: "回想次数",
        words: this.words_total - this.current_word_index,
        times: this.rethinktimes
      });
    },
    //回想错误，减少熟悉度
    rethinkwrong() {
      let that = this;
      let params = new URLSearchParams();
      params.append("studentid", sessionStorage.getItem("token"));
      params.append("wordid", this.current_word.id);
      axios.post("familiaritydown.do", params);
      let time = setTimeout(function() {
        that.nextword();
      }, 500);
    },
    clear() {
      this.renshise = "";
      this.burenshise = "";
      this.killitse = "";
      this.remse = "";
      this.didntremse = "";
    },
    //切换单词
    nextword() {
      if (this.current_word_index + 1 === this.words_total) {
        this.modal1 = true;
        return;
      }
      this.current_word_index++;
      this.current_word = this.words[this.current_word_index];
      this.clear();
      this.current_state = "1";
      this.$emit("getMessage", {
        state: "回想次数",
        words: this.words_total - this.current_word_index,
        times: this.rethinktimes
      });
    }
  },
  created() {
    let params = new URLSearchParams();
    let that = this;
    params.append("studentid", sessionStorage.getItem("token"));
    params.append("bookid", this.$route.params.bookid);
    //接受现在学习的单元数请求
    //params.append("unit",this.$route.params.unit);
    params.append("unit",this.$route.params.unit);

    axios.post("continuestudy.do", params).then(function(res) {
      that.words = res.data;
      that.words_total = res.data.length;
      that.current_word_index = 0;
      that.current_word = that.words[that.current_word_index];
    });
    this.$emit("getMessage", {
      state: "回想次数",
      words: this.words_total,
      times: this.rethinktimes
    });
  }
};
</script>

<style scoped>
#x1 {
  display: block;
  margin-top: 25px;
  font-size: 20px;
}
#x2 {
  display: block;
  font-size: 15px;
  margin-top: 15px;
}
.x3 {
  display: block;
  margin-top: 20px;
  font-size: 20px;
}
.x4 {
  width: 700px;
  height: 120px;
  margin-top: 15px;
  background-color: #f0f0f0;
}
.xx4 {
  width: 700px;
  height: 100px;
  margin-top: 15px;
  background-color: #f0f0f0;
}
#x5 {
  display: block;
  font-size: 15px;
}
#xx5 {
  display: block;
  font-size: 17px;
}
#x6 {
  display: block;
  font-size: 15px;
  margin-top: 3px;
}
#x7 {
  display: block;
  font-size: 15px;
  margin-top: 3px;
}
#xx7 {
  display: block;
  font-size: 17px;
  margin-top: 5px;
}
#x8 {
  display: block;
  font-size: 15px;
  margin-top: 3px;
}
#x9 {
  margin-top: 50px;
  margin-left: 230px;
}
#x10 {
  background-color: rgb(74, 199, 103);
  color: white;
  width: 160px;
  height: 40px;
  box-shadow: 0 0 5px rgb(74, 199, 103);
}
#x11 {
  background-color: rgb(255, 97, 97);
  margin-left: 135px;
  color: white;
  width: 160px;
  height: 40px;
  box-shadow: 0 0 5px rgb(255, 97, 97);
}
#x12 {
  background-color: rgb(74, 199, 103);
  color: white;
  width: 160px;
  height: 40px;
  box-shadow: 0 0 5px rgb(74, 199, 103);
  margin-left: 150px;
}
#u0 {
  font-size: 40px;
  display: block;
}
#u1 {
  margin-top: 10px;
}
#u2 {
  width: 100px;
  margin-left: 20px;
}
#u3 {
  margin-top: 50px;
}
#u4 {
  height: 40px;
}
#u5 {
  margin-left: 20px;
  width: 500px;
  height: 40px;
}
#u6 {
  margin-top: 10px;
}
#u7 {
  height: 40px;
}
#u8 {
  margin-left: 20px;
  width: 500px;
  height: 40px;
}
#u9 {
  margin-top: 10px;
}
#u10 {
  height: 40px;
}
#u11 {
  margin-left: 20px;
  width: 500px;
  height: 40px;
}
.playing {
  background-color: rgb(255, 246, 230);
}

.selected {
  background-color: rgb(46, 180, 255);
}
</style>
