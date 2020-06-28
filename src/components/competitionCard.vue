<template>
  <div id="main">
    <img id="img1" :src="convert" />
    <Badge id="badge1" v-if="done" text="已参与" type="info" />
    <Badge id="badge2" v-if="!done" text="参赛" type="success" />
    <Card id="content">
      <div id="u1">
        <span id="u2">
          <Badge status="success"></Badge>
          {{name}}
        </span>
        <span id="u3">{{time}}</span>
        <span id="u4">{{scope}}</span>
        <div id="u5">
          <Avatar class="avatar" icon="ios-person" id="no1" size="35" :src="first_avatar" />
          <Avatar class="avatar" icon="ios-person" id="no2" size="35" :src="second_avatar" />
          <Avatar class="avatar" icon="ios-person" id="no3" size="35" :src="third_avatar" />
          <img id="img2" src="../assets/image/123.png" />
        </div>
        <div id="u8">
          <span id="u6">我的排名: {{rank}}</span>
          <router-link :to="{name:'CompetitionDetails',params:{id:_id,done:_done,cptype:_cptype}}">
            <a>&nbsp;&nbsp;详情>></a>
          </router-link>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
export default {
  name: "competitionCard",
  data() {
    return {
      _id: "",
      _done: "",
      _cptype: ""
    };
  },
  props: {
    first_avatar: {
      type: String
    },
    second_avatar: {
      type: String
    },
    third_avatar: {
      type: String
    },
    name: {
      type: String
    },
    time: {
      type: String,
      default: "7.12-8.12"
    },
    scope: {
      type: String,
      default: "河北省 初一上册"
    },
    rank: {
      type: String,
      default: "999"
    },
    cptype: {
      type: String,
      default: "../static/一站到底.png"
    },
    done: {
      type: Boolean,
      default: true
    },
    id: {
      type: String
    }
  },
  computed: {
    convert: function() {
      if (this.cptype === "一站到底") return "../static/一站到底.png";
      else return "../static/擂台pk.png";
    }
  },
  created() {
    this._id = this.id;
    this._cptype = this.cptype;
    this._done = this.done;
  }
};
</script>

<style scoped>
#main {
  display: inline;
  position: relative;
}
#img1 {
  width: 120px;
  position: absolute;
  z-index: 2;
}
#badge1 {
  position: absolute;
  z-index: 2;
  top: 8px;
  left: 155px;
}
#badge2 {
  position: absolute;
  z-index: 2;
  top: 8px;
  left: 165px;
}
#content {
  width: 210px;
  height: 260px;
  top: 0;
  position: absolute;
}
#u1 {
  margin-top: 20px;
}
#u2 {
  display: block;
  text-align: center;
  width: 100%;
  font-size: 18px;
  font-weight: bold;
}
#u3 {
  display: block;
  width: 100%;
  margin-top: 4px;
  text-align: center;
}
#u4 {
  display: block;
  width: 100%;
  margin-top: 4px;
  text-align: center;
}
#img2 {
  width: 150px;
  margin-top: 44px;
  margin-left: 10px;
}
#u5 {
  width: 100%;
  position: relative;
}
#no1 {
  position: absolute;
  left: 65px;
  top: 5px;
}
#no2 {
  position: absolute;
  top: 28px;
  left: 16px;
}
#no3 {
  position: absolute;
  top: 28px;
  left: 120px;
}
#u7 {
  margin-left: 40px;
}
#u8 {
  margin-top: 0;
}
</style>
