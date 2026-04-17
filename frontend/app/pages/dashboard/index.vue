<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">Catálogo de Software</h1>

    <v-text-field
      v-model="searchTag"
      placeholder="Buscar por etiqueta..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="comfortable"
      clearable
      hide-details
      class="mb-6"
      style="max-width: 480px"
      @keyup.enter="fetchSoftware"
      @click:clear="clearSearch"
    />

    <v-row v-if="loading" justify="center" class="py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
    </v-row>

    <div v-else-if="softwareList.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-package-variant-remove</v-icon>
      <p class="text-subtitle-1 text-medium-emphasis mt-4">No hay resultados</p>
    </div>

    <v-row v-else>
      <v-col v-for="item in softwareList" :key="item.id" cols="12" sm="6" md="4" lg="3">
        <SoftwareCard :software="item" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const api = useApi()
const searchTag = ref('')
const softwareList = ref<any[]>([])
const loading = ref(false)

async function fetchSoftware() {
  loading.value = true
  try {
    if (searchTag.value?.trim()) {
      softwareList.value = await api.get<any[]>('/software/search', { tag: searchTag.value.trim() })
    } else {
      softwareList.value = await api.get<any[]>('/software')
    }
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
