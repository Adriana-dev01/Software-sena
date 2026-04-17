<template>
  <div>
    <!-- Hero -->
    <v-sheet color="teal-darken-2" class="py-12 px-4 text-white text-center">
      <v-icon size="56" class="mb-3">mdi-newspaper-variant-outline</v-icon>
      <h1 class="text-h4 font-weight-bold mb-2">Noticias</h1>
      <p class="text-subtitle-1 mb-0">Entérate de los últimos eventos y novedades del SENA</p>
    </v-sheet>

    <v-container class="py-8">
      <!-- Loading -->
      <v-row v-if="loading" justify="center" class="py-12">
        <v-progress-circular indeterminate color="teal" size="56" />
      </v-row>

      <!-- Error -->
      <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

      <!-- Sin resultados -->
      <div v-else-if="noticias.length === 0" class="text-center py-16">
        <v-icon size="80" color="grey-lighten-2">mdi-newspaper-remove</v-icon>
        <p class="text-h6 text-medium-emphasis mt-4">No hay noticias publicadas aún</p>
      </div>

      <!-- Grid de noticias -->
      <v-row v-else>
        <!-- Noticia destacada (primera) -->
        <v-col cols="12" class="mb-2">
          <v-card
            :to="`/noticias/${noticias[0].id}`"
            rounded="xl"
            elevation="3"
            hover
            class="d-flex flex-column flex-md-row overflow-hidden"
            max-height="300"
          >
            <v-img
              :src="coverImage(noticias[0]) || 'https://placehold.co/800x300?text=Noticia+Destacada'"
              :width="$vuetify.display.mdAndUp ? '45%' : '100%'"
              height="300"
              cover
            />
            <div class="pa-6 d-flex flex-column justify-center flex-grow-1">
              <v-chip size="x-small" color="teal" variant="tonal" class="mb-3 align-self-start">
                <v-icon start size="12">mdi-star</v-icon>
                Destacado
              </v-chip>
              <h2 class="text-h5 font-weight-bold mb-2">{{ noticias[0].titulo }}</h2>
              <p
                class="text-body-2 text-medium-emphasis mb-4"
                style="overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical"
              >
                {{ noticias[0].resumen || stripHtml(noticias[0].contenidoTexto) }}
              </p>
              <span class="text-caption text-medium-emphasis">
                <v-icon size="14">mdi-calendar</v-icon>
                {{ formatDate(noticias[0].fechaCreacion) }}
              </span>
            </div>
          </v-card>
        </v-col>

        <!-- Resto de noticias -->
        <v-col
          v-for="noticia in noticias.slice(1)"
          :key="noticia.id"
          cols="12" sm="6" md="4"
        >
          <NoticiaCard :noticia="noticia" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'default' })

const api = useApi()
const noticias = ref<any[]>([])
const loading = ref(false)
const error = ref('')

function coverImage(noticia: any) {
  const imgs = noticia?.imagenes
  if (!imgs) return null
  return imgs.split(',')[0].trim()
}

function stripHtml(html: string) {
  return html?.replace(/<[^>]*>/g, '') || ''
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

onMounted(async () => {
  loading.value = true
  try {
    noticias.value = await api.get<any[]>('/noticias')
  } catch (e: any) {
    error.value = e.message || 'Error al cargar noticias'
  } finally {
    loading.value = false
  }
})
</script>
