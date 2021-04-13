<template>
  <div style="width: 100%;">
    <Card style="width:100%" :title="$t('configPage.taskConfirm')">
      <div class="row">
        <div class="col-sm-4 col-md-3 col-lg-3 col-xl-3" style="margin-bottom: 20px"  v-for="item in groups" :key="item.id">
          <Card style="width:100%">
            <div style="text-align:left;font-weight: bold;display: inline-block">
              {{ item.groupname }}
            </div>
            <i-switch size="large" style="display: inline-block;float: right" v-model="item.email"
                      @click.native="changeStatu(item)">
              <span slot="open">{{ $t("yes") }}</span>
              <span slot="close">{{ $t("no") }}</span>
            </i-switch>
          </Card>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: "piConfirmConfig",
  data : function (){
    return {
      groups : []
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    initPage(){
      var _this = this;
      this.$axios.get("/config/getAllEmailConfig").then(function (res){
        _this.groups = res.data.retMap.groupSettings;
      }).catch(function (res){
        console.log(res);
      })
    },
    changeStatu : function (row){
      var post = {
        setting : JSON.stringify(row)
      }
      var _this = this;
      this.$axios.post("/config/changePiConfirm", post).then(function (res){
        console.log(res);
        _this.initPage();
        _this.$Message.success(_this.$t("commitSuccess"));
      }).catch(function (res){
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      });
    }
  }
}
</script>

<style scoped>

</style>