import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '~/assets/global.css'
import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    locale: {
      locale: 'es',
      messages: { es },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#39A900',
            'primary-darken-1': '#2D8600',
            secondary: '#00324D',
            'secondary-darken-1': '#001F33',
            accent: '#FF6D00',
            error: '#E53935',
            info: '#0288D1',
            success: '#2E7D32',
            warning: '#F57C00',
            background: '#FAFBFC',
            surface: '#FFFFFF',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        rounded: 'lg',
        fontWeight: '600',
      },
      VCard: {
        rounded: 'xl',
      },
      VTextField: {
        variant: 'outlined',
        density: 'comfortable',
      },
      VChip: {
        rounded: 'lg',
      },
    },
  })
  app.vueApp.use(vuetify)
})
