<template>
  <div>
    <v-progress-circular v-if="loading" indeterminate color="teal" class="d-block mx-auto my-16" size="56" />

    <template v-else-if="noticia">
      <!-- Imagen de portada a full width -->
      <v-img
        v-if="coverImage"
        :src="coverImage"
        height="380"
        cover
        class="w-100"
      >
        <div
          class="d-flex align-end h-100 w-100 pa-0"
          style="background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)"
        >
          <v-container class="pb-8">
            <v-chip size="small" color="teal" variant="elevated" class="mb-3">
              <v-icon start>mdi-newspaper</v-icon> Noticia
            </v-chip>
            <h1 class="text-h3 font-weight-bold text-white">{{ noticia.titulo }}</h1>
          </v-container>
        </div>
      </v-img>

      <v-container class="py-8" style="max-width: 820px">
        <v-btn to="/noticias" prepend-icon="mdi-arrow-left" variant="text" color="teal" class="mb-4">
          Volver a noticias
        </v-btn>

        <!-- Título (si no hay imagen de portada) -->
        <h1 v-if="!coverImage" class="text-h4 font-weight-bold mb-4">{{ noticia.titulo }}</h1>

        <!-- Meta info -->
        <div class="d-flex align-center gap-4 mb-6 flex-wrap">
          <span class="text-caption text-medium-emphasis">
            <v-icon size="15">mdi-calendar</v-icon>
            {{ formatDate(noticia.fechaCreacion) }}
          </span>
          <span v-if="noticia.fechaActualizacion !== noticia.fechaCreacion" class="text-caption text-medium-emphasis">
            <v-icon size="15">mdi-update</v-icon>
            Actualizado: {{ formatDate(noticia.fechaActualizacion) }}
          </span>
        </div>

        <!-- Resumen destacado -->
        <v-sheet
          v-if="noticia.resumen"
          color="teal-lighten-5"
          rounded="lg"
          class="pa-4 mb-6 border-s-4 border-teal"
        >
          <p class="text-subtitle-1 font-weight-medium text-teal-darken-3 mb-0">
            {{ noticia.resumen }}
          </p>
        </v-sheet>

        <!-- Galería de imágenes adicionales -->
        <v-row v-if="extraImages.length" class="mb-6">
          <v-col v-for="(img, i) in extraImages" :key="i" cols="6" sm="4">
            <v-img :src="img" rounded="lg" height="140" cover />
          </v-col>
        </v-row>

        <!-- Contenido HTML renderizado -->
        <div class="noticia-contenido" v-html="noticia.contenidoHtml || noticia.contenidoTexto" />

        <v-divider class="my-8" />

        <v-btn to="/noticias" prepend-icon="mdi-arrow-left" variant="tonal" color="teal">
          Ver más noticias
        </v-btn>
      </v-container>
    </template>

    <!-- No encontrada -->
    <v-container v-else class="text-center py-16">
      <v-icon size="80" color="grey-lighten-2">mdi-newspaper-remove</v-icon>
      <p class="text-h6 text-medium-emphasis mt-4">Noticia no encontrada</p>
      <v-btn to="/noticias" color="teal" variant="tonal" class="mt-4">Ver noticias</v-btn>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'default' })

const route = useRoute()
const api = useApi()
const noticia = ref<any>(null)
const loading = ref(true)

const allImages = computed(() => {
  const imgs = noticia.value?.imagenes
  if (!imgs) return []
  return imgs.split(',').map((u: string) => u.trim()).filter(Boolean)
})

const coverImage = computed(() => allImages.value[0] || null)
const extraImages = computed(() => allImages.value.slice(1))

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

onMounted(async () => {
  try {
    noticia.value = await api.get<any>(`/noticias/${route.params.id}`)
  } catch {
    noticia.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.noticia-contenido :deep(h1) { font-size: 1.8rem; font-weight: 700; margin: 16px 0 10px; }
.noticia-contenido :deep(h2) { font-size: 1.4rem; font-weight: 600; margin: 14px 0 8px; }
.noticia-contenido :deep(h3) { font-size: 1.15rem; font-weight: 600; margin: 10px 0 6px; }
.noticia-contenido :deep(p)  { margin-bottom: 12px; line-height: 1.8; font-size: 1rem; }
.noticia-contenido :deep(ul) { padding-left: 24px; list-style: disc; margin-bottom: 12px; }
.noticia-contenido :deep(ol) { padding-left: 24px; list-style: decimal; margin-bottom: 12px; }
.noticia-contenido :deep(li) { margin-bottom: 4px; }
.noticia-contenido :deep(blockquote) {
  border-left: 4px solid #00695C;
  padding: 8px 16px;
  color: #555;
  font-style: italic;
  background: #f5f5f5;
  border-radius: 0 8px 8px 0;
  margin: 12px 0;
}
.noticia-contenido :deep(a) { color: #00695C; text-decoration: underline; }
.noticia-contenido :deep(strong) { font-weight: 700; }
.noticia-contenido :deep(em) { font-style: italic; }
</style>
