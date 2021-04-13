<template>
  <div style="width: 100%;border: 2px solid darkgrey;height: 122px">
    <div style="width: 25%;height: 120px;line-height:120px;font-weight: bold;font-size: 30px;
      display: inline-block;border-right: 1px dashed darkgrey;text-align: center;vertical-align: top;">
      {{ $t("userInfo.pi") }}
    </div>
    <div style="width: 25%;height: 120px;font-size: 30px;
      display: inline-block;border-right: 2px solid darkgrey;text-align: center">
      <div style="width: 100%;height: 39px;line-height: 35px;text-align: left;font-size: 16px;border-bottom: 1px dashed darkgrey">
        <Icon type="ios-contact" />
        {{ $t("userInfo.piName")  }}：<Tag color="geekblue">{{ group.admin.name }}</Tag>
      </div>
      <div style="width: 100%;height: 39px;line-height: 35px;text-align: left;font-size: 16px;border-bottom: 1px dashed darkgrey">
        <Icon type="ios-mail" />
        {{ $t("userInfo.piEmail") }}：<Tag color="geekblue">{{ group.admin.email }}</Tag>
      </div>
      <div style="width: 100%;height: 39px;line-height: 35px;text-align: left;font-size: 16px;">
        <Icon type="ios-call" />
        {{ $t("userInfo.piPhone") }}：
      </div>
    </div>
    <div style="width: 25%;height: 120px;line-height:120px;font-weight: bold;font-size: 30px;vertical-align: top;
      display: inline-block;border-right: 1px dashed darkgrey;text-align: center;">
      {{ $t("userInfo.serviceRequester") }}
    </div>
    <div style="width: 25%;height: 120px;font-size: 30px;
      display: inline-block;text-align: center">
      <div style="width: 100%;height: 39px;line-height: 35px;text-align: left;font-size: 16px;border-bottom: 1px dashed darkgrey">
        <Icon type="ios-contact" />
        {{ $t("userInfo.requester")  }}：<Tag color="geekblue">{{ userInfo.name }}</Tag>
      </div>
      <div style="width: 100%;height: 39px;line-height: 35px;text-align: left;font-size: 16px;border-bottom: 1px dashed darkgrey">
        <Icon type="ios-mail" />
        {{ $t("userInfo.requesterEmail") }}：<Tag color="geekblue">{{ userInfo.email }}</Tag>
      </div>
      <div style="width: 100%;height: 39px;line-height: 35px;text-align: left;font-size: 16px;">
        <Icon type="ios-call" />
        {{ $t("userInfo.requesterPhone") }}：
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "userInfo",
  data : function (){
    return {
      group : {}
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      var _this = this;
      this.$axios.get("/home/getGroupInfo").then(function (res){
        if (res.data.code === "success"){
          _this.group = res.data.retMap.group;
        }else {
          _this.$Message.error(_this.$t(res.data.code));
        }
      }).catch(function (res){
        console.log(res);
        _this.$Message.error(_this.$t("err.groupErr"));
      })
    },
  },
  computed :{
    userInfo : function (){
      return this.$store.getters.getUser;
    }
  }

}
</script>

<style scoped>

</style>