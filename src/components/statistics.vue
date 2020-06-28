<template>
  <div>
    <Card :padding="8" dis-hover style="margin-top: 10px">
      <p slot="title">
        <Icon type="ios-search"></Icon>选择班级
      </p>

      <Select style="width: 200px;margin-left: 10px" @on-change="change">
        <Option v-for="(it,i) in classList" :value="it" :key="i">{{it}}</Option>
      </Select>
      <Button style="margin-left: 10px" @click="sevendaystrainging">训练量(最近七天)</Button>
      <Button style="margin-left: 10px" @click="sevendayswords">词汇量(最近七天)</Button>
      <Button style="margin-left: 10px" @click="sevendaystime">学习时间(最近七天)</Button>
      <Button style="margin-left: 10px" @click="sevendays">训练&词汇(最近七天)</Button>
    </Card>
    <Card style="margin-top: 20px">
      <ve-histogram
        :data="chartData"
        :data-empty="dataEmpty"
        :extend="extend"
        :legend-visible="true"
        :loading="loading"
        :settings="chartSettings"
        :toolbox="toolbox"
        width="90%"
      />
    </Card>
  </div>
</template>

<script>
import axios from "axios";
import "v-charts/lib/style.css";

export default {
  name: "statistics",
  data() {
    (this.extend = {
      series: {
        label: { show: true, position: "top" },
        barWidth: 20
      }
    }),
      (this.toolbox = {
        feature: {
          magicType: { type: ["line", "bar"] },
          saveAsImage: {}
        }
      });
    return {
      classname: "",
      classList: [],
      requesttype: "",
      chartSettings : {
        yAxisName: ["总量"]
      },
      chartData: {
        columns: [],
        rows: []
      },
      dataEmpty: false,
      loading: false
    };
  },
  methods: {
    //下拉框的回调函数
    change(value) {
      this.classname = value;
    },
    //查询最近七天的训练量
    sevendaystrainging() {
      if (this.classname === "") {
        this.$Notice.error({
          title: "请先选择一个要查看的班级"
        });
        return;
      }

      this.loading = true;
      let that = this;
      let params = new URLSearchParams();
      //params.append("teacherID",sessionStorage.getItem("token"));
      params.append("id", "001");
      params.append("classname", this.classname);
      axios
        .post("recentsevendaystraining.do", params)
        .then(function(res) {
          that.chartData.rows = res.data;
          that.chartData.columns = ["姓名", "训练量"];
          that.chartSettings={
            yAxisName: ["单位/个"]
          };
          that.loading = false;

        })
        .catch(function(err) {
          that.$Notice.error({
            title: "网络连接错误"
          });
        });
    },

    //最近七天词汇量
    sevendayswords() {
      if (this.classname === "") {
        this.$Notice.error({
          title: "请先选择一个要查看的班级"
        });
        return;
      }
      this.loading = true;
      let that = this;
      let params = new URLSearchParams();
      //params.append("teacherID",sessionStorage.getItem("token"));
      params.append("id", "001");
      params.append("classname", this.classname);
      axios
        .post("recentsevendaysword.do", params)
        .then(function(res) {
          that.chartData.rows = res.data;
          that.chartData.columns = ["姓名", "词汇量"];
          that.chartSettings={
            yAxisName: ["单位/个"]
          };
          that.loading = false;
        })
        .catch(function(err) {
          that.$Notice.error({
            title: "网络连接错误"
          });
        });
    },
    //最近七天学习时间
    sevendaystime() {
      if (this.classname === "") {
        this.$Notice.error({
          title: "请先选择一个要查看的班级"
        });
        return;
      }
      this.loading = true;
      let that = this;
      let params = new URLSearchParams();
      //params.append("teacherID",sessionStorage.getItem("token"));
      params.append("id", "001");
      params.append("classname", this.classname);
      axios
        .post("recentsevendaystime.do", params)
        .then(function(res) {
          that.chartData.rows = res.data;
          that.chartData.columns = ["姓名", "学习时间"];
          that.chartSettings={
            yAxisName: ["单位/分钟"]
          };
          that.loading = false;
        })
        .catch(function(err) {
          that.$Notice.error({
            title: "网络连接错误"
          });
        });
    },
   //最近七天词汇量和训练量
    sevendays() {
      if (this.classname === "") {
        this.$Notice.error({
          title: "请先选择一个要查看的班级"
        });
        return;
      }
      this.loading = true;
      let that = this;
      let params = new URLSearchParams();
      params.append("id", sessionStorage.getItem("token"));
      params.append("classname", this.classname);
      axios
        .post("recentsevendaysstudy.do", params)
        .then(function(res) {
          that.chartData.rows = res.data;
          that.chartData.columns = ["姓名", "训练量", "词汇量"];
          that.chartSettings={
            yAxisName: ["单位/个"]
          };
          that.loading = false;
        })
        .catch(function(err) {
          that.$Notice.error({
            title: "网络连接错误"
          });
        });
    }
  },
  created() {
    let that = this;
    let params = new URLSearchParams();
    params.append("teacherID", sessionStorage.getItem("token"));
    //请求班级列表放入下拉框
    axios
      .post("classListBox.do", params)
      .then(function(res) {
        that.classList = res.data;
        that.loading = false;
      })
      .catch(function(err) {
        that.$Notice.error({
          title: "网络连接错误"
        });
      });
  }
};
</script>

<style scoped>
</style>
