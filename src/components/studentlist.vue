<template>
  <div>
    <Card id="top">
      <p slot="title">
        <Icon type="ios-search"></Icon>选择班级
      </p>
      <Select @on-change="change" style="width: 200px;margin-left: 10px">
        <Option v-for="(it,i) in classList" :value="it" :key="i">{{it}}</Option>
      </Select>
    </Card>
    <Table :columns="columns" :data="datax" border style="margin-top: 20px;" />
    <Page
      :total="total"
      :page-size="pagesize"
      show-elevator
      show-total
      style="margin-left: 35%;margin-top: 5%"
      @on-change="changepage"
    />
    <Modal v-model="modal1" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"/>
        <span>删除学生确认</span>
      </p>
      <div style="text-align:center">
        <p>删除该学生后无法找回</p>
        <p>仍然要删除吗？</p>
      </div>
      <div slot="footer">
        <Button @click="deletestudent" long size="large" type="error">删除</Button>
      </div>
    </Modal>
    <Modal v-model="modal2" draggable scrollable title="单词书开通">
      <Table :data="resource" :columns="columnx"/>
    </Modal>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      current_student_id:"",
      total: 0,
      modal1: false,
      modal2: false,
      pagesize: 7,
      index: 0,
      resource: [],
      columnx: [
        { title: "教材ID", key: "bookid" },
        { title: "教材名", key: "bookname" },
        { title: "当前状态", key: "status" },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          render: (h, params) => {
            if(params.row.status==="未开通")
             return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.openthis(params.index);
                      }
                    }
                  },
                  "开通"
                )
              ]);
            }

        }
      ],
      columns: [
        {
          title: "学生ID",
          key: "id",
          fixed: "left"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "电子邮箱",
          key: "email"
        },
        {
          title: "金币数量",
          key: "coin",
          sortable: true
        },
        {
          title: "上次登录时间",
          key: "lastlogintime"
        },
        {
          title: "所属班级",
          key: "classname"
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.register(params.index);
                    }
                  }
                },
                "开通课程"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.modal1 = true;
                      this.index = params.index;
                    }
                  }
                },
                "删除学员"
              )
            ]);
          }
        }
      ],
      datax: [],
      datay: [],
      classList: []
    };
  },
  methods: {
    //下一页
    changepage(index) {
      let start = (index - 1) * this.pagesize;
      let end = index * this.pagesize;
      this.datax = this.datay.slice(start, end);
    },
    //删除学生
    deletestudent() {
      let that = this;
      let params = new URLSearchParams();
      params.append("studentID", this.datax[this.index].id);
      axios
        .post("deleteStudent.do", params)
        .then(function(res) {
          if (res.data === "删除学生成功") {
            that.modal1 = false;
            that.$Notice.success({
              title: "删除成功"
            });
          } else if (res.data === "此学号的学生不存在，无法删除！") {
            that.modal1 = false;
            that.$Notice.error({
              title: "删除失败",
              des: "此学号的学生不存在，无法删除！"
            });
          }
        })
        .catch(function(err) {
          that.$Notice.error({
            title: "网络连接错误"
          });
        });
    },
    //注册课程
    register(index) {
      let that = this;
      let params = new URLSearchParams();
      params.append("studentid", this.datax[index].id);
      this.current_student_id=this.datax[index].id;
      axios.post("stulooktextbook.do", params).then(function(res) {
        that.resource = res.data.info;
        for(let i=0;i<that.resource.length;i++){
          if(that.resource[i].status==="1"){
            that.resource[i].status="已开通";
          }
          else{
            that.resource[i].status="未开通";
          }
        }
        that.modal2 = true;
      });
    },
    //切换班级
    change(value) {
      let that = this;
      let params = new URLSearchParams();
      params.append("className", value);
      axios
        .post("showClassStudent.do", params)
        .then(function(res) {
          that.datay = res.data;
          that.total = res.data.length;
          if (that.total < that.pagesize) {
            that.datax = that.datay;
          } else {
            that.datax = that.datay.slice(0, that.pagesize);
          }
        })
        .catch(function(err) {
          that.$Notice.error({
            title: "网络连接错误"
          });
        });
    },
    //TODO 提交切换请求
    openthis(index) {
      let that=this;
      let params=new URLSearchParams();
      params.append("studentid",this.current_student_id);
      params.append("textbookid",this.resource[index].bookid);
      axios.post("openbook.do",params)
      .then(function () {
        that.$Message.success("开通成功");
        that.resource[index].status="已开通";
      })
    }
  },

  created() {
    let that = this;
    let params = new URLSearchParams();
    params.append("teacherID", sessionStorage.getItem("token"));
    axios
      .post("classListBox.do", params)
      .then(function(res) {
        that.classList = res.data;
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
#top {
  margin-top: 10px;
  height: 120px;
}
</style>
