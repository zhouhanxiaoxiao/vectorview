<template>
  <div>
    <Tabs type="card">
      <TabPane :label="$t('configPage.email')">
        <pi-confirm-config></pi-confirm-config>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import PiConfirmConfig from "@/components/config/processConfig/piConfirmConfig";
export default {
  name: "processConfig",
  components: {PiConfirmConfig}
}
</script>

<style scoped>

</style>