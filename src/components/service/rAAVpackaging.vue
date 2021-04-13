<template>
  <div style="margin-bottom: 50px">
    <!-- 知情通知 开始-->
    <Modal v-model="tipShow" width="360" :closable="false" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:left">
        <Icon type="ios-information-circle"></Icon>
        <span>{{ $t("raav.tipTitle") }}</span>
      </p>
      <div style="text-align:left;font-size: 14px">
        <p>{{ $t("raav.tip1") }}</p>
        <p>{{ $t("raav.tip2") }}</p>
        <p>{{ $t("raav.tip3") }}</p>
        <p>{{ $t("raav.tip4") }}</p>
        <Divider/>
        <div style="width: 100%;text-align: center;">
          <Checkbox v-model="iknow" style="font-size: 16px">{{ $t("raav.ikonw") }}</Checkbox>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="tipShow = !tipShow" :disabled="!iknow">{{ $t("confirm") }}
        </Button>
      </div>
    </Modal>

    <Card style="width:90%;margin-left: 5%;margin-top: 20px">
      <h2>{{ $t("raav.title") }}</h2>
    </Card>
    <!-- 知情通知 结束-->
    <div style="width: 90%;margin-left: 5%;">
      <user-info></user-info>
    </div>

    <div style="width: 90%;margin-left: 5%;margin-top: 10px">
      <Card style="width:100%;margin-top: 20px">
        <h3 style="display: inline-block">{{ $t("raav.projectInfo") }}</h3>
        <div style="display: inline-block;float: right">
          <Button type="primary" @click="addNewRow" style="margin: 0 5px">{{ $t("add") }}</Button>
          <Button type="success" @click="commitTask" style="margin: 0 5px">{{ $t("commit") }}</Button>
        </div>
      </Card>
      <Table stripe border :columns="cols" :data="raavList">
        <template slot="constructName" slot-scope="{ row,index }">
          <Input v-model="raavList[index].constructName" placeholder="Vector name or plasmid #" style="width: 100%"/>
        </template>

        <template slot="materialProvided" slot-scope="{ row,index }">
          <Select v-model="raavList[index].materialProvided" style="width:100%" :transfer="true">
            <Option v-for="item in mpOptions" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
        </template>

        <template slot="geneRisk" slot-scope="{ row,index }">
          <Select v-model="raavList[index].geneRisk" style="width:100%" :transfer="true">
            <Option v-for="item in grOptions" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
        </template>

        <template slot="seroType" slot-scope="{ row,index }">
          <Select v-model="raavList[index].seroType" style="width:100%" :transfer="true">
            <Option v-for="item in stOptions" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
          <Input v-if="isOtherSeroType(row.seroType)" v-model="raavList[index].otherSero" placeholder="enter other serotype"/>
        </template>

        <template slot="sharing" slot-scope="{ row,index }">
          <i-switch v-model="raavList[index].sharing">
            <span slot="open">{{ $t("yes") }}</span>
            <span slot="close">{{ $t("no") }}</span>
          </i-switch>
        </template>

        <template slot="count" slot-scope="{ row,index }">
          <InputNumber v-model="raavList[index].requestnum" :min="1" style="width: 100%"></InputNumber>
        </template>

        <template slot="remark" slot-scope="{ row,index }">
          <Input v-model="raavList[index].remark" placeholder="Enter something..." style="width: 100%"/>
        </template>

        <template slot="action" slot-scope="{ row }">
          <Poptip
              confirm
              :transfer="true"
              :disabled="raavList.length <= 1"
              placement="top-end"
              title="Are you sure you want to delete this item?"
              @on-ok="deleteItem(row.key)">
            <Button size="small" type="error" :disabled="raavList.length <= 1">{{ $t("delete") }}</Button>
          </Poptip>
        </template>
      </Table>
      <Card style="width:100%;" :title="$t('remark')">
        <Input v-model="taskRemark" type="textarea" :rows="3" placeholder="Enter something..." />
      </Card>
    </div>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import UserInfo from "@/components/public/userInfo";
import uuidv1 from 'uuid/v1'
import VLoading from "@/components/public/v-loading";
import util from "@/components/public/util";

