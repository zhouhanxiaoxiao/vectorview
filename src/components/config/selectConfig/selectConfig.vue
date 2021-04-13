<template>
  <div>
    <Tabs type="card">
      <TabPane :label="$t('configPage.raavSelect')">
        <raav-select @loading="showLoading"></raav-select>
      </TabPane>
      <TabPane label="标签二">标签二的内容</TabPane>
      <TabPane label="标签三">标签三的内容</TabPane>
    </Tabs>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import RaavSelect from "@/components/config/selectConfig/raavSelect";
import VLoading from "@/components/public/v-loading";
export default {
  name: "selectConfig",
  components: {VLoading, RaavSelect},
  data : function (){
    return {
      loading : false
    }
  },
  methods : {
    showLoading : function (flag){
      this.loading = flag;
    }
  }
}
</script>

<style scoped>

</style>