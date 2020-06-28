<template>
  <div>
    <Card style="margin-top: 10px;width: 600px;margin-left: 50px;height: 90px" dis-hover :padding="0">
      <span slot="title" style="height: 15px;font-size: 15px">
        <Icon type="ios-film-outline"></Icon>
        本周你又进步了许多，快来看看吧！
      </span>
      <div style="margin-left: 310px;margin-top: 6px">
        <span>看看我的：</span>
        <Select
          style="width: 200px"
          @on-change="choose"
          placeholder="最近一周内单词学习情况"
        >
          <Option value="1">最近一周内单词学习情况</Option>
          <Option value="2">本月学习时间统计</Option>
          <Option value="3">测试成绩</Option>
          <Option value="4">金币变动情况</Option>
        </Select>
      </div>
    </Card>

    <div id="chart">
      <!-- 最近一周内单词学习情况 -->
      <div id="chart1" v-if="ischart1">
        <Card style="margin-top: 40px;width:670px;" dis-hover>
          <ve-histogram
            width="100%"
            :legend-visible="false"
            :data="chartData"
            :extend="extend"
            :settings="chartSettings"
            :toolbox="toolbox"
            :data-empty="dataEmpty"
            :loading="loading"
          />
        </Card>
      </div>
      <!-- 测试成绩表格 -->
      <Card style=";margin-top:10px;width:680px;" v-if="istable" dis-hover>
        <div id="chart2">
          <div id="u4">
            <Table stripe border width="650" :columns="columns1" :data="data2" height="400"></Table>
            <Page
              :total="total"
              :page-size="pagesize"
              show-elevator
              show-total
              style="margin-left: 22px;margin-top: 5%;font-size: 15px"
              @on-change="changepage"
            />
          </div>
        </div>
      </Card>
      <!-- 学习时间统计 -->
      <div id="chart3" style v-if="ischart2">
        <Card style="margin-top: 40px;width:670px;" dis-hover>
          <ve-pie width="100%" :legend-visible="false" :data="chartData" />
        </Card>
      </div>
      <!-- 金币变动情况 -->
      <Card style="margin-top: 10px;width:680px;" v-if="istable2" dis-hover>
        <div id="chart4">
          <div id="u5">
            <Table stripe border width="650" :columns="columns2" :data="data3" height="400"></Table>
            <Page
              :total="total2"
              :page-size="pagesize"
              show-elevator
              show-total
              style="margin-left: 22px;margin-top: 5%;font-size: 15px"
              @on-change="changepage2"
            />
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import "v-charts/lib/style.css";
export default {
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
    this.chartSettings = {
      yAxisName: ["单词数量"],
      labelMap: {
        date: "日期",
        count: "单词数量"
      }
    };
    return {
      ischart1: false,
      ischart2: false,
      istable: false,
      istable2: false,
      classname: "",
      requesttype: "",
      chartData: {},
      //表格1
      Data1: {
        columns: ["date", "count"],
        rows: []
      },
      //表格2
      Data2: {
        columns: ["类别", "时间"],
        rows: [
          { 类别: "单词识别", 时间: "74" },
          { 类别: "单词拼写", 时间: "26" }
        ]
      },
      dataEmpty: false,
      loading: false,
      //表格3
      columns1: [
        {
          title: "序号",
          type: "index",
          align: "center"
        },
        {
          title: "课本",
          key: "bookname",
          align: "center"
        },
        {
          title: "测试类型",
          key: "type",
          align: "center"
        },
        {
          title: "单元",
          key: "unit",
          align: "center"
        },
        {
          title: "分数",
          key: "score",
          align: "center"
        },
        {
          title: "通过",
          key: "pass",
          align: "center"
        }
      ],
      //表格4
      columns2: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 80
        },
        {
          title: "变动时刻",
          key: "diff_time",
          align: "center",
          width: 200
        },
        {
          title: "金币变动",
          key: "different",
          align: "center"
        },
        {
          title: "变动原因",
          key: "des",
          align: "center"
        }
      ],
      data2: [],
      data2x: [],
      data3: [],
      data3x: [],
      pagesize: 7,
      total: "",
      total2: 0
    };
  },
  methods: {
    //表格3分页
    changepage(index) {
      let start = (index - 1) * this.pagesize;
      let end = index * this.pagesize;
      this.data2 = this.data2x.slice(start, end);
    },
    //表格4分页
    changepage2(index) {
      let start = (index - 1) * this.pagesize;
      let end = index * this.pagesize;
      this.data3 = this.data3x.slice(start, end);
    },
    //选项框
    choose(value) {
      if (value === "1") {
        this.chartData = this.Data1;
        this.ischart1 = true;
        this.ischart2 = false;
        this.istable = false;
        this.istable2 = false;
      }
      if (value === "2") {
        this.chartData = this.Data2;
        this.ischart1 = false;
        this.ischart2 = true;
        this.istable = false;
        this.istable2 = false;
      }
      if (value === "3") {
        this.ischart1 = false;
        this.ischart2 = false;
        this.istable = true;
        this.istable2 = false;
      }
      if (value === "4") {
        this.ischart1 = false;
        this.ischart2 = false;
        this.istable2 = true;
        this.istable = false;
      }
    }
  },
  created() {
    this.value = 1;
    this.chartData = this.Data1;
    this.ischart1 = true;
    this.ischart2 = false;
    this.istable = false;
    this.istable2 = false;
    let that = this;
    let params1 = new URLSearchParams();
    params1.append("studentid", sessionStorage.getItem("token"));
    axios.post("testscore.do", params1).then(function(res) {
      //保存测试成绩
      that.data2x = res.data;
      that.total = res.data.length;
      if (res.data.length < that.pagesize) {
        that.data2 = that.data2x;
      } else {
        that.data2 = that.data2x.slice(0, that.pagesize);
      }
    });
    let params2 = new URLSearchParams();
    params2.append("studentid", sessionStorage.getItem("token"));
    axios.post("sturecentstudy.do", params2).then(function(res) {
      //保存学习情况
      that.Data1.rows = res.data;
    });
    //金币情况
    let params3 = new URLSearchParams();
    params3.append("studentID", sessionStorage.getItem("token"));
    axios.post("showCoinDiff.do", params3).then(function(res) {
      that.data3x = res.data;
      that.total2 = res.data.length;
      if (res.data.length < that.pagesize) {
        that.data3 = that.data3x;
      } else {
        that.data3 = that.data3x.slice(0, that.pagesize);
      }
    });
  }
};
</script>
<style scoped>
#u4 {
  text-align: center;
  margin-top: 20px;
  width: 686px;
  height: 400px;
}
#u5 {
  font-family: "Arial Normal", "Arial";
  text-align: center;
  margin-top: 20px;
}
#chart {
  margin-left: 20px;
  width: 670px;
  height: 500px;
}
#chart1 {
  font-family: "Arial Normal", "Arial";
  font-size: 18px;
}
#chart2 {
  margin-top: 10px;
  width: 686px;
  height: 400px;
}
#chart3 {
  font-family: "Arial Normal", "Arial";
}
#chart4 {
  margin-top: 10px;
  width: 686px;
  height: 400px;
}
</style>
