<template>
  <div style="width: 100%">
    <div class="row">
      <!--   材料提供   -->
      <div class="col-sm-4 col-md-4 col-lg-4 col-xl-4 service-item">
        <Card style="width:100%">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            {{ $t("raav.materialProvided") }}
          </p>
          <Button slot="extra" size="small" type="primary" @click="addMaterialProvided('materialProvided')">{{ $t("add") }}</Button>
          <ul>
            <li style="list-style-type:none" v-for="item in mpOptions" :key="item.id">
              <div style="width: 100%;margin-top: 10px">
                {{ item.name }}
                <Poptip
                    confirm
                    style="float: right"
                    :transfer="true"
                    placement="top-end"
                    title="Are you sure you want to delete this item?"
                    @on-ok="deleteOption(item.id)">
                  <Button style="float: right" size="small" type="error">{{ $t("delete") }}</Button>
                </Poptip>
              </div>
            </li>
          </ul>
        </Card>
      </div>

      <!--   表达基因风险性   -->
      <div class="col-sm-4 col-md-4 col-lg-4 col-xl-4 service-item">
        <Card style="width:100%">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            {{ $t("raav.geneRisk") }}
          </p>
          <Button slot="extra" size="small" type="primary" @click="addMaterialProvided('geneRisk')">{{ $t("add") }}</Button>
          <ul>
            <li style="list-style-type:none" v-for="item in grOptions" :key="item.id">
              <div style="width: 100%;margin-top: 10px">
                {{ item.name }}
                <Poptip
                    style="float: right"
                    confirm
                    :transfer="true"
                    placement="top-end"
                    title="Are you sure you want to delete this item?"
                    @on-ok="deleteOption(item.id)">
                  <Button size="small" type="error">{{ $t("delete") }}</Button>
                </Poptip>
              </div>
            </li>
          </ul>
        </Card>
      </div>

      <!--   血清型   -->
      <div class="col-sm-4 col-md-4 col-lg-4 col-xl-4 service-item">
        <Card style="width:100%">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            {{ $t("raav.seroType") }}
          </p>
          <Button slot="extra" size="small" type="primary" @click="addMaterialProvided('seroType')">{{ $t("add") }}</Button>
          <ul>
            <li style="list-style-type:none" v-for="item in stOptions" :key="item.id">
              <div style="width: 100%;margin-top: 10px">
                {{ item.name }}
                <Poptip
                    style="float: right"
                    confirm
                    :transfer="true"
                    placement="top-end"
                    title="Are you sure you want to delete this item?"
                    @on-ok="deleteOption(item.id)">
                  <Button size="small" type="error">{{ $t("delete") }}</Button>
                </Poptip>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
    <Modal
        v-model="addNewFlag"
        :title="$t('add')"
        @on-ok="commitNewOption">
      <Form ref="selValidate" :model="sel" :rules="selRules" :label-width="120">
        <FormItem :label="$t('raav.optionName')" prop="name">
          <Input v-model="sel.name" :placeholder="$t('raav.optionName')"></Input>
        </FormItem>
        <FormItem :label="$t('raav.optionEnName')" prop="enName">
          <Input v-model="sel.enName" :placeholder="$t('raav.optionEnName')"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "raavSelect",
  data : function (){
    return {
      loading : true,
      addNewFlag : false,
      mpOptions : [],
      grOptions : [],
      stOptions : [],

      sel : {
        name : "",
        enName : "",
        selecttype : "",
        pagetype : "raav"
      },
      selRules :{
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        enName: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
      }
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    deleteOption : function (id){
      var post = {
        id : id
      }
      this.$emit("loading", true);
      var _this = this;
      this.$axios.post("/config/deleteOption", post).then(function (res){
        _this.$emit("loading", false);
        if(res.data.code === "success"){
          _this.initPage();
        }else {
          _this.$Message.error(_this.$t(res.data.code));
        }
      }).catch(function (res){
        _this.$emit("loading", false);
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    addMaterialProvided : function (type){
      this.sel.selecttype = type;
      this.addNewFlag = true;
    },
    commitNewOption : function (){
      var _this = this;
      this.$refs['selValidate'].validate((valid)=>{
        if (valid){
          _this.$emit("loading", true);
          var postData = {
            option : JSON.stringify(_this.sel)
          }
          _this.$axios.post("/config/addNewOption", postData).then(function (res){
            _this.$emit("loading", false);
            if(res.data.code === "success"){
              _this.addNewFlag = false;
              _this.initPage();
            }else {
              _this.$Message.error(_this.$t(res.data.code));
            }
          }).catch(function (res){
            _this.$emit("loading", false);
            console.log(res);
            _this.$Message.error(_this.$t("err.systemErr"));
          });
        }else {
          _this.addNewFlag = true;
          _this.$Message.error(_this.$t("err.placeEnter"));
        }
      });
    },
    initPage : function (){
      var _this = this;
      this.$axios.get("/config/initRaavSelect").then(function (res){
        if(res.data.code === "success"){
          _this.mpOptions = res.data.retMap.mpOptions;
          _this.grOptions = res.data.retMap.grOptions;
          _this.stOptions = res.data.retMap.stOptions;
        }else {
          _this.$Message.error(_this.$t(res.data.code));
        }
      }).catch(function (res){
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    }
  },

}
</script>

<style scoped>

</style>