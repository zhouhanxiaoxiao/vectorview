<template>
  <div style="width: 100%;">
    <div style="width: 90%;margin-left: 5%;margin-top: 50px">
      <taskpage></taskpage>
    </div>
  </div>
</template>

<script>
import Taskpage from "@/components/task/taskpage";
export default {
  name: "homeView",
  components: {Taskpage}
}
</script>

<style scoped>

</style>