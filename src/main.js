import Vue from 'vue'
import Vue2Editor from 'vue2-editor'
// import 'firebase/auth'
// import firebase from 'firebase/app'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Vue2Editor)

Vue.config.productionTip = false

// let app = null
// firebase.auth().onAuthStateChanged(() => {

// })

Vue.directive('click-outside', {
    bind: function(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
            // here I check that click was outside the el and his children
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event)
            }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unbind: function(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    },
})

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')
