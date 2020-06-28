<template>
  <div id="main">
    <img src="../assets/image/textbook.png" height="140px" id="image" />
    <span id="bookname">{{text}}</span>
    <Button
      id="btn"
      :class="convert2(status)"
      :disabled="convert1(status)"
      @click="modal = true"
    >{{convert3(status)}}</Button>
    <Modal
      v-model="modal"
      draggable
      scrollable
      title="单词书切换"
      @on-ok="sure"
      @on-cancel="modal = false"
      :loading="loading"
    >
      <span>你确定要切换到该书吗?</span>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "textbookimage",
  data() {
    return {
      modal: false,
      loading: false
    };
  },
  props: {
    text: String,
    status: String,
    bookid: String
  },

  methods: {
    //确定切换
    sure() {
      this.loading = true;
      this.checkout();
    },
    //数据转换
    convert1: function(status) {
      if (status === "0") {
        return true;
      } else return false;
    },
    convert2(status) {
      if (status === "0") {
        return "notok";
      } else return "ok";
    },
    convert3(status) {
      if (status === "0") {
        return "待开通";
      } else return "切换";
    },
    //切换
    checkout() {
      let that = this;
      let params = new URLSearchParams();
      params.append("studentid", sessionStorage.getItem("token"));
      params.append("textbookid", this.bookid);
      axios.post("checkoutbook.do", params).then(function(res) {
        if (res.data === 1) {
          that.$Notice.success({
            title: "切换成功!"
          });

          setTimeout(function() {
            that.loading = false;
            that.modal = false;
            that.$router.push("/studentmain");
          }, 600);
        } else {
          that.$Notice.error({
            title: "切换失败!"
          });
        }
      });
    }
  }
};
</script>

<style scoped>
#main {
  position: relative;
}
#bookname {
  position: absolute;
  left: 30px;
  top: 45px;
  font-size: 13px;
  font-weight: bold;
}
#btn {
  position: absolute;
  left: 55px;
  top: 75px;
}
.ok {
  background-color: rgb(74, 199, 103);
  color: white;
}
.notok {
  background-color: #d8d8d8;
  color: black;
}
</style>
