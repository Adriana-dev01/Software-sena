<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-2">Gestión de Noticias</h1>
    <p class="text-body-2 text-medium-emphasis mb-6">
      Revisa, aprueba o rechaza las noticias enviadas por los redactores.
    </p>

    <!-- Métricas rápidas -->
    <v-row class="mb-5">
      <v-col v-for="stat in stats" :key="stat.label" cols="6" md="3">
        <v-card rounded="xl" elevation="1" class="pa-4 d-flex align-center gap-3">
          <v-avatar :color="stat.color" size="44" rounded="lg">
            <v-icon :icon="stat.icon" color="white" size="22" />
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold">{{ stat.value }}</div>
            <div class="text-caption text-medium-emphasis">{{ stat.label }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtro por estado -->
    <v-card rounded="xl" elevation="2">
      <v-card-text>
        <div class="d-flex align-center gap-4 mb-4 flex-wrap">
          <v-btn-toggle v-model="filtroEstado" density="compact" variant="tonal" mandatory>
            <v-btn value="">Todas</v-btn>
            <v-btn value="pendiente">
              <v-badge :content="countByEstado('pendiente')" color="warning" inline>
                Pendientes
              </v-badge>
            </v-btn>
            <v-btn value="aprobada">Aprobadas</v-btn>
            <v-btn value="rechazada">Rechazadas</v-btn>
          </v-btn-toggle>
          <v-spacer />
          <v-text-field
            v-model="search"
            placeholder="Buscar..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            style="max-width: 280px"
          />
        </div>

        <v-data-table
          :headers="headers"
          :items="noticiasFiltradas"
          :loading="loading"
          :search="search"
          items-per-page="10"
          rounded="lg"
        >
          <!-- Título con resumen tooltip -->
          <template #item.titulo="{ item }">
            <div>
              <div class="font-weight-medium">{{ item.titulo }}</div>
              <div
                v-if="item.resumen"
                class="text-caption text-medium-emphasis"
                style="overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;max-width:280px"
              >
                {{ item.resumen }}
              </div>
            </div>
          </template>

          <!-- Estado -->
          <template #item.estado="{ item }">
            <EstadoChip :estado="item.estado" />
          </template>

          <!-- Fecha -->
          <template #item.fechaCreacion="{ item }">
            <span class="text-caption">{{ formatDate(item.fechaCreacion) }}</span>
          </template>

          <!-- Acciones -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <!-- Ver detalle -->
              <v-tooltip text="Ver contenido" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="openPreview(item)"
                  />
                </template>
              </v-tooltip>

              <!-- Aprobar -->
              <v-tooltip text="Aprobar" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :disabled="item.estado === 'aprobada'"
                    icon="mdi-check-circle"
                    size="small"
                    variant="text"
                    color="success"
                    :loading="actionLoading === `aprobar-${item.id}`"
                    @click="confirmAction('aprobar', item)"
                  />
                </template>
              </v-tooltip>

              <!-- Rechazar -->
              <v-tooltip text="Rechazar" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :disabled="item.estado === 'rechazada'"
                    icon="mdi-close-circle"
                    size="small"
                    variant="text"
                    color="warning"
                    :loading="actionLoading === `rechazar-${item.id}`"
                    @click="confirmAction('rechazar', item)"
                  />
                </template>
              </v-tooltip>

              <!-- Eliminar -->
              <v-tooltip text="Eliminar" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="confirmAction('eliminar', item)"
                  />
                </template>
              </v-tooltip>
            </div>
          </template>

          <template #no-data>
            <div class="text-center py-8">
              <v-icon size="48" color="grey-lighten-2">mdi-newspaper-check</v-icon>
              <p class="text-body-2 text-medium-emphasis mt-2">No hay noticias para mostrar</p>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialog de confirmación -->
    <ConfirmDialog
      v-model="confirmDialog"
      :title="dialogConfig.title"
      :message="dialogConfig.message"
      :confirm-text="dialogConfig.confirmText"
      :confirm-color="dialogConfig.color"
      :icon="dialogConfig.icon"
      @confirm="executeAction"
      @cancel="confirmDialog = false"
    />

    <!-- Dialog de vista previa -->
    <v-dialog v-model="previewDialog" max-width="760" scrollable>
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center justify-space-between pt-5 px-6">
          <span class="font-weight-bold">{{ previewItem?.titulo }}</span>
          <EstadoChip v-if="previewItem" :estado="previewItem.estado" />
        </v-card-title>

        <v-card-subtitle class="px-6 pb-2">
          <v-icon size="14">mdi-calendar</v-icon>
          {{ formatDate(previewItem?.fechaCreacion) }}
        </v-card-subtitle>

        <v-divider />

        <v-card-text class="pa-6">
          <!-- Imágenes de portada -->
          <div v-if="previewImages.length" class="mb-4">
            <v-img :src="previewImages[0]" rounded="xl" max-height="280" cover class="mb-2" />
          </div>

          <!-- Resumen -->
          <p v-if="previewItem?.resumen" class="text-subtitle-2 font-weight-medium text-medium-emphasis mb-4">
            {{ previewItem.resumen }}
          </p>

          <!-- Contenido HTML renderizado -->
          <div
            class="noticia-preview-content"
            v-html="previewItem?.contenidoHtml || previewItem?.contenidoTexto"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 gap-2">
          <v-btn
            v-if="previewItem?.estado !== 'aprobada'"
            color="success"
            variant="tonal"
            prepend-icon="mdi-check-circle"
            @click="confirmAction('aprobar', previewItem); previewDialog = false"
          >
            Aprobar
          </v-btn>
          <v-btn
            v-if="previewItem?.estado !== 'rechazada'"
            color="warning"
            variant="tonal"
            prepend-icon="mdi-close-circle"
            @click="confirmAction('rechazar', previewItem); previewDialog = false"
          >
            Rechazar
          </v-btn>
          <v-spacer />
          <v-btn variant="text" @click="previewDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const api = useApi()
const loading = ref(false)
const actionLoading = ref('')
const search = ref('')
const filtroEstado = ref('')
const noticias = ref<any[]>([])

// Preview
const previewDialog = ref(false)
const previewItem = ref<any>(null)
const previewImages = computed(() => {
  const imgs = previewItem.value?.imagenes
  if (!imgs) return []
  return imgs.split(',').map((u: string) => u.trim()).filter(Boolean)
})

// Confirm dialog
const confirmDialog = ref(false)
const pendingAction = ref<{ type: string; item: any } | null>(null)

const dialogConfig = computed(() => {
  const action = pendingAction.value?.type
  const titulo = pendingAction.value?.item?.titulo || ''
  if (action === 'aprobar')
    return { title: 'Aprobar noticia', message: `¿Aprobar "${titulo}"? Será visible en el catálogo público.`, confirmText: 'Aprobar', color: 'success', icon: 'mdi-check-circle' }
  if (action === 'rechazar')
    return { title: 'Rechazar noticia', message: `¿Rechazar "${titulo}"?`, confirmText: 'Rechazar', color: 'warning', icon: 'mdi-close-circle' }
  return { title: 'Eliminar noticia', message: `¿Eliminar permanentemente "${titulo}"?`, confirmText: 'Eliminar', color: 'error', icon: 'mdi-delete' }
})

const headers = [
  { title: 'Título',    key: 'titulo' },
  { title: 'Estado',    key: 'estado' },
  { title: 'Fecha',     key: 'fechaCreacion' },
  { title: 'Acciones',  key: 'actions', sortable: false },
]

const noticiasFiltradas = computed(() => {
  if (!filtroEstado.value) return noticias.value
  return noticias.value.filter(n => n.estado === filtroEstado.value)
})

const stats = computed(() => [
  { label: 'Total',      value: noticias.value.length,                                         icon: 'mdi-newspaper',       color: 'primary' },
  { label: 'Pendientes', value: countByEstado('pendiente'),                                    icon: 'mdi-clock-outline',   color: 'warning' },
  { label: 'Aprobadas',  value: countByEstado('aprobada'),                                     icon: 'mdi-check-circle',    color: 'success' },
  { label: 'Rechazadas', value: countByEstado('rechazada'),                                    icon: 'mdi-close-circle',    color: 'error' },
])

function countByEstado(estado: string) {
  return noticias.value.filter(n => n.estado === estado).length
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

function openPreview(item: any) {
  previewItem.value = item
  previewDialog.value = true
}

function confirmAction(type: string, item: any) {
  pendingAction.value = { type, item }
  confirmDialog.value = true
}

async function executeAction() {
  confirmDialog.value = false
  if (!pendingAction.value) return
  const { type, item } = pendingAction.value
  actionLoading.value = `${type}-${item.id}`
  try {
    if (type === 'aprobar') {
      const updated = await api.patch<any>(`/noticias/${item.id}/aprobar`)
      updateItem(updated)
    } else if (type === 'rechazar') {
      const updated = await api.patch<any>(`/noticias/${item.id}/rechazar`)
      updateItem(updated)
    } else if (type === 'eliminar') {
      await api.delete(`/noticias/${item.id}`)
      noticias.value = noticias.value.filter(n => n.id !== item.id)
    }
  } catch (e: any) {
    alert(e.message || 'Error al ejecutar la acción')
  } finally {
    actionLoading.value = ''
    pendingAction.value = null
  }
}

function updateItem(updated: any) {
  const idx = noticias.value.findIndex(n => n.id === updated.id)
  if (idx !== -1) noticias.value[idx] = updated
}

onMounted(async () => {
  loading.value = true
  try {
    noticias.value = await api.get<any[]>('/noticias/admin')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.noticia-preview-content :deep(h1) { font-size: 1.6rem; font-weight: 700; margin: 12px 0 8px; }
.noticia-preview-content :deep(h2) { font-size: 1.3rem; font-weight: 600; margin: 10px 0 6px; }
.noticia-preview-content :deep(h3) { font-size: 1.1rem; font-weight: 600; margin: 8px 0 4px; }
.noticia-preview-content :deep(p)  { margin-bottom: 10px; line-height: 1.7; }
.noticia-preview-content :deep(ul) { padding-left: 22px; list-style: disc; margin-bottom: 10px; }
.noticia-preview-content :deep(ol) { padding-left: 22px; list-style: decimal; margin-bottom: 10px; }
.noticia-preview-content :deep(blockquote) {
  border-left: 4px solid #1976D2;
  padding-left: 12px;
  color: #666;
  font-style: italic;
  margin: 8px 0;
}
</style>
