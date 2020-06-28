// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import axios from "axios"
import VCharts from 'v-charts'
import Loading from 'element-ui'
Vue.prototype.$axios = axios;
axios.defaults.baseURL = "http://localhost:8090";
Vue.use(VCharts);
Vue.use(ViewUI);
Vue.use(Loading);
router.beforeEach((to, from, next) => {
   const token=sessionStorage.getItem("token");
   const type=sessionStorage.getItem("type");
    ViewUI.LoadingBar.start();
    if(token===null && to.name!=="default") {
      next({path:"/"});
    }
    else if(token!==null && !to.meta.roles.includes(type)){
      next({path:"/"});
    }
    else if(token!==null && to.meta.roles.includes(type)){
      next();
    }
    next();
});

router.afterEach(route => {
    ViewUI.LoadingBar.finish();
})
Vue.config.productionTip = false
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
