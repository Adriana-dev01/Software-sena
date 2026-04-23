<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">Gestión de Software</h1>
      <v-btn to="/admin/software/nuevo" color="primary" prepend-icon="mdi-plus">
        Nuevo software
      </v-btn>
    </div>

    <v-card rounded="xl" elevation="2">
      <v-card-text>
        <v-text-field
          v-model="search"
          placeholder="Buscar software..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
          clearable
        />

        <v-data-table
          :headers="headers"
          :items="softwareList"
          :loading="loading"
          :search="search"
          items-per-page="10"
          rounded="lg"
        >
          <template #item.urlImagen="{ item }">
            <v-avatar rounded="lg" size="44" class="my-1">
              <v-img
                :src="coverImage(item.urlImagen)"
                cover
              />
            </v-avatar>
          </template>

          <template #item.estado="{ item }">
            <v-chip
              :color="item.estado?.toLowerCase() === 'activo' ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ item.estado }}
            </v-chip>
          </template>

          <template #item.valoracion="{ item }">
            <div class="d-flex align-center gap-1">
              <v-icon color="amber" size="16">mdi-star</v-icon>
              <span class="text-body-2">{{ parseFloat(item.valoracion) || 0 }}</span>
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                color="primary"
                :to="`/admin/software/${item.id}/editar`"
              />
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click="confirmDelete(item)"
              />
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <ConfirmDialog
      v-model="deleteDialog"
      title="Eliminar software"
      :message="`¿Deseas eliminar '${selectedItem?.nombre}'? Esta acción no se puede deshacer.`"
      confirm-text="Eliminar"
      @confirm="deleteSoftware"
      @cancel="deleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const api = useApi()
const loading = ref(false)
const search = ref('')
const softwareList = ref<any[]>([])
const deleteDialog = ref(false)
const selectedItem = ref<any>(null)

const headers = [
  { title: '', key: 'urlImagen', sortable: false, width: '60px' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Tags', key: 'tags' },
  { title: 'Valoración', key: 'valoracion' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

function coverImage(urlImagen: string) {
  if (!urlImagen) return 'https://placehold.co/44x44?text=?'
  return urlImagen.split(',')[0].trim()
}

function confirmDelete(item: any) {
  selectedItem.value = item
  deleteDialog.value = true
}

async function deleteSoftware() {
  if (!selectedItem.value) return
  deleteDialog.value = false
  try {
    await api.delete(`/software/${selectedItem.value.id}`)
    softwareList.value = softwareList.value.filter(s => s.id !== selectedItem.value.id)
  } catch (e: any) {
    alert(e.message || 'Error al eliminar')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    softwareList.value = await api.get<any[]>('/software/admin')
  } finally {
    loading.value = false
  }
})
</script>
