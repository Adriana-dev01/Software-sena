import { useAuthStore } from '~/stores/auth'

// Este plugin corre solo en el cliente, antes de que cualquier
// componente o layout se monte. Garantiza que el store de auth
// esté poblado desde localStorage al iniciar la app.
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  authStore.loadFromStorage()
})
