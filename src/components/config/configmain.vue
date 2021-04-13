<template>
  <div style="width: 100%">
      <div class="menu-div">
        <Menu theme="dark"  style="width: 100%;height: 100%" :active-name="flag" @on-select="changeTab">
            <MenuItem name="select">
              <Icon type="md-arrow-dropdown" />
              {{ $t("configPage.select") }}
            </MenuItem>
            <MenuItem name="process">
              <Icon type="md-code-working" />
              {{ $t("configPage.process") }}
            </MenuItem>
        </Menu>
      </div>
      <div class="config-contain">
        <select-config v-if="flag === 'select'"></select-config>
        <process-config v-if="flag === 'process'"></process-config>
      </div>
  </div>
</template>

<script>
import SelectConfig from "@/components/config/selectConfig/selectConfig";
import ProcessConfig from "@/components/config/processConfig/processConfig";
export default {
  name: "configmain",
  components: {ProcessConfig, SelectConfig},
  data : function (){
    return {
      split : 0.2,
      flag : "select"
    }
  },
  methods : {
    changeTab : function (name){
      this.flag = name;
    }
  }
}
</script>

<style scoped>
.menu-div{
  width: 20%;
  max-width: 500px;
  height: 95vh;
  overflow: auto;
  display: inline-block;
  vertical-align: top;
}
.config-contain{
  width: 78%;
  height: 95vh;
  overflow: auto;
  display: inline-block;
  vertical-align: top;
  padding: 1% 1%;
}
</style>