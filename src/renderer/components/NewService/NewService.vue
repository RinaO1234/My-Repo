<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">

      <v-card>
        <v-card-title>
          <span class="headline">Add New Service</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-autocomplete
                  :items="services"
                  label="Service Type"
                  item-text="name"
                  item-value="name"
                  v-model="newServ.type"
                >
                <template
                slot="selection"
                slot-scope="data"
              >
                {{ data.item.name }}
              </template>
              <template
                slot="item"
                slot-scope="data"
              >
                <template v-if="typeof data.item !== 'object'">
                  <v-list-tile-content v-text="data.item"></v-list-tile-content>
                </template>
                <template v-else>
                  <v-list-tile-avatar>
                    <img :src="data.item.avatar">
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </template>
                </v-autocomplete>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="newServ.name"label="Service Name"  hint="Will be used to identify the service in case of multiple services" required></v-text-field>
              </v-flex>
                  <v-flex xs12>
                <v-text-field v-model="newServ.url" label="Service Base URL"  hint="Native frog will go to this url in order to see the instance" required></v-text-field>
              </v-flex>
               <v-flex xs12>
        <v-combobox
          v-model="newServ.group"
          :items="groups"
          label="Select a group"
        ></v-combobox>
      </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeDialog(false)">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="closeDialog(true)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: "NewService",
  props: {
    dialog: Boolean
  },
  data: () => {
    const srcs = {
      artifactory: require("@/assets/logos/artifactory.png"),
      xray: require("@/assets/logos/xray.png"),
      distribution: require("@/assets/logos/distribution.png"),
      mc: require("@/assets/logos/mc.png"),
      salesforce: require("@/assets/logos/salesforce.png"),
      jira: require("@/assets/logos/jira.png")
    };
    return {
      services: [
        { name: "Artifactory", avatar: srcs["artifactory"] },
        { name: "Xray", avatar: srcs["xray"] },
        { name: "Distribution", avatar: srcs["distribution"] },
        { name: "MC", avatar: srcs["mc"] }
      ],
      groups: ["Staging","Production","Customers"],
      newServ: {}
    };
  },
  methods: {
    closeDialog(saveService) {
      console.log("type :", saveService);
      console.log("the event is", this.newServ);
      saveService ? this.$emit("clicked", this.newServ) : this.$emit("cancel");
      this.newServe = {};
    }
  }
};
</script>

<style scoped>
img {
  height: 26px !important;
  width: auto !important;
  border-radius: 0 !important;
}

div {
  color: #43a047 !important;
}

.blue--text.text--darken-1 {
  color: #43a047 !important;
}
.primary--text {
  color: #43a047 !important;
}

.v-label.primary--text {
  color: #43a047 !important;
}
</style>
