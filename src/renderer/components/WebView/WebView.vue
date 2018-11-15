<template>
<div class="app__service">
   <div class="services">

      <div v-show="Services.data.selectedService.name==item.name" v-for="(item, index) in Services.data.services" class="services__webview services__webview-wrapper">
         <div>
            <webview allowpopups="on"  :src="item.url" autosize="on" :partition="`persist:service-${item.name}`" muted="off" tabindex="-1" :guestinstance="index"></webview>
         </div>
      </div>
   </div>
</div>
</template>

<script>
import { mapState } from "vuex";
const {getCurrentWindow, globalShortcut} = require('electron').remote;
/*
var reload = ()=>{
  console.log("REFRESG IT!")
}

globalShortcut.register('F5', reload);
globalShortcut.register('CommandOrControl+R', reload);
// here is the fix bug #3778, if you know alternative ways, please write them
window.addEventListener('beforeunload', ()=>{
  globalShortcut.unregister('F5', reload);
  globalShortcut.unregister('CommandOrControl+R', reload);
})
*/
export default {
  name: "ServicesWebView",
  props: {
    dialog: Boolean
  },
  data: () => {
    return {
      newServ: {}
    };
  },
  methods: {
    closeDialog(saveService) {
      console.log("type :", saveService);
      console.log("the event is", this.newServ);
      saveService ? this.$emit("clicked", this.newServ) : this.$emit("cancel");
    }
  },
  computed: {
    ...mapState(["Services"])
  }
};
</script>

<style scoped>
.services {
  width: 100%;
}
.services .services__webview,
.services .services__info-layer {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.services__webview.services__webview-wrapper > div {
  display: flex;
  height: 100%;
  padding-left: 220px;
}
.app__service,
webview {
  display: flex;
  height: 100%;
  width: 100%;
}
.v-list__group__header.v-list__group__header--active * {
    color: #1abd1a !important;
}
</style>
