<template>
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>
        <span class="font-weight-bold">Software Management</span>
      </v-app-bar-title>
      <v-spacer />
      <v-btn to="/noticias" variant="text" color="white">Noticias</v-btn>
      <v-btn to="/catalogo" variant="text" color="white">Catálogo</v-btn>
      <template v-if="!authStore.isAuthenticated">
        <v-btn to="/login" variant="text" color="white">Ingresar</v-btn>
        <v-btn to="/register" variant="outlined" color="white" class="ml-2">Registrarse</v-btn>
      </template>
      <template v-else>
        <v-btn :to="dashboardRoute" variant="text" color="white">Dashboard</v-btn>
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-account-circle" color="white" />
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title class="font-weight-bold">{{ authStore.fullName }}</v-list-item-title>
              <v-list-item-subtitle>{{ authStore.user?.role }}</v-list-item-subtitle>
            </v-list-item>
            <v-divider />
            <v-list-item @click="logout" prepend-icon="mdi-logout" title="Cerrar sesión" />
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <v-footer color="primary" class="text-center d-flex justify-center py-3">
      <span class="text-white text-caption">© {{ new Date().getFullYear() }} Software Management — SENA</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

const authStore = useAuthStore()
const { logout } = useAuth()

onMounted(() => {
  authStore.loadFromStorage()
})

const dashboardRoute = computed(() => {
  const role = authStore.user?.role
  if (role === 'super_admin') return '/admin'
  if (role === 'noticias')    return '/noticias-editor'
  return '/dashboard'
})
</script>
