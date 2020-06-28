<template>
  <div class="basic1" :class="status">
    <div id="child1">
      <Button style="border: none;" class="basic2" :class="status" @click="tounit_test">
        <span id="u0">{{unit}}</span>
      </Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "loop",
  props: {
    bookid:{
      type:String
    },
    unit: {
      type: Number
    },
    status: {
      type: String
    }
  },
  methods: {
    //点击单元按钮
    tounit_test() {
      if (this.status === "unbegin") {
        this.$Message.error("您尚未学习过该单元");
      }
      if (this.status === "ongoing") {
        this.$router.push({ name: "unittest", params: { unit: this.unit,bookid:this.bookid } });
      }
      if (this.status === "finished") {
        this.$router.push({ name: "unittest", params: { unit: this.unit,bookid:this.bookid  } });
      }
    }
  }
};
</script>

<style scoped>
#child1 {
  width: 51px;
  height: 51px;
  border-radius: 50%;
  position: relative;
  background-color: white;
  top: 2px;
  left: 2px;
}
.basic1 {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: rgb(227, 249, 222);
}

.basic2 {
  width: 43px;
  height: 43px;
  border-radius: 50%;
  position: relative;
  top: 4px;
  left: 4px;
  background-color: rgb(139, 229, 117);
}
#u0 {
  color: white;
  position: absolute;
  width: 43px;
  top: 6px;
  left: -1px;
  text-align: center;
  font-size: 20px;
}
.basic1.ongoing {
  background-color: rgb(255, 221, 212);
}
.basic2.ongoing {
  background-color: rgb(255, 142, 113);
}
.basic1.unbegin {
  background-color: rgb(245, 245, 245);
}
.basic2.unbegin {
  background-color: rgb(222, 222, 222);
}
</style>
