<template>
  <Card style="width: 100%">
    <div slot="title" style="display: inline-block;height: 30px">
      <span style="font-weight: bold;">{{task.taskname}}</span>
      &nbsp;
      <Tag v-if="task.before > 0">{{ $t("task.before") + task.before }}</Tag>
    </div>
    <template slot="extra">
      <!--   PI确认按钮   -->
      <Button style="margin-right: 10px"
              v-if="this.task.taskstatu === '00'"
              :disabled="!isPiConfirm"
              @click="showConfirmAlert">{{ $t("task.PiConfirm") }}
      </Button>
      <!--   用户撤回按钮   -->
      <Poptip
          confirm
          v-if="canReturn"
          :title="$t('task.deleteTask')"
          @on-ok="deleteTask"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
      >
        <Button type="error" style="margin-right: 10px">
          {{ $t("delete") }}
        </Button>
      </Poptip>

      <!--  导出服务单    -->
      <Button v-if="canExport" @click="downLoadServiceTable" style="margin-right: 10px;">{{
          $t("task.export")
        }}
      </Button>
      <!--   完成之后用户确认按钮   -->
      <Poptip
          confirm
          v-if="isCreater('02')"
          :disabled="!isCurrentUser"
          :title="$t('task.taskComplete')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @on-ok="updateTaskStatus('taskComplete','')"
      >
        <Button style="margin-right: 10px">{{ $t("task.cilentConfrim") }}</Button>
      </Poptip>
      <!-- 评价按钮 -->
      <Button v-if="isCreater('03')" @click="showEvaluation">{{ $t("task.evaluation") }}</Button>

      <!--   PI拒绝原因   -->
      <Tag color="error" v-if="task.taskstatu === '99'">{{ $t("task.piRefuse") + task.fail.reason }}</Tag>
      <!--   用户撤回原因   -->
      <Tag color="error" v-if="task.taskstatu === '98'">{{ $t("task.clientRefuse") + task.fail.reason }}</Tag>
      <!--   进行中任务   -->
      <div v-if="task.taskstatu === '01'" style="margin-right: 20px;display: inline-block;">
        <Tooltip :content="$t('task.processing')" placement="top-end">
          <img src="../../assets/todo.png" style="width: 30px">
        </Tooltip>
      </div>
      <!--   已完成状态   -->
      <div v-if="task.taskstatu === '90'" style="display: inline-block">
        <Tag color="success">{{ $t("task.completed") }}</Tag>
      </div>
    </template>
    <Table :columns="cols" :data="task.raavs">
      <template slot="materialProvided" slot-scope="{ row }">
        {{ getOptionsText(row.materialprovided) }}
      </template>
      <template slot="geneRisk" slot-scope="{ row }">
        {{ getOptionsText(row.generisk) }}
      </template>

      <template slot="seroType" slot-scope="{ row }">
        {{ getOptionsText(row.serotype) }}
      </template>

      <template slot="sharing" slot-scope="{ row }">
        <i-switch v-model="row.sharing" :disabled="true">
          <span slot="open">{{ $t("yes") }}</span>
          <span slot="close">{{ $t("no") }}</span>
        </i-switch>
      </template>

      <template slot="status" slot-scope="{row, index}">
        <div style="height: 50px">
          <!--          <Slider :value="task.raavs[index].curstatu" :min="0" :max="6" show-stops :marks="marks"-->
          <!--                  :disabled="!isVecotrEditor"-->
          <!--                  :tip-format="hideFormat"-->
          <!--                  style="margin-left: 10px;"></Slider>-->
          <Progress :percent="curPercent(row,index)" :hide-info="true" status="active"/>
          {{ marks[row.curstatu] }}
          <div style="display: inline-block; float: right">
            <Select v-model="row.curstatu" size="small" :transfer="true"
                    :disabled="row.curstatu === '06'"
                    @on-change="changeCurrentItem(row)"
                    v-if="isVecotrEditor && row.curstatu !== '06'">
              <Option v-for="(value, name) in marks" :value="name" :key="name">{{ value }}</Option>
            </Select>
            <div v-if="row.curstatu === '06'">
              <Tag color="geekblue">{{ $t('raav.vol') + ":" + row.vol }}</Tag>
              <Tag color="geekblue">{{ $t('raav.titer') + ":" + row.titer }}</Tag>
            </div>
          </div>
        </div>
      </template>

      <template slot="operator" slot-scope="{ row }">
        <Button @click="editRow(row)"
                size="small" :disabled="!(canEdit(row.curstatu) && isCurrentUser)">{{ $t("edit") }}
        </Button>
      </template>
    </Table>
    <taskevadetail :evaluation="task.evaluation"></taskevadetail>
    <Modal
        :title="$t('task.enterResult')"
        :mask-closable="false"
        @on-ok="saveFinishData(finishData)"
        @on-cancel="cancelFinish"
        v-model="finishRowFlag">
      <Form ref="finishValidate" :model="finishData" :rules="finishRul" :label-width="150">
        <FormItem :label="$t('raav.vol')" prop="vol">
          <InputNumber v-model="finishData.vol" :min="0" style="width: 100%"></InputNumber>
        </FormItem>

        <FormItem :label="$t('raav.titer')" prop="titer">
          <InputNumber v-model="finishData.titer" :min="0" style="width: 100%"></InputNumber>
        </FormItem>
      </Form>
    </Modal>

    <!--  修改已提交订单  -->
    <Modal
        v-model="editFlag"
        :title="$t('edit')"
        :mask-closable="false"
        @on-ok="updateRow">
      <Form ref="editValidate" :model="editObj" :rules="editObjRul" :label-width="150">
        <FormItem :label="$t('raav.constructName')" prop="constructname">
          <Input v-model="editObj.constructname" placeholder="Enter constructname"></Input>
        </FormItem>

        <FormItem :label="$t('raav.materialProvided')" prop="materialprovided">
          <Select v-model="editObj.materialprovided" style="width:100%" :transfer="true">
            <Option v-for="item in getOptions('materialProvided')" :key="item.id" :value="item.id">{{
                item.name
              }}
            </Option>
          </Select>
        </FormItem>

        <FormItem :label="$t('raav.geneRisk')" prop="generisk">
          <Select v-model="editObj.generisk" style="width:100%" :transfer="true">
            <Option v-for="item in getOptions('geneRisk')" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem :label="$t('raav.seroType')" prop="serotype">
          <Select v-model="editObj.serotype" style="width:100%" :transfer="true">
            <Option v-for="item in getOptions('seroType')" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem :label="$t('raav.sharing')" prop="sharing">
          <i-switch v-model="editObj.sharing">
            <span slot="open">{{ $t("yes") }}</span>
            <span slot="close">{{ $t("no") }}</span>
          </i-switch>
        </FormItem>

        <FormItem :label="$t('raav.count')" prop="requestnum">
          <InputNumber v-model="editObj.requestnum" :min="1" style="width: 100%"></InputNumber>
        </FormItem>

        <FormItem :label="$t('raav.remark')" prop="remark">
          <Input v-model="editObj.remark" placeholder="Enter something..." style="width: 100%"/>
        </FormItem>
      </Form>
    </Modal>

    <evaluation-alert ref="evaluationAlert" @commitFun="commitEvaluation"></evaluation-alert>
    <comfirm-alert ref="confirmAlert" @confirmFun="piConfirm"></comfirm-alert>
    <refuse-alert :modal-title="$t('delete')" ref="refuseAlert" @confirmFun="realRefuse"></refuse-alert>
    <v-loading :show="loading"></v-loading>
  </Card>
