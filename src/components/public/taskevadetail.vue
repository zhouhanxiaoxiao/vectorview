<template>
  <div>
    <Card>
      <div slot="title">
        <b>{{ $t("task.evaluation") }}</b>
        <Rate allow-half v-model="evaluation.score" disabled style="font-size: 20px !important;margin-left: 20px"/>
      </div>
      <div>
        <Alert show-icon>
          <div style="display: inline-block;font-weight: bold;"> {{ creater.name }}</div>
          <div style="display: inline-block;margin-left: 20px;font-size: 12px;color: darkgrey">
            {{ format(evaluation.createtime) }}
          </div>
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
          <template slot="desc">
            {{ evaluation.evaluation }}
            <div v-if="files.length > 0">
              <Button style="display: inline-block;margin-right: 10px" icon="ios-document"
                      v-for="item in files" :key="item.id" @click="downloadFile(item.id, item.realname)">
                {{ item.realname }}
              </Button>
            </div>
          </template>
        </Alert>
      </div>
      <Collapse simple>
        <Panel name="1">
          {{ $t("task.reply") }}
          <div slot="content">
            <Alert v-for="item in comments" :key="item.id">
              <div style="display: inline-block;font-weight: bold;"> {{ item.username }}</div>
              <div style="display: inline-block;margin-left: 20px;font-size: 12px;color: darkgrey">
                {{ format(item.createtime) }}
              </div>
              <template slot="desc">
                {{ item.comments }}
                <div v-if="item.files.length > 0">
                  <Button style="display: inline-block;margin-right: 10px" icon="ios-document"
                          v-for="file in item.files" :key="file.id" @click="downloadFile(file.id, file.realname)">
                    {{ file.realname }}
                  </Button>
                </div>
              </template>
            </Alert>

            <Input style="width: 100%" v-model="reply" type="textarea" :rows="2" placeholder="Enter something..."/>
            <Button type="primary" style="margin-top: 10px" :disabled="reply.length === 0" @click="submitComment">
              <span v-if="!loading">{{ $t("task.reply") }}</span>
              <span v-else>Loading...</span>
            </Button>
            <Upload :action="uploadUrl"
                    :show-upload-list="false"
                    :on-success="fileUploadSuccess"
                    multiple
                    class="upload-btn">
              <Button icon="ios-cloud-upload-outline">Upload files</Button>
            </Upload>
          </div>
        </Panel>
      </Collapse>
    </Card>
  </div>
</template>

<script>
import util from "@/components/public/util";
import {formatDate} from "@/components/public/date";

export default {
  name: "taskevadetail",
  props: {
    evaluation: Object
  },
  data: function () {
    return {
      reply: "",
      comments: [],
      loading: false,
      creater: {},
      files: [],
      uploadFilesIds : [],
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    fileUploadSuccess : function (response, file, fileList){
      console.log(response, file, fileList);
      this.uploadFilesIds.push(...response.retMap.fileIds);
      this.$Message.success(this.$t("commitSuccess"));
    },
    downloadFile: function (id, name) {
      var postData = {
        id: id
      }
      util.downLoad(postData, "/file/download", name);
    },
    format: function (date) {
      return formatDate(new Date(date), "yyyy-MM-dd hh:mm:ss");
    },
    initPage: function () {
      var postData = {
        detailId: this.evaluation.id,
        creater: this.evaluation.creater
      }
      var _this = this;
      this.$axios.post("/task/evaluation/details", postData).then(function (res) {
        console.log("=============", res);
        if (res.data.code === "success") {
          _this.comments = res.data.retMap.comments;
          _this.creater = res.data.retMap.creater;
          _this.files = res.data.retMap.files;
        } else {
          _this.$Message.error(_this.$t(res.data.code));
          console.log(res);
        }
      }).catch(function (res) {
        _this.$Message.error(_this.$t("err.systemErr"));
        console.log(res);
      })
    },
    submitComment: function () {
      var postData = {
        detailId : this.evaluation.id,
        reply: this.reply,
        uploadFiles : JSON.stringify(this.uploadFilesIds)
      }
      var _this = this;
      this.loading = true;
      this.$axios.post("/task/suggest/commit", postData).then(function (res) {
        _this.loading = false;
        if (res.data.code === "success") {
          _this.reply = "";
          _this.uploadFilesIds = new Array();
          util.success("commitSuccess");
          _this.initPage();
        } else {
          util.error(res.data.code);
        }
      }).catch(function (res) {
        _this.loading = false;
        util.error("err.systemErr");
        console.log(res);
      });
    }
  },
  computed : {
    uploadUrl : function (){
      return this.$axios.defaults.baseURL + "/file/commonUpload";
    }
  }
}
</script>

<style scoped>
.upload-btn{
  display: inline-block;
  vertical-align:top;
  margin-top: 10px;
  margin-left: 10px;
}
</style>