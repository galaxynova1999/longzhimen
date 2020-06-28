<template>
  <div v-loading="loading">
    <div id="background">
      <div id="u0">
        <Icon type="md-book" size="30" />
        <div id="u0_text">
          <p>单词书</p>
        </div>
        <div id="current_textbook">
          <span>现在课程：</span>
          <span style="color: red">{{current_bookname}}</span>
        </div>
        <Divider></Divider>
      </div>
      <div id="textbook">
        <div
          id="textbook_name"
          style="text-align:center;"
          v-for="item in textbook_current"
          :key="item.bookid"
        >
          <textbookimage :text="item.bookname" :status="item.status" :bookid="item.bookid"></textbookimage>
        </div>
      </div>
    </div>
    <div id="u1" style="text-align:center;" class="footer">
      <Button id="pre" @click="prepage" v-if="current_page!==1">
        <Icon type="ios-arrow-back"></Icon>上一页
      </Button>
      <Button id="next" @click="nextpage" v-if="current_page!==page_total">
        下一页
        <Icon type="ios-arrow-forward"></Icon>
      </Button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import textbookimage from "./textbookimage";
export default {
  components: {
    textbookimage
  },
  data() {
    return {
      current_page: 1,
      page_total: 0,
      current_bookname: "",
      textbook_current: [],
      textbook_total: [],
      loading:false
    };
  },
  methods: {
    //上一页方法
    prepage() {
      if (this.current_page - 1 <= 0) return;
      else {
        this.current_page--;
        this.textbook_current = this.textbook_total.slice(
          (this.current_page - 1) * 4,
          (this.current_page - 1) * 4 + 4
        );
      }
    },
    //下一页方法
    nextpage() {
      if (this.current_page >= this.page_total) {
        return;
      } else {
        this.current_page++;
        this.textbook_current = this.textbook_total.slice(
          (this.current_page - 1) * 4,
          (this.current_page - 1) * 4 + 4
        );
      }
    }
  },
  created() {
    this.loading=true;
    let that = this;
    //传参数获取单词书的信息再分页切割
    let params = new URLSearchParams();
    params.append("studentid", sessionStorage.getItem("token"));
    axios.post("stulooktextbook.do", params).then(function(res) {
      that.current_bookname = res.data.currentbookname;
      that.textbook_current = res.data.info.slice(0, 4);
      that.textbook_total = res.data.info;
      that.page_total = Math.ceil(res.data.info.length / 4);
      that.loading=false;
    });
  }
};
</script>
<style scoped>
#background {
  height: 500px;
  width: 640px;
  margin: 30px;
}
#u0 {
  margin-top: 30px;
  margin-left: 20px;
}
#u0_text {
  position: absolute;
  top: 30px;
  left: 80px;
  font-size: 20px;
  font-weight: bold;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
#current_textbook {
  float: right;
  font-weight: bold;
  font-size: 18px;
}
#textbook {
  margin-top: 35px;
  height: 400px;
  display: flex;
  margin-left: 65px;
  flex-wrap: wrap;
}
#textbook_name {
  margin-left: 60px;
  margin-top: 30px;
}
#pre {
  background-color: rgb(74, 199, 103);
  color: white;
  width: 110px;
  border: none;
  box-shadow: 0 0 5px rgb(74, 199, 103);
}
#next {
  background-color: rgb(255, 97, 97);
  margin-left: 135px;
  color: white;
  width: 110px;
  height: 35px;
  box-shadow: 0 0 5px rgb(255, 97, 97);
}
</style>
