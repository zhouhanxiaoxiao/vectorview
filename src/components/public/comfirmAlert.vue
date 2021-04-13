<template>
  <div class="modal fade" id="comfirmAlert" tabindex="-1" aria-labelledby="comfirmAlertLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="comfirmAlertLabel">{{$t("task.approve")}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group row">
            <label for="staticEmail" class="col-sm-4 col-form-label">{{ this.$t('task.agreeTask') }}</label>
            <div class="col-sm-8" id="staticEmail">
              <i-switch v-model="flag">
                <span slot="open">{{ $t("yes") }}</span>
                <span slot="close">{{ $t("no") }}</span>
              </i-switch>
            </div>
          </div>
          <div class="form-group row">
            <label for="reason" class="col-sm-4 col-form-label">{{ $t("reason") }}</label>
            <div class="col-sm-8" id="reason">
              <Input v-model="reason" type="textarea" :rows="3" placeholder="If you do not agree, please fill in the reason" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <Button data-dismiss="modal">{{ $t("cancel") }}</Button>
          <Button type="primary" @click="commitData">{{ $t("confirm") }}</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "comfirmAlert",
  data : function (){
    return {
      reason : "",
      flag : false
    }
  },
  methods : {
    commitData : function (){
      if (!this.flag && this.reason.length === 0){
        this.$Message.error(this.$t("task.placeEnterReason"));
        return;
      }
      this.$("comfirmAlert").modal("hide");
      this.$emit("confirmFun", this.flag, this.reason);
    }
  }
}
</script>

<style scoped>

</style>