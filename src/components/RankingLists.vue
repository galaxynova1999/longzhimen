<template>
  <div>
    <div id="main" style="z-index:0;">
      <img :src="toppic" id="toppic" />
      <div id="remain">
        <div id="no1">
          <Avatar class="avatar" icon="ios-person" id="avatarno1" size="50" :src="info[0].avatar" />
          <p id="nameno1">{{info[0].name}}</p>
          <img :src="tokenpic" id="miaobiaono1" />
          <span id="valueno1">{{info[0].value}}</span>
        </div>
        <div id="no2">
          <Avatar class="avatar" icon="ios-person" id="avatarno2" size="50" :src="info[1].avatar" />
          <p id="nameno2">{{info[1].name}}</p>
          <img :src="tokenpic" id="miaobiaono2" />
          <span class="value" id="valueno2">{{info[1].value}}</span>
        </div>
        <div id="no3">
          <Avatar class="avatar" icon="ios-person" id="avatarno3" size="50" :src="info[2].avatar" />
          <p id="nameno3">{{info[2].name}}</p>
          <img :src="tokenpic" id="miaobiaono3" />
          <span class="value" id="valueno3">{{info[2].value}}</span>
        </div>
        <img id="dizuo" src="../assets/image/123.png" />
        <div id="n4">
          <span class="rank">4</span>
          <Avatar class="avatar" icon="ios-person" size="25" :src="info[3].avatar" />
          <span class="name">{{info[3].name}}</span>
          <img :src="tokenpic" class="miaobiao" />
          <span class="value">{{info[3].value}}</span>
        </div>
        <div class="nx">
          <span class="rank">5</span>
          <Avatar class="avatar" icon="ios-person" size="25" :src="info[4].avatar" />
          <span class="name">{{info[4].name}}</span>
          <img :src="tokenpic" class="miaobiao" />
          <span class="value">{{info[4].value}}</span>
        </div>
        <div class="nx">
          <span class="rank">6</span>
          <Avatar class="avatar" icon="ios-person" size="25" :src="info[5].avatar" />
          <span class="name">{{info[5].name}}</span>
          <img :src="tokenpic" class="miaobiao" />
          <span class="value">{{info[5].value}}</span>
        </div>
        <div class="nx">
          <span class="rank">7</span>
          <Avatar class="avatar" icon="ios-person" size="25" :src="info[6].avatar" />
          <span class="name">{{info[6].name}}</span>
          <img :src="tokenpic" class="miaobiao" />
          <span class="value">{{info[6].value}}</span>
        </div>
        <div class="nx">
          <span class="rank">8</span>
          <Avatar class="avatar" icon="ios-person" size="25" :src="info[7].avatar" />
          <span class="name">{{info[7].name}}</span>
          <img :src="tokenpic" class="miaobiao" />
          <span class="value">{{info[7].value}}</span>
        </div>
        <div class="nx">
          <span class="rank">9</span>
          <Avatar class="avatar" icon="ios-person" size="25" :src="info[8].avatar" />
          <span class="name">{{info[8].name}}</span>
          <img :src="tokenpic" class="miaobiao" />
          <span class="value">{{info[8].value}}</span>
        </div>
        <div class="nx">
          <span class="rank">10</span>
          <Avatar class="avatar" icon="ios-person" size="25" :src="info[9].avatar" />
          <span class="name">{{info[9].name}}</span>
          <img :src="tokenpic" class="miaobiao" />
          <span class="value">{{info[9].value}}</span>
        </div>
        <div id="self">
          <span class="rank my">{{info[10].rank}}</span>
          <Avatar class="avatar my" icon="ios-person" size="35" :src="info[10].avatar" />
          <span class="name my">{{info[10].name}}</span>
          <img :src="tokenpic" class="miaobiao my" />
          <span class="value my">{{info[10].value}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    toppic: String,
    tokenpic: String,
    info: Array
  },
  data() {
    return {};
  },
  mounted() {
    
  }
};
</script>
<style scoped>
#main {
  display: inline;
}

