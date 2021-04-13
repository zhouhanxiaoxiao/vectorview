<template>
  <div id="app">
    <carrier-nav></carrier-nav>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

import CarrierNav from "@/components/public/carrierNav";
export default {
  name: 'App',
  components: {
    CarrierNav
  }
}
</script>

<style>
#app {
  font-family: Roboto,helvetica neue,HelveticaNeue,liberation sans,Arimo,Helvetica,Arial,sans-serif,dejavu_sans,symbola;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
