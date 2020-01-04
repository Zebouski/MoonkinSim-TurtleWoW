import Vue from "vue";
import App from "./App.vue";

import Buefy from "buefy";
import "buefy/dist/buefy.css";

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGitlab } from '@fortawesome/free-brands-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'

Vue.config.productionTip = false;

Vue.use(Buefy);

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faGitlab)
library.add(faDiscord)

new Vue({
  render: h => h(App)
}).$mount("#app");
