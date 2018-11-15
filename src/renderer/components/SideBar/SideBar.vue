 <template>
  <v-navigation-drawer
      :value="drawer"
      fixed
      clipped
    >
    <v-list dense>
                <v-subheader class="mt-3 grey--text text--darken-1">Services</v-subheader>
                <v-tooltip bottom :allow-overflow="true">
                   <v-icon  @click="checkConnectivity" class="connectivity-search" slot="activator">compare_arrows</v-icon>
                   <span>Check Services Connectivity</span>
                </v-tooltip>
        </v-list>

         <v-list>
          <v-list-group
            v-for="item in sideBarItems.groups"
            v-model="item.active"
            :key="item.title"
            :prepend-icon="item.action"
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

           <v-list-tile :class="{active: Services.data.selectedService && Services.data.selectedService.name==item.name}" v-for="item in item.groupItems" :key="item.name" avatar  >
             <div class="led-box">
    <div  :class="{'led-green':item.alive == true,'led-red':!item.alive}"></div>

  </div>
            <v-list-tile-avatar>
                <v-tooltip bottom :allow-overflow="true">
         <img slot="activator" :src="getImage(item.type)"  alt="">
                  <span>{{item.name}}</span>
                      </v-tooltip>
             
            </v-list-tile-avatar>
            <v-list-tile-title v-text="item.name" @click="setSelected(item)" ></v-list-tile-title>
             <v-btn
              slot="activator"
              dark
              icon
            >
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-menu bottom left>
            <v-btn
              slot="activator"
              dark
              icon
            >
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list  class="service-action" >
              <v-list-tile
                v-for="(actionItem, i) in serviceMenuitems"
                :key="i"
               
                @click="serviceAction(item,actionItem.action)"
              >
                         <v-icon>{{actionItem.action}}</v-icon>
                <v-list-tile-title>{{ actionItem.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
    
            </v-list-tile>
          </v-list-group>
        </v-list>

      <router-link tag="li" to="/add">
        <v-list-tile class="mt-3" @click="openNewServiceModal">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
    
          <v-list-tile-title class="grey--text text--darken-1">Add Service</v-list-tile-title >
        </v-list-tile>
           </router-link>
      <NewService @cancel="abortNewService" @clicked="addService" :dialog="isDialogActive" />
     <!-- <span v-if="Services && Services.selectedService" >{{Services.selectedService}}</span> -->
     <div class="credit">Made with 💚  <br/>JFrog Hackathon</div> 
     
    </v-navigation-drawer>





</template>

<script>
import NewService from "@/components/NewService/NewService";
import { mapState } from "vuex";
import _ from "lodash"
import axios from "axios";
export default {
  name: "SideBar",
  components: {
    NewService
  },
  props: {
    drawer: Boolean
  },
  computed: {
    ...mapState(["Services"]),
     sideBarItems() {
console.log("COMPUTING!!")
  let grouped = _.groupBy(this.Services.data.services, item => item.group);
  let groups = { groups: [] };
  
  Object.keys(grouped).forEach(key => {
    groups.groups.push({ title: key, groupItems: grouped[key],action:"folder" })
  })

  let index = _.findIndex(groups.groups, group => group.title === 'undefined');

  if (index > -1) groups.groups[index].title = "ungrouped";

  console.log("******* PARSED", groups);
  return groups
    }
  },
  methods: {
    serviceAction(service, action) {
      console.log("Need to do", action, service);
      if(action == 'delete'){
        this.$store.dispatch("removeService", service);
      }
    },
    checkConnectivity() {
      let services = this.Services.data.services;
      this.$store.dispatch("checkConnectivity", services);
    },
    getImage(type) {
      if (!type) return;
      let url = require(`@/assets/logos/${type.toLowerCase()}.png`);

      if (!url) {
        url = require(`@/assets/logos/jfrog-logo.png`);
      }
      return url;
    },
    fetchServices() {
      console.log("Calling VUEX METHOD!!");
      this.$store.dispatch("fetchSavedServices");
    },
    setSelected(item) {
      console.log("Set Selecrted", item);
      //this.selectedService = item;

      this.$store.dispatch("setSelectedService", item);
    },
    openNewServiceModal() {
      this.isDialogActive = true;
    },
    updateSepcificService(service) {
      let objCopy = {
        name: service.name,
        type: service.type,
        url: service.url,
        group: service.group
      };

      this.$store.dispatch("updateOneService", objCopy);
    },
    addService(value) {
      console.log("Need to save new service of type:", value.type);
      console.log("Need to save new service of names:", value.name);
      console.log("SAVING!!");

      this.updateSepcificService(value);

      console.log("Finding..");
      this.isDialogActive = false;
    },
    abortNewService() {
      console.log("New Service Abort");
      this.isDialogActive = false;
    }
  },
  data: () => ({
    isDialogActive: false,
    serviceMenuitems: [
      { title: "Edit", action: "edit" },
      { title: "Delete", action: "delete" }
    ]
  }),
  beforeMount() {
    let pingEndPoints = {
      xray: "/api/v1/system/ping",
      artifactory: "/api/system/ping",
      missionControll: "/api/v3/ping",
      dist: "/api/v1/system/ping"
    };
    console.log("CREATING!!!");
    axios
      .get("https://distribution-jfrog-native.jfrogdev.co")
      .then(response => {
        console.log("The Response is", response.data);
        var headHTML = /<head.*?>([\s\S]*)<\/head>/.exec(response.data)[1];
        console.log("head is", headHTML.indexOf("<title"));

        let from = headHTML.indexOf("<title");
        let to = headHTML.indexOf("</title>");
        console.log("from", from);
        console.log("to", to);

        let normalizedHead = headHTML.toLowerCase();
        if (normalizedHead.indexOf("xray") > -1) {
          console.log("FOUND XRAY!!!!");
        } else if (normalizedHead.indexOf("distribution") > -1) {
          console.log("FOUND DISTRIBUTION!!!!");
        } else if (normalizedHead.indexOf("mission") > -1) {
          console.log("FOUND MISSION CONTROL!!!!");
        } else if (response.data.indexOf("artifactory") > -1) {
          console.log("FOUND ARTIFACTORY!!!!");
        }
      });

    this.fetchServices();
  }
};
</script>

<style lang="scss" scoped>
li {
    list-style: none;
}
.no-padding * {
    padding: 0 !important;
}
.v-list__group__items>div * {
    font-size: 12px;
}
a.v-list__tile.v-list__tile--link.theme--dark {
    padding: 0;
}
.connectivity-search {
  width: 100%;
  text-align: center;
  cursor: pointer;
}

.v-avatar .v-icon,
.v-avatar .v-image,
.v-avatar img {
  border-radius: 50%;
  display: inline-flex;
  height: 20px;
  width: auto;
}
.primary--text{
  color:#43a047 !important;
}
.active {
  background: #505050;
  border-left: 4px solid #43a047;
}
img {
  border-radius: 0 !important;
}
.v-list__tile__action,
.v-list__tile__avatar {
  display: flex;
  justify-content: flex-start;
  min-width: 35px;
}
aside {
  width: 220px !important;
  transform: translateX(0) !important;
}
.v-btn--floating.v-btn--small {
  height: 20px;
  width: 20px;
  background: tomato !important;
}
.v-list__tile__title {
  cursor: pointer;
}
.service-action a.v-list__tile.v-list__tile--link.theme--dark {
  height: 32px;
  font-size: 13px;
  padding: 22px;
}
.service-action .theme--dark.v-icon {
  color: #fff;
  font-size: 15px;
  margin-right: 7px;
}
.v-list.service-action a {
  font-size: 15px !important;
}
.service-action .v-list__tile__title {
  font-size: 15px;
}


a.v-list__tile {
    padding: 0 !important;
}

/* LED */

.led-box {
  height: 30px;
  width: 30px;
  margin: 10px 0;
  float: left;
}

.led-box p {
  font-size: 12px;
  text-align: center;
  margin: 1em;
}

.led-red {
  margin: 0 auto;
  width: 12px;
  height: 12px;
  position: relative;
  top: 7px;
  background-color: #f00;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px,
    rgba(255, 0, 0, 0.5) 0 2px 12px;
  -webkit-animation: blinkRed 1.2s infinite;
  -moz-animation: blinkRed 1.2s infinite;
  -ms-animation: blinkRed 1.2s infinite;
  -o-animation: blinkRed 1.2s infinite;
  animation: blinkRed 1.2s infinite;
}

@-webkit-keyframes blinkRed {
  from {
    background-color: #f00;
  }
  50% {
    background-color: #a00;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px,
      rgba(255, 0, 0, 0.5) 0 2px 0;
  }
  to {
    background-color: #f00;
  }
}
@-moz-keyframes blinkRed {
  from {
    background-color: #f00;
  }
  50% {
    background-color: #a00;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px,
      rgba(255, 0, 0, 0.5) 0 2px 0;
  }
  to {
    background-color: #f00;
  }
}
@-ms-keyframes blinkRed {
  from {
    background-color: #f00;
  }
  50% {
    background-color: #a00;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px,
      rgba(255, 0, 0, 0.5) 0 2px 0;
  }
  to {
    background-color: #f00;
  }
}
@-o-keyframes blinkRed {
  from {
    background-color: #f00;
  }
  50% {
    background-color: #a00;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px,
      rgba(255, 0, 0, 0.5) 0 2px 0;
  }
  to {
    background-color: #f00;
  }
}
@keyframes blinkRed {
  from {
    background-color: #f00;
  }
  50% {
    background-color: #a00;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px,
      rgba(255, 0, 0, 0.5) 0 2px 0;
  }
  to {
    background-color: #f00;
  }
}

.led-yellow {
  margin: 0 auto;
  width: 24px;
  height: 24px;
  background-color: #ff0;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #808002 0 -1px 9px,
    #ff0 0 2px 12px;
  -webkit-animation: blinkYellow 1s infinite;
  -moz-animation: blinkYellow 1s infinite;
  -ms-animation: blinkYellow 1s infinite;
  -o-animation: blinkYellow 1s infinite;
  animation: blinkYellow 1s infinite;
}

@-webkit-keyframes blinkYellow {
  from {
    background-color: #ff0;
  }
  50% {
    background-color: #aa0;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #808002 0 -1px 9px,
      #ff0 0 2px 0;
  }
  to {
    background-color: #ff0;
  }
}
@-moz-keyframes blinkYellow {
  from {
    background-color: #ff0;
  }
  50% {
    background-color: #aa0;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #808002 0 -1px 9px,
      #ff0 0 2px 0;
  }
  to {
    background-color: #ff0;
  }
}
@-ms-keyframes blinkYellow {
  from {
    background-color: #ff0;
  }
  50% {
    background-color: #aa0;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #808002 0 -1px 9px,
      #ff0 0 2px 0;
  }
  to {
    background-color: #ff0;
  }
}
@-o-keyframes blinkYellow {
  from {
    background-color: #ff0;
  }
  50% {
    background-color: #aa0;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #808002 0 -1px 9px,
      #ff0 0 2px 0;
  }
  to {
    background-color: #ff0;
  }
}
@keyframes blinkYellow {
  from {
    background-color: #ff0;
  }
  50% {
    background-color: #aa0;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #808002 0 -1px 9px,
      #ff0 0 2px 0;
  }
  to {
    background-color: #ff0;
  }
}

.led-green {
  margin: 0 auto;
  width: 12px;
  height: 12px;
  position: relative;
  top: 7px;
  background-color: #abff00;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px;
}

.led-blue {
  margin: 0 auto;
  width: 24px;
  height: 24px;
  background-color: #24e0ff;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #006 0 -1px 9px,
    #3f8cff 0 2px 14px;
}

.credit {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
</style>