#avatarno1 {
  position: absolute;
  left: 26px;
}

#nameno1 {
  position: absolute;
  top: 63px;
  text-align: center;
  width: 100%;
}

#miaobiaono1 {
  width: 25px;
  position: absolute;
  top: 85px;
  left: 15px;
}

#valueno1 {
  position: absolute;
  top: 90px;
  left: 45px;
}

#avatarno2 {
  position: absolute;
  left: 26px;
}

#nameno2 {
  position: absolute;
  top: 63px;
  text-align: center;
  width: 100%;
}

#miaobiaono2 {
  width: 25px;
  position: absolute;
  top: 85px;
  left: 15px;
}

#valueno2 {
  position: absolute;
  top: 90px;
  left: 45px;
}

#avatarno3 {
  position: absolute;
  left: 26px;
}

#nameno3 {
  position: absolute;
  top: 63px;
  text-align: center;
  width: 100%;
}

#miaobiaono3 {
  width: 25px;
  position: absolute;
  top: 85px;
  left: 15px;
  text-align: left;
}

#valueno3 {
  position: absolute;
  top: 90px;
  left: 45px;
}

#main {
  width: 350px;
  position: relative;
}

#toppic {
  width: 300px;
  z-index: 1;
  position: absolute;
  left: 30px;
}

#remain {
  width: 362px;
  height: 579px;
  z-index: -1;
  position: absolute;
  background-color: white;
  top: 45px;
  border-width: 3px 3px 0 3px;
  border-style: solid;
  border-radius: 6px;
  border-color: rgb(46, 180, 255);
}

#no1 {
  position: absolute;
  width: 100px;
  height: 120px;
  margin-top: 63px;
  margin-left: 125px;
}

#no2 {
  position: absolute;
  width: 100px;
  height: 120px;
  margin-top: 95px;
  margin-left: 40px;
}

#no3 {
  position: absolute;
  width: 100px;
  height: 120px;
  margin-top: 95px;
  margin-left: 215px;
}

#n4 {
  height: 30px;
  margin-left: 15px;
  width: 320px;
  margin-top: 4px;
  background-color: rgb(238, 249, 255);
  position: relative;
  border-radius: 5px;
}

.nx {
  height: 30px;
  width: 320px;
  margin-left: 15px;
  margin-top: 5px;
  background-color: rgb(238, 249, 255);
  position: relative;
  border-radius: 5px;
}

#dizuo {
  width: 330px;
  padding-top: 175px;
  padding-left: 55px;
  padding-right: 40px;
  z-index: -1;
}

.rank {
  left: 20px;
  position: absolute;
  line-height: 15px;
  font-size: 15px;
  top: 10px;
  color: rgb(57, 184, 255);
}

.rank.my {
  color: white;
  left: 20px;
  top: 13px;
  font-size: 17px;
  line-height: 17px;
}

.avatar {
  position: absolute;
  background-color: #87d068;
  left: 45px;
  top: 3px;
}

.avatar.my {
  left: 65px;
  top: 3px;
}

.name {
  position: absolute;
  left: 90px;
  top: 9px;
  line-height: 15px;
  font-size: 15px;
}

.name.my {
  left: 125px;
  font-size: 17px;
  line-height: 17px;
  top: 14px;
}

.miaobiao {
  left: 265px;
  position: absolute;
  height: 25px;
  top: 3px;
}

.miaobiao.my {
  left: 290px;
  top: 9px;
}

.value {
  position: absolute;
  left: 295px;
  height: 25px;
  line-height: 15px;
  top: 10px;
}

.value.my {
  left: 320px;
  top: 14px;
  font-size: 17px;
  line-height: 17px;
}

#self {
  height: 42px;
  width: 356px;
  background-color: rgb(46, 180, 255);
  margin-top: 2px;
  z-index: 2;
  position: absolute;
  color: white;
}
</style>
