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
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#f3e8ff',
          surface: '#faf5ff',
          primary: '#6a23b5',
          secondary: '#8e24aa',
          accent: '#a020f0'
        }
      },
      dark: {
        dark: true,
        colors: {
          background: '#1e1a26',
          surface: '#2a2333',
          primary: '#bb86fc',
          secondary: '#d0a1ff',
          accent: '#d58aff'
        }
      }
    }
  }
})

createApp(App)
  .use(vuetify)
  .use(router)
  // .use(store)        // calls store.install()
  .mount('#app')
