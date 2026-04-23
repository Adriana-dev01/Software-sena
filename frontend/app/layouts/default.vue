<template>
  <v-app>
    <!-- Navbar Glassmorphism -->
    <v-app-bar
      class="glass"
      :elevation="0"
      height="70"
    >
      <v-container class="d-flex align-center py-0" style="max-width: 1200px">
        <NuxtLink to="/" class="d-flex align-center text-decoration-none">
          <v-avatar color="primary" size="38" rounded="lg" class="mr-3">
            <v-icon color="white" size="22">mdi-package-variant-closed</v-icon>
          </v-avatar>
          <div>
            <span class="text-subtitle-1 font-weight-bold text-secondary">Software</span>
            <span class="text-subtitle-1 font-weight-bold text-primary ml-1">SENA</span>
          </div>
        </NuxtLink>

        <v-spacer />

        <!-- Nav Desktop -->
        <div class="d-none d-md-flex align-center gap-1">
          <v-btn
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            variant="text"
            :color="route.path === link.to ? 'primary' : 'secondary'"
            class="text-none font-weight-medium"
          >
            <v-icon start size="18">{{ link.icon }}</v-icon>
            {{ link.label }}
          </v-btn>

          <v-divider vertical class="mx-2" length="28" />

          <template v-if="!authStore.isAuthenticated">
            <v-btn to="/login" variant="text" color="secondary" class="text-none font-weight-medium">
              Ingresar
            </v-btn>
            <v-btn to="/register" color="primary" class="text-none glow-btn ml-1" rounded="lg">
              Registrarse
            </v-btn>
          </template>
          <template v-else>
            <v-btn :to="dashboardRoute" variant="tonal" color="primary" class="text-none mr-1" rounded="lg">
              <v-icon start size="18">mdi-view-dashboard</v-icon>
              Dashboard
            </v-btn>
            <v-menu>
              <template #activator="{ props }">
                <v-btn v-bind="props" icon variant="text" color="secondary">
                  <v-avatar color="primary" size="34">
                    <span class="text-white text-caption font-weight-bold">
                      {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
                    </span>
                  </v-avatar>
                </v-btn>
              </template>
              <v-list rounded="xl" class="pa-2" min-width="200">
                <v-list-item rounded="lg" class="mb-1">
                  <v-list-item-title class="font-weight-bold">{{ authStore.fullName }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip size="x-small" color="primary" variant="tonal">{{ authStore.user?.role }}</v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider class="my-1" />
                <v-list-item
                  @click="logout"
                  prepend-icon="mdi-logout"
                  title="Cerrar sesión"
                  rounded="lg"
                  color="error"
                />
              </v-list>
            </v-menu>
          </template>
        </div>

        <!-- Mobile menu -->
        <v-btn class="d-md-none" icon="mdi-menu" variant="text" color="secondary" @click="drawer = !drawer" />
      </v-container>
    </v-app-bar>

    <!-- Mobile Drawer -->
    <v-navigation-drawer v-model="drawer" temporary location="right" width="280">
      <v-list nav class="pa-3">
        <v-list-item
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :prepend-icon="link.icon"
          :title="link.label"
          rounded="lg"
          color="primary"
          @click="drawer = false"
        />
        <v-divider class="my-2" />
        <template v-if="!authStore.isAuthenticated">
          <v-list-item to="/login" prepend-icon="mdi-login" title="Ingresar" rounded="lg" @click="drawer = false" />
          <v-list-item to="/register" prepend-icon="mdi-account-plus" title="Registrarse" rounded="lg" color="primary" @click="drawer = false" />
        </template>
        <template v-else>
          <v-list-item :to="dashboardRoute" prepend-icon="mdi-view-dashboard" title="Dashboard" rounded="lg" color="primary" @click="drawer = false" />
          <v-list-item @click="logout; drawer = false" prepend-icon="mdi-logout" title="Cerrar sesión" rounded="lg" color="error" />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main style="background: #FAFBFC">
      <slot />
    </v-main>

    <!-- Footer -->
    <v-footer class="animated-gradient pa-0">
      <v-container class="py-8 text-center">
        <div class="d-flex justify-center align-center gap-2 mb-3">
          <v-avatar color="white" size="32" rounded="lg">
            <v-icon color="primary" size="18">mdi-package-variant-closed</v-icon>
          </v-avatar>
          <span class="text-white font-weight-bold">Software SENA</span>
        </div>
        <div class="d-flex justify-center gap-4 mb-4">
          <v-btn v-for="link in navLinks" :key="link.to" :to="link.to" variant="text" color="white" size="small" class="text-none">
            {{ link.label }}
          </v-btn>
        </div>
        <v-divider class="mb-4" style="border-color: rgba(255,255,255,0.2)" />
        <span class="text-white text-caption" style="opacity: 0.7">
          © {{ new Date().getFullYear() }} Software Management — SENA. Todos los derechos reservados.
        </span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const authStore = useAuthStore()
const { logout } = useAuth()
const drawer = ref(false)

const navLinks = [
  { label: 'Inicio', to: '/', icon: 'mdi-home' },
  { label: 'Catálogo', to: '/catalogo', icon: 'mdi-apps' },
  { label: 'Noticias', to: '/noticias', icon: 'mdi-newspaper-variant-outline' },
]

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

<style scoped>
.v-app-bar.glass {
  border-bottom: 1px solid rgba(0, 50, 77, 0.08) !important;
}
</style>
