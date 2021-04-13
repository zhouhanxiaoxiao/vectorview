<template>
  <div class="modal fade" id="evaluationAlert" tabindex="-1" aria-labelledby="evaluationAlertLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="evaluationAlertLabel">{{$t("task.evaluation")}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="text-align: center">
          <div class="form-group">
            <label for="stars">{{ $t("task.stars") }}</label>
            <div id="stars">
              <Rate allow-half v-model="stars" style="font-size: 40px !important;"/>
            </div>
          </div>
          <div class="form-group">
            <label for="evaluation">{{ $t("task.suggest") }}</label>
            <Input id="evaluation" v-model="evaluation" type="textarea" :autosize="{minRows: 4,maxRows: 10}" placeholder="Enter something..." />
          </div>
          <div style="width: 100%;">
            <Upload
                multiple
                :show-upload-list="false"
                :data="uploadData"
                type="drag"
                @on-success="fileUploadSuccess"
                :action="uploadUrl">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>Click or drag files here to upload</p>
              </div>
            </Upload>
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
  name: "evaluationAlert",
  data : function (){
    return{
      stars : 2.5,
      evaluation : ""
    }
  },
  methods : {
    fileUploadSuccess : function (response, file, fileList){
      console.log(response, file, fileList);
      this.$Message.success(this.$t("commitSuccess"));
    },
    commitData : function (){
      this.$emit("commitFun", this.stars, this.evaluation);
    }
  },
  computed : {
    uploadUrl : function (){
      return this.$axios.defaults.baseURL + '/file/commonUpload'
    },
    uploadData : function (){
      console.log(this.evaluation.id)
      return {
        detailId : "222"
      }
    }
  }
}
</script>

<style scoped>

</style>