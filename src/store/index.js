import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const type = {
  SET_AUTHORIZATION: 'set_authorization',
  SET_USER: 'set_user',
  SET_CHANNEL: 'set_channel',
  SET_ACTIVE: 'set_active'
}

const state = {
  isAuthorization: false,
  user: {},
  channel: '',
  isActive: true
}

const getters = { // 获取state状态
  isAuthorization: state => state.isAuthorization,
  user: user => state.user,
  channel: channel => state.channel,
  isActive: isActive => state.isActive
}

const mutations = {
  [type.SET_AUTHORIZATION](state, isAuthorization) {
    if (isAuthorization) {
      state.isAuthorization = isAuthorization
    } else {
      isAuthorization = false
    }
  },

  [type.SET_USER](state, user) {
    if (user) {
      state.user = user
    } else {
      user = {}
    }
  },

  [type.SET_CHANNEL](state, channel) {
      state.channel = channel
  },

  [type.SET_ACTIVE](state, isActive) {
      state.isActive = isActive
  }
}
const actions = {
  setAuthorization: ({ commit }, isAuthorization) => {
    commit(type.SET_AUTHORIZATION, isAuthorization)
  },
  setsuer: ({ commit }, user) => {
    commit(type.SET_USER, user)
  },
  setChannel({ commit }, channel) {
    commit(type.SET_CHANNEL, channel)
  },
  setActive({ commit }, isActive) {
    commit(type.SET_ACTIVE, isActive)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
