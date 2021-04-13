<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #0483c8">
    <a class="navbar-brand" @click="goHome" style="display: inline-block;">
      <img src="../../assets/carrier.png" style="width: 200px" alt="">
    </a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto" style="font-size: 20px">
        <li class="nav-item carrier-menu">
          <router-link to="/home"><a class="nav-link">{{ $t("home") }}</a></router-link>
        </li>
        <li class="nav-item carrier-menu">
          <router-link to="/service"><a class="nav-link">{{ $t("serviceRequest") }}</a></router-link>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <language></language>
        <div class="dropdown">
          <button class="btn btn-outline-light dropdown-toggle"
                  type="button" id="dropdownMenuButton" data-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false">
            {{ $t("hello") + "，" + user.name}}
          </button>
          <div class="dropdown-menu dropdown-menu-right" style="font-size: 14px;line-height: normal">
            <a class="dropdown-item" v-if="isVector" @click="gotoConfig">{{ $t("config") }}</a>
            <a class="dropdown-item" @click="casOut">{{ $t("exit") }}</a>
          </div>
        </div>
      </form>
    </div>
    <v-loading :show="loading"></v-loading>
  </nav>
</template>

<script>
import util from "@/components/public/util";
import VLoading from "@/components/public/v-loading";
import Language from "@/components/public/language";

export default {
  name: "carrierNav",
  components: {Language, VLoading},
  data : function (){
    return{
      user : {},
      loading : false
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      var _this = this;
      this.$axios.get("/home/user").then(function (res){
        // console.log(res);
        _this.$store.commit("saveUser",res.data.retMap.user);
        _this.user = res.data.retMap.user;
      }).catch(function (res){
        console.log(res);
      })
    },
    casOut : function (){
      this.loading = true;
      window.open(util.casOutUrl);
      setTimeout(function (){
        window.location.reload();
      },5000);
    },
    goHome : function (){
      this.$router.push("/home");
    },
    gotoConfig : function (){
      this.$router.push("/config")
    }
  },
  computed : {
    hasUser : function (){
      console.log(this.user.name)
      if (this.user.name != undefined){
        return true;
      }else {
        return false;
      }
    },
    isVector : function (){
      return this.$store.getters.isVectorEditor;
    }
  },
}
</script>

<style scoped>
.carrier-menu{
  margin-left: 20px;
}
</style>