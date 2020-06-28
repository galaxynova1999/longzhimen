<template>
  <div v-loading="loading">
    <div slot="right" class="pane">
      <div id="shunxv">
        <span style="font-weight:bold;">复习顺序：</span>
        <ButtonGroup shape="circle">
          <Button :class="type1" @click="changetoshunxi">熟悉程度</Button>
          <Button :class="type2" @click="changetozhimushunxu">字母顺序</Button>
        </ButtonGroup>
        <div id="liebiao">
          <Icon type="ios-radio-button-on" style="color:#FF9256" />
          <span>生词</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <Icon type="ios-radio-button-on" style="color:lightskyblue" />
          <span>熟悉</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <Icon type="ios-radio-button-on" style="color:lightgreen" />
          <span>熟练</span>
        </div>
      </div>
      <div id="danci">
        <div
          class="ci"
          v-for="(item,i) in group_current"
          v-bind:class="{'shengci':item.familiarity==='0','shuxi':item.familiarity==='1','shulian':item.familiarity==='2'}"
          :key="i"
        >
          <p>{{item.english}}</p>
          <p>[{{item.phonetic_symbol}}]</p>
        </div>
      </div>
      <div id="kongbai">
        <Button id="btn1" @click="previousgroup" v-if="current_page!=0 && loading===false">上一组</Button>
        <Button id="btn2" @click="nextgroup" v-if="current_page!=group_total-1 && loading===false">下一组</Button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      group_total: 0,
      group_current: [],
      current_page: 0,
      data_shuxidu_total: [],
      data_zhimushunxu_total: [],
      isshengci: null,
      isshuxi: null,
      isshulian: null,
      type1: "primary",
      type2: "",
      loading:true
    };
  },
  methods: {
    //下一页
    nextgroup() {
      if (this.current_page + 1 >= this.group_total) {
        return;
      }
      this.current_page++;
      //根据当前按钮切割不同的数组
      if (this.type1 === "primary") {
        this.group_current = this.data_shuxidu_total.slice(
          this.current_page * 9,
          this.current_page * 9 + 9
        );
      } else {
        this.group_current = this.data_zhimushunxu_total.slice(
          this.current_page * 9,
          this.current_page * 9 + 9
        );
      }
    },
    //上一页
    previousgroup() {
      if (this.current_page <= 0) return;
      this.current_page--;
      //根据当前按钮切割不同的数组
      if (this.type1 === "primary") {
        this.group_current = this.data_shuxidu_total.slice(
          this.current_page * 9,
          this.current_page * 9 + 9
        );
      } else {
        this.group_current = this.data_zhimushunxu_total.slice(
          this.current_page * 9,
          this.current_page * 9 + 9
        );
      }
    },
    //切换到按熟悉度顺序
    changetoshunxi() {
      this.type1 = "primary";
      this.type2 = "";
      this.current_page = 0;
      this.group_current = this.data_shuxidu_total.slice(0, 9);
    },
    //切换到字母顺序
    changetozhimushunxu() {
      this.type2 = "primary";
      this.type1 = "";
      this.current_page = 0;
      this.group_current = this.data_zhimushunxu_total.slice(0, 9);
    }
  },
  mounted() {
    this.loading=true;
    let that = this;
    let params = new URLSearchParams();
    params.append("studentid", sessionStorage.getItem("token"));
    axios.post("stulookword.do", params).then(function(res) {
      that.data_shuxidu_total = res.data[0];
      that.data_zhimushunxu_total = res.data[1];
      that.group_total = Math.ceil(that.data_shuxidu_total.length / 9);
      that.group_current = that.data_shuxidu_total.slice(0, 9);
      that.loading=false;
    });

  }
};
</script>
<style scoped>
#btn1 {
  background-color: rgb(255, 97, 97);
  color: white;
  box-shadow: 0 0 5px rgb(255, 97, 97);
  width: 130px;
  height: 40px;
}
#btn2 {
  position: absolute;
  background-color: rgb(74, 199, 103);
  color: white;
  box-shadow: 0 0 5px rgb(74, 199, 103);
  width: 130px;
  height: 40px;
  left: 185px;
}
.pane {
  padding: 25px;
}
#right {
  overflow-x: hidden;
}
#shunxv {
  margin: auto;
  width: 711px;
  height: 70px;
  overflow: hidden;
}
#liebiao {
  display: inline;
  margin-left: 200px;
}
#kongbai {
  margin-left: 320px;
  position: absolute;
  top: 530px;
}
#danci {
  display: flex;
  height: 390px;
  width: 711px;
  margin-top: 10px;
  position: absolute;
  left: 10px;
  flex-wrap: wrap;
}
.ci.shengci {
  box-shadow: 0 3px 0 0.5px #ff9256;
  border: solid 1px #ff9256;
}
.ci.shuxi {
  box-shadow: 0 3px 0 0.5px lightskyblue;
  border: solid 1px lightskyblue;
}
.ci.shulian {
  box-shadow: 0 3px 0 0.5px lightgreen;
  border: solid 1px lightgreen;
}
.ci {
  display: inline-block;
  border-radius: 5px;
  width: 190px;
  height: 90px;
  margin: 5px 20px;
  font-size: 16px;
  text-align: center;
  padding-top: 15px;
  font-family: PingFangSC-Regular;
}
.primary {
  background-color: rgb(0, 162, 232);
  color: white;
}
</style>
