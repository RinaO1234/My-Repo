<template>
  <v-app
    id="app"
    dark
  >
  <SideBar :drawer="drawer"/>
    <v-toolbar

      dense
      fixed
      clipped-left
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <i class="mx-3 fab fa-youtube"></i>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">Native Frog</span>
<!-- <img src="@/assets/logos/jfrog-logo.png" /> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
    
    </v-toolbar>
    <v-content>
      <v-container fill-height>
        <v-layout justify-center align-center>
<ServicesWebView/>
                 <router-view/>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import SideBar from "@/components/SideBar/SideBar";
import ServicesWebView from "@/components/WebView/WebView";

import { mapState } from "vuex";
export default {
  components: {
    SideBar,
    ServicesWebView
  },
  computed: {
    ...mapState(["Services"])
  },
  watch: {
    Services: val => {
      console.log("Services changed!!!!", val);
      const webview = document.getElementById("foo");
      const loadPage = () => {
        webview.loadURL(Services.selectedService.url);
        webview.removeEventListener("dom-ready", loadPage);
      };
      webview.addEventListener("dom-ready", loadPage);
    }
  },
  data: () => ({
    drawer:true,
    items: [
      { icon: "trending_up", text: "Most Popular" },
      { icon: "subscriptions", text: "Subscriptions" },
      { icon: "history", text: "History" },
      { icon: "featured_play_list", text: "Playlists" },
      { icon: "watch_later", text: "Watch Later" }
    ]
  })
};
</script>


<style scoped>
.title {
  color: #fff;
}
.v-navigation-drawer>.v-list:not(.v-list--dense) .v-list__tile {
    font-size: 14px;
    padding: 0;
}
.container.fill-height {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    display: block !important;
    max-width: none;
}

nav {
    display: none;
}
main.v-content {
    padding: 0 !important;
}
.v-list__tile {
    display: block !important;
    padding: 0 !important;
}
li {
    list-style: none;
}
</style>
