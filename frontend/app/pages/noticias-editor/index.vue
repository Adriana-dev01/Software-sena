<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">Mis Noticias</h1>
      <v-btn to="/noticias-editor/nueva" color="teal-darken-2" prepend-icon="mdi-plus">
        Nueva noticia
      </v-btn>
    </div>

    <!-- Filtro por estado — el valor se envía como query param al servidor -->
    <v-btn-toggle v-model="filtroEstado" density="compact" variant="tonal" class="mb-5">
      <v-btn value="">Todas</v-btn>
      <v-btn value="pendiente">Pendientes</v-btn>
      <v-btn value="aprobada">Aprobadas</v-btn>
      <v-btn value="rechazada">Rechazadas</v-btn>
    </v-btn-toggle>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <v-card rounded="xl" elevation="2">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="noticias"
          :loading="loading"
          items-per-page="10"
          rounded="lg"
        >
          <template #item.titulo="{ item }">
            <span class="font-weight-medium">{{ item.titulo }}</span>
          </template>

          <template #item.estado="{ item }">
            <EstadoChip :estado="item.estado" />
          </template>

          <template #item.fechaCreacion="{ item }">
            <span class="text-caption">{{ formatDate(item.fechaCreacion) }}</span>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex align-center gap-1">
              <v-tooltip text="Editar noticia" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :disabled="item.estado !== 'pendiente'"
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    color="primary"
                    :to="`/noticias-editor/${item.id}/editar`"
                  />
                </template>
              </v-tooltip>
              <v-tooltip
                v-if="item.estado !== 'pendiente'"
                text="Solo se pueden editar noticias en estado pendiente"
                location="top"
              >
                <template #activator="{ props }">
                  <v-icon v-bind="props" size="16" color="grey" class="ml-1">
                    mdi-lock-outline
                  </v-icon>
                </template>
              </v-tooltip>
            </div>
          </template>

          <template #no-data>
            <div class="text-center py-8">
              <v-icon size="48" color="grey-lighten-2">mdi-newspaper-remove</v-icon>
              <p class="text-body-2 text-medium-emphasis mt-2">
                {{ filtroEstado ? `No tienes noticias en estado "${filtroEstado}"` : 'No tienes noticias aún' }}
              </p>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'noticias' })

const api = useApi()
const loading = ref(false)
const noticias = ref<any[]>([])
const filtroEstado = ref('')
const error = ref('')

const headers = [
  { title: 'Título',   key: 'titulo' },
  { title: 'Estado',   key: 'estado' },
  { title: 'Fecha',    key: 'fechaCreacion' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

/**
 * Llama a GET /noticias/mis-noticias (rol: noticias).
 * Pasa el filtro de estado como query param al servidor.
 */
async function fetchMisNoticias() {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, string> = {}
    if (filtroEstado.value) params.estado = filtroEstado.value

    noticias.value = await api.get<any[]>('/noticias/mis-noticias', params)
  } catch (e: any) {
    error.value = e.message || 'Error al cargar tus noticias'
    noticias.value = []
  } finally {
    loading.value = false
  }
}

// Recarga automáticamente cuando cambia el filtro de estado
watch(filtroEstado, fetchMisNoticias)

onMounted(fetchMisNoticias)
</script>
