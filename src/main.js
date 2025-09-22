import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import './style.css'
import App from './App.vue'
import router from './router'
import "../firebase-config";
// import store from './state/store'

const vuetify = createVuetify({
  components,
  directives,
  theme:{
    defaultTheme: 'light',
  },
  icons: {
    defaultSet: 'mdi',
  },
})

createApp(App)
  .use(vuetify)
  .use(router)
  // .use(store)        // calls store.install()
  .mount('#app')
