import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.loadFromStorage()

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  if (authStore.user?.role !== 'noticias' && authStore.user?.role !== 'super_admin') {
    return navigateTo('/dashboard')
  }
})
