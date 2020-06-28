import Login from "../../../src/components/Login";
import {mount} from 'vue-test-utils'

const wrapper=mount(Login);
describe("Login",()=>{
  it("页面加载成功"),()=>{
    expect(wrapper.html()).toContain('<span style="font-size: 35px;" id="tt">单词赢</span>');
  };
  it("提交功能可用",()=>{
    wrapper.setData({name:'1@qq.com',pwd:'123456'})
    const clickButton=wrapper.find("#subbtn");
    clickButton.trigger("click");
    setTimeout(()=>{
      expect(wrapper.vm.$data.name).to.equal("Error");
      done();
    },1000)

  });
});




