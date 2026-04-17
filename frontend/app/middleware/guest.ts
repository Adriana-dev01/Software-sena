import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.loadFromStorage()

  if (authStore.isAuthenticated) {
    if (authStore.user?.role === 'super_admin') return navigateTo('/admin')
    return navigateTo('/dashboard')
  }
})
