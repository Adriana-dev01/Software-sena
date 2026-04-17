<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">Resumen del sistema</h1>

    <v-row v-if="loading" class="mb-6">
      <v-col v-for="n in 4" :key="n" cols="12" sm="6" md="3">
        <v-skeleton-loader type="card" rounded="xl" />
      </v-col>
    </v-row>

    <v-row v-else class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="stat in stats" :key="stat.label">
        <v-card rounded="xl" elevation="2" class="pa-4 d-flex align-center gap-4">
          <v-avatar :color="stat.color" size="52" rounded="lg">
            <v-icon :icon="stat.icon" color="white" size="28" />
          </v-avatar>
          <div>
            <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
            <div class="text-caption text-medium-emphasis">{{ stat.label }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Accesos rápidos -->
    <h2 class="text-subtitle-1 font-weight-bold mb-4">Accesos rápidos</h2>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="action in quickActions" :key="action.to">
        <v-card
          :to="action.to"
          rounded="xl"
          elevation="1"
          hover
          class="pa-4 d-flex align-center gap-3"
        >
          <v-icon :color="action.color" size="32">{{ action.icon }}</v-icon>
          <div>
            <div class="text-subtitle-2 font-weight-bold">{{ action.title }}</div>
            <div class="text-caption text-medium-emphasis">{{ action.desc }}</div>
          </div>
          <v-spacer />
          <v-icon color="grey-lighten-1">mdi-chevron-right</v-icon>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const api = useApi()
const loading = ref(true)
const softwareData = ref<any[]>([])
const usersData = ref<any[]>([])
const noticiasData = ref<any[]>([])

const stats = computed(() => [
  {
    label: 'Software activos',
    value: softwareData.value.filter(s => s.estado?.toLowerCase() === 'activo').length,
    icon: 'mdi-package-variant',
    color: 'primary',
  },
  {
    label: 'Total software',
    value: softwareData.value.length,
    icon: 'mdi-apps',
    color: 'teal',
  },
  {
    label: 'Usuarios registrados',
    value: usersData.value.length,
    icon: 'mdi-account-group',
    color: 'purple',
  },
  {
    label: 'Noticias pendientes',
    value: noticiasData.value.filter(n => n.estado === 'pendiente').length,
    icon: 'mdi-newspaper-variant-outline',
    color: 'warning',
  },
])

const quickActions = [
  {
    title: 'Nuevo software',
    desc: 'Agregar una nueva aplicación al catálogo',
    icon: 'mdi-plus-circle',
    color: 'primary',
    to: '/admin/software/nuevo',
  },
  {
    title: 'Gestionar software',
    desc: 'Ver, editar y eliminar software',
    icon: 'mdi-package-variant',
    color: 'teal',
    to: '/admin/software',
  },
  {
    title: 'Gestionar usuarios',
    desc: 'Ver y administrar usuarios del sistema',
    icon: 'mdi-account-group',
    color: 'purple',
    to: '/admin/usuarios',
  },
  {
    title: 'Revisar noticias',
    desc: 'Aprobar o rechazar noticias pendientes',
    icon: 'mdi-newspaper-variant',
    color: 'warning',
    to: '/admin/noticias',
  },
]

onMounted(async () => {
  try {
    const [sw, users, noticias] = await Promise.all([
      api.get<any[]>('/software/admin'),
      api.get<any[]>('/users'),
      api.get<any[]>('/noticias/admin'),
    ])
    softwareData.value = sw
    usersData.value = users
    noticiasData.value = noticias
  } finally {
    loading.value = false
  }
})
</script>