</template>

<script>
import VLoading from "@/components/public/v-loading";
import ComfirmAlert from "@/components/public/comfirmAlert";
import EvaluationAlert from "@/components/public/evaluationAlert";
import Taskevadetail from "@/components/public/taskevadetail";
import RefuseAlert from "@/components/public/refuseAlert";
import util from "@/components/public/util";

export default {
  name: "raavTask",
  components: {RefuseAlert, Taskevadetail, EvaluationAlert, ComfirmAlert, VLoading},
  props: {
    task: Object,
    options: Array
  },
  data: function () {
    return {
      confirmFlag: false,
      editObj: {},
      editObjRul: {
        constructname: [
          {required: true, message: 'Enter constructname', trigger: 'blur'},
        ],
        requestnum: [
          {type: "number", required: true, message: 'Enter number', trigger: 'blur'}
        ]
      },
      editFlag: false,
      loading: false,
      cols: [],
      marks: {
        "00": this.$t("task.wait"),
        "01": this.$t('task.receive'),
        "02": this.$t('task.prepare'),
        "03": this.$t('task.package'),
        "04": this.$t('task.purification'),
        "05": this.$t('task.testing'),
        "06": this.$t('task.complete'),
      },
      finishRowFlag: false,
      finishData: {},
      finishRul: {
        vol: [{type: "number", required: true, message: 'Enter number', trigger: 'change'}],
        titer: [{type: "number", required: true, message: 'Enter number', trigger: 'change'}]
      }
    }
  },
  beforeMount() {
    this.initCols();
  },
  methods: {
    downLoadServiceTable: function () {
      var postData = {
        taskId: this.task.id
      }
      util.downLoad(postData, "/task/downLoadServiceTable", this.task.taskname + ".pdf");
    },
    saveFinishData: function (row) {
      var _this = this;
      this.$refs.finishValidate.validate((valid) => {
        if (valid) {
          _this.realChageItemStatu(row);
        } else {
          _this.finishRowFlag = true;
          _this.$Message.error(_this.$t("err.placeEnter"));
        }
      });
    },
    cancelFinish: function () {
      this.$emit("reload");
    },
    commitEvaluation: function (stars, evaluation) {
      this.$(this.$refs.evaluationAlert.$el).modal("hide");
      var post = {
        stars: stars,
        evaluation: evaluation,
        taskId: this.task.id
      }
      var _this = this;
      this.$axios.post("/task/evaluation/commit", post).then(function () {
        _this.$Message.success(_this.$t("commitSuccess"));
        _this.$emit("reload");
      }).catch(function (res) {
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    showEvaluation: function () {
      this.$(this.$refs.evaluationAlert.$el).modal("show");
    },
    realRefuse: function (reason) {
      this.$(this.$refs.refuseAlert.$el).modal("hide");
      this.updateTaskStatus("delete", reason);
    },
    deleteTask: function () {
      this.$(this.$refs.refuseAlert.$el).modal("show");
    },
    showConfirmAlert: function () {
      this.$(this.$refs.confirmAlert.$el).modal("show");
    },
    realChageItemStatu: function (row) {
      var post = {
        raav: JSON.stringify(row)
      }
      console.log(row);
      var _this = this;
      this.$axios.post("/task/raav/updateStatu", post).then(function () {
        _this.$Message.success(_this.$t("commitSuccess"));
        _this.$emit("reload");
      }).catch(function (res) {
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    changeCurrentItem: function (row) {
      console.log(row);
      if (row.curstatu === "06") {
        this.finishData = row;
        this.finishRowFlag = true;
      } else {
        this.realChageItemStatu(row);
      }
    },
    curPercent: function (row, index) {
      console.log(index)
      return parseInt(row.curstatu) * 100 / 6;
    },
    piConfirm: function (flag, reason) {
      this.$(this.$refs.confirmAlert.$el).modal("hide");
      if (flag) {
        this.updateTaskStatus("agree", reason);
      } else {
        this.updateTaskStatus("refuse", reason);
      }
    },
    updateTaskStatus: function (falg, reason) {
      var post = {
        taskId: this.task.id,
        flag: falg,
        reason: reason
      };
      this.loading = true;
      var _this = this;
      this.$axios.post("/task/updateStatus", post).then(function (res) {
        _this.loading = false;
        if (res.data.code === "success") {
          _this.$Message.success(_this.$t("commitSuccess"));
          _this.$emit("reload");
        } else {
          console.log(res);
          _this.$Message.error(_this.$t(res.data.code));
        }
      }).catch(function (res) {
        _this.loading = false;
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    updateRow: function () {
      var _this = this;
      this.$refs['editValidate'].validate((valid) => {
        if (valid) {
          var post = {
            raav: JSON.stringify(_this.editObj)
          }
          _this.loading = true;
          this.$axios.post("/task/updateRaav", post).then(function (res) {
            _this.loading = false;
            if (res.data.code === "success") {
              _this.$Message.success(_this.$t("commitSuccess"));
              _this.$emit("reload");
            } else {
              _this.$Message.error(_this.$t(res.data.code));
            }
          }).catch(function (res) {
            _this.loading = false;
            console.log(res);
            _this.$Message.error(_this.$t("err.systemErr"));
          })
        } else {
          _this.$Message.error(_this.$t("err.placeEnter"));
          _this.editFlag = true;
        }
      })

    },
    getOptions: function (flag) {
      var arr = new Array();
      if (this.options === undefined) {
        return arr;
      }
      for (var i = 0; i < this.options.length; i++) {
        var option = this.options[i];
        if (option.pagetype === "raav"
            && option.selecttype === flag
            && option.curstatu !== "09") {
          arr.push(option);
        }
      }
      return arr;
    },
    canEdit: function (status) {
      if (this.task.taskstatu.startsWith("9")) {
        return false;
      }
      if (parseInt(status) < 2) {
        return true;
      } else {
        return false
      }
    },
    hideFormat() {
      return null;
    },
    editRow: function (row) {
      this.editObj = JSON.parse(JSON.stringify(row));
      this.editFlag = true;
    },
    getOptionsText: function (id) {
      if (this.options === undefined) {
        return "";
      }
      for (var i = 0; i < this.options.length; i++) {
        var option = this.options[i];
        if (option.id === id) {
          return option.name;
        }
      }
      return "";
    },

    initCols: function () {

      this.cols.push({
        title: this.$t('raav.constructName'),
        key: 'constructname',
        width: 150
      });

      this.cols.push({
        title: this.$t('raav.materialProvided'),
        slot: 'materialProvided'
      });

      this.cols.push({
        title: this.$t('raav.geneRisk'),
        slot: 'geneRisk'
      });

      this.cols.push({
        title: this.$t('raav.seroType'),
        slot: 'seroType'
      });

      this.cols.push({
        title: this.$t('raav.sharing'),
        slot: 'sharing',
        width: 100
      });

      this.cols.push({
        title: this.$t('raav.count'),
        key: 'requestnum',
        width: 60
      });

      this.cols.push({
        title: this.$t('raav.remark'),
        key: 'remark'
      });

      this.cols.push({
        title: this.$t('task.process'),
        slot: 'status',
        width: 450
      });

      //action
      this.cols.push({
        title: this.$t('task.operator'),
        slot: 'operator',
      });
    },
    isCreater: function (taskStatu) {
      if (this.task.taskstatu === taskStatu && this.$store.getters.isCurrentUser(this.task.creater)) {
        return true;
      }
      return false;
    }
  },
  computed: {
    isVecotrEditor: function () {
      if (this.task.taskstatu === '01' && this.$store.getters.isVectorEditor) {
        return true;
      }
      return false;
    },
    isCurrentUser: function () {
      return this.$store.getters.isCurrentUser(this.task.creater)
    },
    isPiConfirm: function () {
      if (this.task.taskstatu === "00"
          && this.$store.getters.isCurrentUser(this.task.groupAdmin)) {
        return true;
      } else {
        return false;
      }
    },
    canReturn: function () {
      if (this.task.taskstatu != '00' && this.task.taskstatu != '01') {
        return false;
      }
      if (!this.$store.getters.isCurrentUser(this.task.creater)) {
        return false;
      }
      for (var i = 0; i < this.task.raavs.length; i++) {
        if (parseInt(this.task.raavs[i].curstatu) > 1) {
          return false;
        }
      }
      return true;
    },
    canExport: function () {
      if (!this.$store.getters.isVectorEditor) {
        return false;
      }
      if (this.task.taskstatu === "02"
          || this.task.taskstatu === "03" ||
          this.task.taskstatu === "90") {
        return true;
      } else {
        return false;
      }
    },

  }
}
</script>

<style scoped>

</style>