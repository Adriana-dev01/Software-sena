<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent :color="drawerColor">
      <!-- Logo / título -->
      <v-list-item
        prepend-icon="mdi-package-variant-closed"
        title="Software Mgmt"
        nav
        class="text-white"
      >
        <template #append>
          <v-btn
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            variant="text"
            color="white"
            @click="rail = !rail"
          />
        </template>
      </v-list-item>

      <v-divider />

      <!-- Menú de navegación por rol -->
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          color="white"
          active-color="primary"
          rounded="lg"
        />
      </v-list>

      <!-- Footer del drawer: usuario + logout -->
      <template #append>
        <v-divider />
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-account-circle"
            :title="authStore.fullName"
            :subtitle="authStore.user?.role"
            color="white"
            class="text-white"
          />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar sesión"
            color="white"
            @click="logout"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- AppBar -->
    <v-app-bar :color="appBarColor" elevation="1">
      <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>
      <v-spacer />
      <v-chip color="white" variant="outlined" size="small" class="mr-3">
        {{ authStore.user?.role }}
      </v-chip>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

const authStore = useAuthStore()
const { logout } = useAuth()
const drawer = ref(true)
const rail = ref(false)
const route = useRoute()

onMounted(() => {
  authStore.loadFromStorage()
})

// ── Ítems de navegación por rol ─────────────────────────────
const adminItems = [
  { title: 'Inicio',     icon: 'mdi-view-dashboard',  to: '/admin' },
  { title: 'Software',   icon: 'mdi-package-variant',  to: '/admin/software' },
  { title: 'Noticias',   icon: 'mdi-newspaper-variant',to: '/admin/noticias' },
  { title: 'Usuarios',   icon: 'mdi-account-group',    to: '/admin/usuarios' },
  { title: 'Mi perfil',  icon: 'mdi-account-edit',     to: '/admin/perfil' },
]

const noticiasItems = [
  { title: 'Mis noticias',   icon: 'mdi-newspaper',         to: '/noticias-editor' },
  { title: 'Nueva noticia',  icon: 'mdi-plus-circle',        to: '/noticias-editor/nueva' },
  { title: 'Mi perfil',      icon: 'mdi-account-edit',       to: '/noticias-editor/perfil' },
]

const clientItems = [
  { title: 'Catálogo',  icon: 'mdi-apps',         to: '/dashboard' },
  { title: 'Mi perfil', icon: 'mdi-account-edit', to: '/dashboard/perfil' },
]

const allItems = [...adminItems, ...noticiasItems, ...clientItems]

const navItems = computed(() => {
  const role = authStore.user?.role
  if (role === 'super_admin') return adminItems
  if (role === 'noticias')    return noticiasItems
  return clientItems
})

// Color del drawer y app bar según rol
const drawerColor = computed(() => {
  const role = authStore.user?.role
  if (role === 'super_admin') return 'grey-darken-4'
  if (role === 'noticias')    return 'teal-darken-3'
  return 'grey-darken-4'
})

const appBarColor = computed(() => {
  const role = authStore.user?.role
  if (role === 'noticias') return 'teal-darken-2'
  return 'primary'
})

const pageTitle = computed(() =>
  allItems.find(i => i.to === route.path)?.title || 'Dashboard'
)
</script>
