import "material-design-icons-iconfont/dist/material-design-icons.css"
import "@mdi/font/css/materialdesignicons.css"
import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"

Vue.config.productionTip = false

Vue.use(vuetify, {
    iconfont: "mdi"
})

new Vue({
    router,
    store,
    vuetify,
    iconfont: "mdi",
    render: h => h(App)
}).$mount("#app")