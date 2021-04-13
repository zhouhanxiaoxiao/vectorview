<template>
  <div style="width: 90%;margin-top: 20px;margin-left: 5%;margin-bottom: 50px">
    <div class="row">
      <div class="col-sm-4 col-md-3 col-lg-3 col-xl-3 service-item">
        <Card style="width:100%" @click.native="gotorAAV">
          <div style="text-align:center">
            <img src="../../assets/backVir.png" style="width: 100%">
            <Divider/>
            <h5>{{ $t("rAAVpackaging") }}</h5>
          </div>
        </Card>
      </div>
      <div class="col-sm-4 col-md-3 col-lg-3 col-xl-3 service-item">
        <Card style="width:100%">
          <div style="text-align:center">
            <img src="../../assets/backVir.png" style="width: 100%">
            <Divider/>
            <h5>rAAV包装</h5>
          </div>
        </Card>
      </div>
      <div class="col-sm-4 col-md-3 col-lg-3 col-xl-3 service-item">
        <Card style="width:100%">
          <div style="text-align:center">
            <img src="../../assets/backVir.png" style="width: 100%">
            <Divider/>
            <h5>rAAV包装</h5>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "service",
  methods : {
    gotorAAV : function (){
      this.$router.push("/rAAV");
    }
  }
}
</script>

<style scoped>
.service-item {
  margin-top: 10px;
  cursor: pointer;
}
</style>