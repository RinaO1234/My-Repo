import Vue from 'vue'
import Vuex from 'vuex'


import modules from './modules'

Vue.use(Vuex)
import createLogger from 'vuex/dist/logger'
export default new Vuex.Store({
  modules,
  plugins: [
    createLogger()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
