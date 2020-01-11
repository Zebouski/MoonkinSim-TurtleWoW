import Vue from 'vue'
import App from './App.vue'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGitlab, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { faBook } from '@fortawesome/free-solid-svg-icons'

Vue.config.productionTip = false

Vue.use(Buefy)

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faGitlab)
library.add(faDiscord)
library.add(faBook)

new Vue({
  render: h => h(App)
}).$mount('#app')
