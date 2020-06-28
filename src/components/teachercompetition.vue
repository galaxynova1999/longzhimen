<template>
  <div>
    <Card :padding="8" dis-hover style="margin-top: 10px">
      <p slot="title">
        <Icon type="ios-search" />筛选
      </p>
      <Form :label-width="80" inline style="margin-top: 10px;display: inline" v-model="forma">
        <FormItem label="关键词">
          <Input prefix="ios-information-circle-outline" v-model="forma.keyword" />
        </FormItem>
        <FormItem label="状态">
          <Select v-model="forma.state">
            <Option value="未开始" label="未开始" />
            <Option value="已结束" label="已结束" />
            <Option value="进行中" label="进行中" />
          </Select>
        </FormItem>
        <FormItem label="组织方">
          <Select v-model="forma.orga">
            <Option value="北京四中" label="北京四中" />
          </Select>
        </FormItem>
        <FormItem label="分类">
          <Select v-model="forma.category">
            <Option :key="item.value" :value="item.value" v-for="item in bisaitype">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="参赛范围">
          <Select v-model="forma.scope">
            <Option value="初一" label="初一" />
            <Option value="初二" label="初二" />
            <Option value="初三" label="初三" />
          </Select>
        </FormItem>
        <FormItem>
          <Button icon="ios-search" shape="circle" type="primary" @click="search">搜索比赛</Button>
        </FormItem>
      </Form>
      <Button
        @click="open=true"
        icon="ios-add-circle-outline"
        shape="circle"
        style="margin-top: 2px"
        type="success"
      >新建比赛</Button>
    </Card>
    <Table :columns="columns" :data="datax" border style="margin-top: 20px" />
    <Drawer :mask-closable="false" :styles="styles" title="新建比赛" v-model="open" width="430">
      <Form v-model="form">
        <FormItem label="组织方">
          <Input v-model="form.organizer"/>
        </FormItem>
        <FormItem label="比赛名称">
          <Input v-model="form.name"/>
        </FormItem>
        <FormItem label="选择比赛类型">
          <Select v-model="form.competitionType">
            <Option :key="item.value" :value="item.value" v-for="item in bisaitype">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="比赛规则/奖励">
          <Input :autosize="{minRows: 3,maxRows: 9}" type="textarea" v-model="form.rules"/>
        </FormItem>
        <FormItem label="参赛范围">
          <Input v-model="form.entryScope"/>
        </FormItem>
        <FormItem label="比赛内容">
          <RadioGroup>
            <Radio label="不限范围">不限范围</Radio>
            <Radio label="scope">选择教材</Radio>
            <Select style="width: 150px" @on-change="changebook">
              <Option v-for="(item,i) in textbooklist " :key="i" :value="item">{{item}}</Option>
            </Select>
          </RadioGroup>
        </FormItem>
        <FormItem label="比赛难度">
          <RadioGroup v-model="form.difficulty">
            <Radio label="容易">简单</Radio>
            <Radio label="普通">普通</Radio>
            <Radio label="困难">困难</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="道具">
          <i-switch size="large" v-model="form.isEnableProp">
            <span slot="open">允许</span>
            <span slot="close">禁止</span>
          </i-switch>
        </FormItem>
        <FormItem v-if="form.isEnableProp===true" label="数量">
          <Input v-model="form.prop1"/>
          <Input v-model="form.prop2"/>
        </FormItem>
        <FormItem label="比赛时间">
          <DatePicker
            v-model="form.startTime"
            type="datetime"
            value="form.startTime"
            placeholder="比赛开始时间"
            style="margin-left:10px;width: 140px"
          ></DatePicker>
          <DatePicker
            v-model="form.endTime"
            type="datetime"
            value="form.endTime"
            placeholder="比赛结束时间"
            style="margin-left:10px;width: 140px"
          ></DatePicker>
        </FormItem>
      </Form>
      <Divider />
      <Button @click="save" long size="large" type="primary">提交</Button>
    </Drawer>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "competition",
  data() {
    return {
      textbooklist: [],
      forma: {
        keyword: null,
        state: null,
        category: null,
        orga: null,
        scope: null
      },
      form: {
        organizer: "",
        name: "",
        competitionType: "",
        entryScope: "",
        rules: "",
        content: "",
        difficulty: "",
        isEnableProp: "",
        startTime: null,
        endTime: null,
        prop1: "",
        prop2: ""
      },
      bisaitype: [
        {
          value: "擂台PK",
          label: "擂台PK"
        },
        {
          value: "一站到底",
          label: "一站到底"
        }
      ],
      columns: [
        {
          title: "分类",
          key: "type"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "组织方",
          key: "organization"
        },
        {
          title: "状态",
          key: "status"
        },
        {
          title: "参赛范围",
          key: "entry_scope"
        },
        {
          title: "参与数",
          key: "participants",
          sortable: true
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
                    type: "success",
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
                "排名"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.modal = true;
                      this.index = params.index;
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      datax: [],
      open: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      }
    };
  },
  methods: {
    //新建比赛
    save() {
      let that = this;
      let params = new URLSearchParams();
      params.append("organizer", that.form.organizer);
      params.append("competitionType", that.form.competitionType);
      params.append("name", that.form.name);
      params.append("rules", that.form.rules);
      params.append("entryScope", that.form.entryScope);
      params.append("content", that.form.content);
      params.append("difficulty", that.form.difficulty);
      params.append("isEnableProp", that.form.isEnableProp);
      params.append("prop1", that.form.prop1);
      params.append("prop2", that.form.prop2);
      params.append("startTime", that.form.startTime.getTime());
      params.append("endTime", that.form.endTime.getTime());
      axios
        .post("addcompetition.do", params)
        .then(function(res) {
          if (res.data === "success") {
            that.open = false;
            that.$Notice.success({
              title: "添加成功"
            });
          } else if (res.data === "failed") {
            that.open = false;
            that.$Notice.error({
              title: "添加失败"
            });
          }
        })
        .catch(function(err) {
          that.$Notice.error({
            title: "网络连接失败"
          });
        });
    },
    changebook(value) {
      this.formItem.content = value;
    },
    //搜索比赛
    search() {
      let that = this;
      let params = new URLSearchParams();
      params.append("name", this.forma.keyword);
      params.append("status", this.forma.state);
      params.append("organizer", this.forma.orga);
      params.append("competition_type", this.forma.category);
      params.append("entry_scope", this.forma.scope);
      axios.post("selectcompetition.do", params).then(function(res) {
        that.datax = res.data;
      });
    }
  },
  created() {
    //请求数据
    let that = this;
    let params = new URLSearchParams();
    params.append("id", sessionStorage.getItem("token"));
    axios
      .post("listcompetition.do", params)
      .then(function(res) {
        that.datax = res.data;
      })
      .catch(function(err) {
        that.$Nocice.error({
          title: "网络连接错误"
        });
      });

    axios.post("textbookbox.do").then(function(res) {
      that.textbooklist = res.data;
    });
  }
};
</script>

<style scoped>
</style>
