import Vue from 'vue'
import App from './App.vue'
import router from "@/router/router";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import axios from "axios";
import i18n from "@/i18n";
import store from "@/store/store";
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.config.productionTip = false

Vue.prototype.$ = $;
Vue.prototype.$axios = axios;

axios.defaults.baseURL = "http://localhost:8088/test";
// axios.defaults.baseURL = "";

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
