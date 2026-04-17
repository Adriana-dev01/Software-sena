<template>
  <div>
    <v-container class="py-8" v-if="!loading && software">
      <v-btn to="/catalogo" prepend-icon="mdi-arrow-left" variant="text" class="mb-4">
        Volver al catálogo
      </v-btn>

      <v-row>
        <!-- Imágenes -->
        <v-col cols="12" md="5">
          <v-carousel
            v-if="images.length"
            hide-delimiters
            show-arrows="hover"
            height="320"
            rounded="xl"
          >
            <v-carousel-item
              v-for="(img, i) in images"
              :key="i"
              :src="img"
              cover
            />
          </v-carousel>
          <v-img
            v-else
            height="320"
            src="https://via.placeholder.com/600x320?text=Sin+imagen"
            rounded="xl"
            cover
          />
        </v-col>

        <!-- Detalle -->
        <v-col cols="12" md="7">
          <div class="d-flex align-center gap-2 mb-2">
            <v-chip
              v-for="tag in tags"
              :key="tag"
              color="primary"
              size="small"
              variant="tonal"
            >{{ tag }}</v-chip>
          </div>

          <h1 class="text-h4 font-weight-bold mb-2">{{ software.nombre }}</h1>

          <div class="d-flex align-center mb-4">
            <v-rating
              :model-value="ratingValue"
              readonly
              density="compact"
              color="amber"
              half-increments
            />
            <span class="text-caption ml-2 text-medium-emphasis">{{ ratingValue }}/5</span>
          </div>

          <p class="text-body-1 mb-6 text-medium-emphasis">{{ software.descripcion || 'Sin descripción.' }}</p>

          <v-divider class="mb-4" />

          <div v-if="software.autores" class="mb-3">
            <span class="text-subtitle-2 font-weight-bold">Autores:</span>
            <span class="text-body-2 ml-2">{{ software.autores }}</span>
          </div>

          <div class="mb-3">
            <span class="text-subtitle-2 font-weight-bold">Fecha de creación:</span>
            <span class="text-body-2 ml-2">{{ formatDate(software.fechaCreacion) }}</span>
          </div>

          <v-btn
            v-if="software.urlAplicacion"
            :href="software.urlAplicacion"
            target="_blank"
            color="primary"
            size="large"
            prepend-icon="mdi-open-in-new"
            class="mt-4"
          >
            Abrir aplicación
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else-if="loading" class="py-16 text-center">
      <v-progress-circular indeterminate color="primary" size="56" />
    </v-container>

    <v-container v-else class="py-12 text-center">
      <v-icon size="72" color="grey">mdi-alert-circle-outline</v-icon>
      <p class="text-h6 mt-4">Software no encontrado</p>
      <v-btn to="/catalogo" variant="text" color="primary" class="mt-2">Volver al catálogo</v-btn>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'default' })

const route = useRoute()
const api = useApi()
const software = ref<any>(null)
const loading = ref(true)

// valoracion llega como string desde el backend ("0.0")
const ratingValue = computed(() => parseFloat(software.value?.valoracion) || 0)

const images = computed(() =>
  software.value?.urlImagen
    ? software.value.urlImagen.split(',').map((u: string) => u.trim()).filter(Boolean)
    : []
)

const tags = computed(() =>
  software.value?.tags
    ? software.value.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : []
)

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  try {
    software.value = await api.get<any>(`/software/${route.params.id}`)
  } catch {
    software.value = null
  } finally {
    loading.value = false
  }
})
</script>
