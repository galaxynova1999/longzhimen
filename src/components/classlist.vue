<template>
  <div>
    <Modal
      :styles="{width:'450px'}"
      @on-cancel="cancel"
      @on-ok="addnewstudent"
      title="添加学生"
      v-model=modal>
      <Form :lael-width="50" :model="formItem">
        <FormItem label="学生姓名">
          <Input v-model="formItem.studentname"/>
        </FormItem>
        <FormItem label="学生邮箱">
          <Input v-model="formItem.email"/>
        </FormItem>
        <FormItem label="学生ID">
          <Input v-model="formItem.studentid"/>
        </FormItem>
      </Form>
    </Modal>
    <Menu active-name="1" mode="horizontal" style="margin-top: 10px">
      <MenuItem name="1">
        <Icon type="ios-paper"/>
        数据
      </MenuItem>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-stats"/>
          统计分析
        </template>
          <MenuItem name="2-1">新增和启动</MenuItem>
          <MenuItem name="2-2">活跃分析</MenuItem>
          <MenuItem name="2-3">时段分析</MenuItem>
      </Submenu>
    </Menu>
    <Table :columns="columns" :data="datax" border style="margin-top: 20px"/>
    <Page :total="total" show-elevator show-total style="margin-left: 35%;margin-top: 5%"/>
  </div>
</template>

<script>
  import axios from "axios"

  export default {
    data() {
      return {
        total: 0,
        index: 0,
        loading: true,
        modal: false,
        formItem: {
          studentid: '',
          email: '',
          studentname: ''
        },
        columns: [
          {
            title: '班级名称',
            key: 'classname',
            fixed: 'left'
          },
          {
            title: '班级状态',
            key: 'status'
          },
          {
            title: '班级人数',
            key: 'student_num'
          },
          {
            title: "操作",
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.index = params.index;
                      this.modal = true;
                    }
                  }
                }, '添加学生')
              ]);
            }
          }
        ],
        datax: [],
      }
    },
    methods: {
      cancel() {
        this.modal = false;
      },
      //添加新学生
      addnewstudent(name) {
        let that = this;
        if (this.formItem.studentid === "" || this.formItem.studentname === "") {
          this.loading = false;
          return;
        }
        let params=new URLSearchParams();
        params.append("studentID",that.formItem.studentid);
        params.append("studentName",that.formItem.studentname);
        params.append("email",that.formItem.email);
        params.append("className",that.datax[that.index].classname);
        axios.post('addStudent.do', params)
          .then(function (res) {
            if(res.data===1){
              that.loading = false;
              that.$Notice.success({
                desc: "添加成功"
              });
              that.$router.go(0);
            }
           else if(res.data===0){
              that.loading = false;
              that.$Notice.error({
                desc:"此学号的学生已在班级中，无法新增！"
              });
              that.formItem.studentid="";
              that.formItem.studentname="";
              that.formItem.email="";
            }

          })
          .catch(function (err) {
          })
      }
    },

    created() {
      let that=this;
      let params=new URLSearchParams();
      params.append("teacherID",sessionStorage.getItem("token"));
      //页面加载时请求班级列表
      axios.post('classListDetail.do', params)
        .then(function (res) {
          that.datax = res.data;
        }).catch(function (err) {
         that.$Notice.error({
           title:"网络连接错误"
         })
      })
    }
  }
</script>

<style scoped>

</style>
