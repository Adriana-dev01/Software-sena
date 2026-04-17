<template>
  <div>
    <!-- Hero -->
    <v-sheet color="primary" class="py-12 px-4 text-white text-center">
      <v-icon size="64" class="mb-3">mdi-package-variant-closed</v-icon>
      <h1 class="text-h4 font-weight-bold mb-2">Catálogo de Software</h1>
      <p class="text-subtitle-1 mb-6">Explora y descubre aplicaciones desarrolladas en el SENA</p>
      <v-text-field
        v-model="searchTag"
        placeholder="Buscar por etiqueta (ej: web, mobile, backend...)"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        density="comfortable"
        clearable
        hide-details
        class="mx-auto"
        style="max-width: 500px"
        @keyup.enter="fetchSoftware"
        @click:clear="clearSearch"
      />
    </v-sheet>

    <v-container class="py-8">
      <!-- Loading -->
      <v-row v-if="loading" justify="center" class="py-12">
        <v-progress-circular indeterminate color="primary" size="56" />
      </v-row>

      <!-- Error -->
      <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

      <!-- Sin resultados -->
      <div v-else-if="softwareList.length === 0" class="text-center py-12">
        <v-icon size="72" color="grey-lighten-1">mdi-package-variant-remove</v-icon>
        <p class="text-h6 text-medium-emphasis mt-4">No se encontraron resultados</p>
      </div>

      <!-- Grid -->
      <v-row v-else>
        <v-col
          v-for="item in softwareList"
          :key="item.id"
          cols="12" sm="6" md="4" lg="3"
        >
          <SoftwareCard :software="item" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'default' })

const api = useApi()
const searchTag = ref('')
const softwareList = ref<any[]>([])
const loading = ref(false)
const error = ref('')

async function fetchSoftware() {
  loading.value = true
  error.value = ''
  try {
    if (searchTag.value?.trim()) {
      softwareList.value = await api.get<any[]>('/software/search', { tag: searchTag.value.trim() })
    } else {
      softwareList.value = await api.get<any[]>('/software')
    }
  } catch (e: any) {
    error.value = e.message || 'Error al cargar el catálogo'
  } finally {
    loading.value = false
  }
}

function clearSearch() {
  searchTag.value = ''
  fetchSoftware()
}

onMounted(fetchSoftware)
</script>
