import Datastore from 'nedb';
import Vue from "vue"
import _ from 'lodash'
const remote = require("electron").remote;
let appData = remote.getGlobal("appData");
let db = new Datastore();
db = new Datastore({ filename: appData + '/nativeServices.nedb', autoload: true });
const state = {
  data: {
    services: [],
    selectedService: {}
  }
}

const mutations = {
  SET_ALL_SERVICES(state, fetchedServices) {
    //state.services = fetchedServices;
    Vue.set(state.data, 'services', fetchedServices);
  },
  SET_SELECTED_SERVICE(state, service) {

    state.data.selectedService = service
  },
  ADD_ONE_SERVICE(state, oneService) {
    //state.services = fetchedServices;

    db.insert(oneService, (err, newDoc) => {
      // newDoc is the newly inserted document
      console.log("Inserted new doc")
    });
    state.data.services.push(oneService)

  },
  CHECK_SERVICES_CONNECTION(state, services) {
    Vue.set(state.data, 'data.services', services);
  },

}

const actions = {
  fetchSavedServices({ commit }) {
    // do something async
    console.log('Called')
    db.find({}, (err, docs) => {
      console.log("Results are", docs)
      let fetchedServices = docs;
      commit('SET_ALL_SERVICES', fetchedServices)
    });
  },
  removeService({commit,dispatch},service){
    console.log("need to remove ",service);
    db.remove({ _id: service._id }, {},  (err, numRemoved)=> {
      console.log("Removed:",numRemoved)
      dispatch('fetchSavedServices');
    });
  },
  checkConnectivity({ commit }, services) {
    services.forEach((e) => {
      e.alive = true;
    });

    commit('CHECK_SERVICES_CONNECTION', services)
  },
  setSelectedService({ commit }, service) {
    // do something async
    commit('SET_SELECTED_SERVICE', service)
  },
  updateOneService({ commit }, service) {
    // do something async
    console.log("*** UDDATING ONE SERVICE ***")
    commit('ADD_ONE_SERVICE', service)
  }

}

export default {
  state,
  mutations,
  actions
}




