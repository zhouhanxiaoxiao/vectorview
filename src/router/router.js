import Vue from 'vue'
import VueRouter from 'vue-router'
import homeView from "@/components/home/homeView";
import service from "@/components/service/service";
import rAAVpackaging from "@/components/service/rAAVpackaging";
import configmain from "@/components/config/configmain";
Vue.use(VueRouter)

/*配置路由*/
const routes=[
    {path: '', redirect : "/home"},
    {path: '/', redirect : "/home"},
    {path: '/home', component: homeView, meta: {index: 0}},
    {path: '/service', component: service, meta: {index: 1}},
    {path: '/rAAV', component: rAAVpackaging, meta: {index: 2}},
    {path: '/config', component: configmain, meta: {index: 3}},
]
/*实例化路由*/
const router = new VueRouter({
    routes:routes, // （简写）相当于 routes: routes
});

/*导出路由模块*/
export default router