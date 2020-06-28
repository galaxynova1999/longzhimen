<template>
  <div>
    <span style="font-size: 26px;margin-left: 40px">{{current_word}}</span>
    <div style="margin-top: 10px;margin-left: 40px">
      <Button icon="ios-mic" shape="circle" style="width: 100px" :class="sound" @click="speak">发音</Button>
    </div>
    <div class="wordshow" :class="change">
      {{input}}
      <Icon v-if="right" type="md-checkmark" style="top: 13px;right: 25px;position: absolute" />
      <Icon v-if="wrong" type="md-close" style="top: 13px;right: 25px;position: absolute" />
    </div>
    <div id="spell">
      <div id="first-line">
        <Button @click.native="input+='q';check('q')" id="q">Q</Button>
        <Button @click="input+='w';check('w')" id="w">W</Button>
        <Button @click="input+='e';check('e')" id="e">E</Button>
        <Button @click="input+='r';check('r')" id="r">R</Button>
        <Button @click="input+='t';check('t')" id="t">T</Button>
        <Button @click="input+='y';check('y')" id="y">Y</Button>
        <Button @click="input+='u';check('u')" id="u">U</Button>
        <Button @click="input+='i';check('i')" id="i">I</Button>
        <Button @click="input+='o';check('o')" id="o">O</Button>
        <Button @click="input+='p';check('p')" id="p">P</Button>
      </div>
      <div id="second-line">
        <Button @click="input+='a';check('a')" id="a">A</Button>
        <Button @click="input+='s';check('s')" id="s">S</Button>
        <Button @click="input+='d';check('d')" id="d">D</Button>
        <Button @click="input+='f';check('f')" id="f">F</Button>
        <Button @click="input+='g';check('g')" id="g">G</Button>
        <Button @click="input+='h';check('h')" id="h">H</Button>
        <Button @click="input+='j';check('j')" id="j">J</Button>
        <Button @click="input+='k';check('k')" id="k">K</Button>
        <Button @click="input+='l';check('l')" id="l">L</Button>
      </div>
      <div id="third-line">
        <Button @click="input+='z';check('z')" id="z">Z</Button>
        <Button @click="input+='x';check('x')" id="x">X</Button>
        <Button @click="input+='c';check('c')" id="c">C</Button>
        <Button @click="input+='v';check('v')" id="v">V</Button>
        <Button @click="input+='b';check('b')" id="b">B</Button>
        <Button @click="input+='n';check('n')" id="n">N</Button>
        <Button @click="input+='m';check('m')" id="m">M</Button>
        <Button
          style="background-color: #ffcccc;color: red"
          @click="backspace"
          icon="md-arrow-back"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "spellword",
  data() {
    return {
      current_word: "",
      current_word_index: 0,
      words_total: 0,
      words: [],
      input: "",
      current_answer: "",
      change: "",
      right: false,
      wrong: false,
      sound: "",
      input_array:[],
    };
  },
  methods: {
    //后退后退
    backspace() {
      if (this.input === "") return;
      document.getElementById(this.input.slice(-1)).style.backgroundColor = "";
      this.input = this.input.slice(0, this.input.length - 1);
      this.change = "";
      this.right = false;
      this.wrong = false;
    },
    //答案检查
    check(alpha) {
      let that = this;
      document.getElementById(alpha).style.backgroundColor = "#66ccff";
      this.input_array.push(alpha);
      let char = eval(this.input.slice(this.input.length - 1, 1));
      this.char = "primary";
      if (this.input === this.current_answer) {
        this.change = "right";
        this.right = true;
        let params = new URLSearchParams();
        params.append("studentid", sessionStorage.getItem("token"));
        params.append("wordid", this.words[this.current_word_index].id);
        //拼写正确熟悉度加一
        axios.post("familiarityup.do", params);
        setTimeout(function() {
          that.nextword();
          that.$emit("getMessage", {
            state: "拼写次数",
            words: that.words_total - that.current_word_index,
            times: that.current_word_index
          });
        }, 500);
      } else if (this.input.length === this.current_answer.length) {
        if (this.input !== this.current_answer) {
          this.change = "wrong";
          this.wrong = true;
          let params = new URLSearchParams();
          params.append("studentid", sessionStorage.getItem("token"));
          params.append("wordid", this.words[this.current_word_index].id);
          //拼写错误熟悉度减一
          axios.post("familiaritydown.do", params);
          let time = setTimeout(function() {
            that.nextword();
            that.$emit("getMessage", {
              state: "拼写次数",
              words: that.words_total - that.current_word_index,
              times: that.current_word_index
            });
          }, 500);
        }
      }
    },
    //发音
    speak() {
      let that = this;
      this.audio = new Audio();
      this.audio.src = this.words[this.current_word_index].pronunciation;
      let playPromiser = this.audio.play();
      this.sound = "playing";
      this.audio.onended = () => {
        that.sound = "";
      };
    },
    //切换下一个单词
    nextword() {
      if (this.current_word_index + 1 === this.words_total) {
        this.$Message.success("本单元学习完毕!");
        this.$router.push("/studentmain");
        return;
      }
      this.current_word_index++;
      this.current_word = this.words[this.current_word_index].chinese;
      this.current_answer = this.words[this.current_word_index].english;
      this.input = "";
      this.change = "";
      this.right = false;
      this.wrong = false;
      let array = document.getElementsByTagName("Button");
      for (let i = 0; i < array.length; i++) {
        array[i].style = "background-color:#f8f8f8";
      }
    }
  },

  created() {
    //接收学习卡片发来的单词
    this.words = this.$route.query.name;
    this.current_word_index = 0;
    this.current_word = this.words[this.current_word_index].chinese;
    this.current_answer = this.words[this.current_word_index].english;
    this.words_total = this.words.length;
    this.$emit("getMessage", {
      state: "拼写次数",
      words: this.words_total - this.current_word_index,
      times: this.current_word_index
    });
  }
};
</script>

<style scoped>
.wordshow {
  width: 500px;
  height: 70px;
  border-style: solid;
  border-width: 2px;
  border-color: #d8d8d8;
  margin-top: 35px;
  margin-left: 70px;
  font-size: 35px;
  text-align: center;
  position: relative;
  box-shadow: 8px 8px 8px #f8f8f8;
}
#first-line {
  margin-top: 60px;
}
#second-line {
  margin-top: 20px;
  margin-left: 16px;
}
#third-line {
  margin-top: 20px;
  margin-left: 32px;
}
#spell button {
  margin-left: 10px;
  background-color: #f8f8f8;
  width: 50px;
  height: 45px;
  font-size: 20px;
  box-shadow: 3px 3px 3px #f8f8f8;
}
.wordshow.wrong {
  border-color: red;
  color: red;
}
.wordshow.right {
  border-color: green;
  color: green;
}
.playing {
  background-color: #ffcc66;
}
</style>
