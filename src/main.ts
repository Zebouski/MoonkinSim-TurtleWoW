import './styles/custom.scss'

import Vue from 'vue'
import Buefy from 'buefy'
import App from './App.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGitlab, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { faFilePdf, faBook, faBug, faFlask, faLock, faLink, faRedo } from '@fortawesome/free-solid-svg-icons'

Vue.config.productionTip = false

Vue.use(Buefy)

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faGitlab)
library.add(faDiscord)
library.add(faBook)
library.add(faFilePdf)
library.add(faBug)
library.add(faFlask)
library.add(faLock)
library.add(faLink)
library.add(faRedo)

new Vue({
  render: h => h(App)
}).$mount('#app')
