<template>
  <div style="width: 100%">
    <Card :title="$t('task.taskList')">
      <div style="width: 100%;" v-for="item in taskList" :key="item.id">
        <raav-task @reload="initPage" :task="item" :options="options"></raav-task>
      </div>
    </Card>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import VLoading from "@/components/public/v-loading";
import RaavTask from "@/components/task/raavTask";

export default {
  name: "taskpage",
  components: {RaavTask, VLoading},
  data : function (){
    return {
      taskList : [],
      options : [],
      loading : false
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      var _this = this;
      this.$axios.get("/home/getTask").then(function (res){
        if (res.data.code === "success"){
          _this.taskList = res.data.retMap.tasks;
          _this.options = res.data.retMap.options;
        }else {
          console.log(res);
          _this.$Message.error(_this.$t(res.data.code));
        }
      }).catch(function (res){
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      });
    }
  },
  watch : {
    '$store.state.user' : function (){
      this.initPage();
    }
  }
}
</script>

<style scoped>

</style>