export default {
  name: "rAAVpackaging",
  components: {VLoading, UserInfo},
  data: function () {
    return {
      mpOptions: [],
      grOptions: [],
      stOptions: [],
      loading: false,
      tipShow: true,
      iknow: false,
      taskRemark : "",
      raavList: [{
        key: uuidv1(),
        constructName: "",
        materialProvided: "",
        geneRisk: "",
        seroType: "",
        sharing: false,
        requestnum: 1,
        remark: ""
      }],
      cols: []
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    checkData: function () {
      for (var i = 0; i < this.raavList.length; i++) {
        var raav = this.raavList[i];
        if (util.isNull(raav.constructName)) {
          this.$Message.error(this.$t("raav.constructName") + this.$t("notnull"))
          return false;
        }

        if (util.isNull(raav.materialProvided)) {
          this.$Message.error(this.$t("raav.materialProvided") + this.$t("notnull"))
          return false;
        }

        if (util.isNull(raav.geneRisk)) {
          this.$Message.error(this.$t("raav.geneRisk") + this.$t("notnull"))
          return false;
        }

        if (util.isNull(raav.seroType)) {
          this.$Message.error(this.$t("raav.seroType") + this.$t("notnull"))
          return false;
        }

        if (this.isOtherSeroType(raav.seroType) && util.isNull(raav.otherSero)){
          this.$Message.error(this.$t("raav.seroType") + this.$t("notnull"))
          return false;
        }
        if (raav.requestnum === "" || raav.requestnum === null || raav.requestnum === undefined){
          this.$Message.error(this.$t("raav.count") + this.$t("notnull"))
          return false;
        }
      }
      return true;
    },
    commitTask: function () {
      if (!this.checkData()) {
        return;
      }
      this.raavList.map(item =>{
        if (this.isOtherSeroType(item.seroType)){
          item.seroType = item.otherSero
        }
      });
      var post = {
        list: JSON.stringify(this.raavList),
        taskRemark : this.taskRemark
      }
      this.loading = true;
      var _this = this;
      this.$axios.post("/task/commitraav", post).then(function (res) {
        _this.loading = false;
        if (res.data.code === "success") {
          console.log(res);
          _this.$router.push("/home");
        } else {
          _this.$Message.error(_this.$t(res.data.code));
        }
      }).catch(function (res) {
        _this.loading = false;
        console.log(res);
        _this.$t("err.systemErr");
      });
    },
    addNewRow: function () {
      console.log(this.raavList)
      this.raavList.push({
        key: uuidv1(),
        constructName: "",
        materialProvided: "",
        geneRisk: "",
        seroType: "",
        sharing: false,
        requestnum: 1,
        remark: ""
      });
    },
    deleteItem: function (key) {
      const tmpList = [...this.raavList];
      this.raavList = tmpList.filter(item => item.key !== key);
    },
    isOtherSeroType: function (id) {
      for (var i = 0; i < this.stOptions.length; i++) {
        if (this.stOptions[i].id === id && this.stOptions[i].name === "Other") {
          return true;
        }
      }
      return false;
    },
    initPage: function () {
      this.initCols();
      var _this = this;
      this.$axios.get("/task/initRaavTask").then(function (res) {
        if (res.data.code === "success") {
          _this.mpOptions = res.data.retMap.mpOptions;
          _this.grOptions = res.data.retMap.grOptions;
          _this.stOptions = res.data.retMap.stOptions;
        } else {
          _this.$Message.error(_this.$t(res.data.code));
        }
      }).catch(function (res) {
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    initCols: function () {
      this.cols = new Array();

      this.cols.push({
        type: 'index',
        width: 60,
        align: 'center'
      });

      this.cols.push({
        title: this.$t("raav.constructName"),
        slot: "constructName"
      });

      this.cols.push({
        title: this.$t("raav.materialProvided"),
        slot: 'materialProvided'
      });

      this.cols.push({
        title: this.$t("raav.geneRisk"),
        slot: 'geneRisk'
      });

      this.cols.push({
        title: this.$t("raav.seroType"),
        slot: 'seroType'
      });

      this.cols.push({
        title: this.$t("raav.sharing"),
        slot: 'sharing',
        width: "100px"
      });

      this.cols.push({
        title: this.$t("raav.count"),
        slot: 'count',
        width: "100px"
      });

      this.cols.push({
        title: this.$t("raav.remark"),
        slot: 'remark'
      });

      this.cols.push({
        title: 'Action',
        slot: 'action',
        width: 100,
        align: 'center'
      })
    }
  },
  computed: {}
}
</script>

<style scoped>

</style>