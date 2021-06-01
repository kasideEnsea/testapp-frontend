import Vue from 'vue'
import Vuex from 'vuex'
import {authModule} from "./auth";
import {usersModule} from "./users";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        authModule,
        usersModule,
    }
})

