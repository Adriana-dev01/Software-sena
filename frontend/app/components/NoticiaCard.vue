<template>
  <v-card
    :to="`/noticias/${noticia.id}`"
    rounded="xl"
    elevation="2"
    hover
    height="100%"
    class="d-flex flex-column"
  >
    <v-img
      :src="coverImage || 'https://placehold.co/600x240?text=Noticia'"
      height="180"
      cover
    >
      <template #placeholder>
        <v-skeleton-loader type="image" />
      </template>
    </v-img>

    <v-card-title class="text-subtitle-1 font-weight-bold pt-3 pb-1 text-wrap">
      {{ noticia.titulo }}
    </v-card-title>

    <v-card-text class="flex-grow-1 pb-1">
      <p
        class="text-body-2 text-medium-emphasis"
        style="overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical"
      >
        {{ noticia.resumen || stripHtml(noticia.contenidoTexto) }}
      </p>
    </v-card-text>

    <v-card-text class="pt-0 pb-3">
      <div class="d-flex align-center justify-space-between">
        <span class="text-caption text-medium-emphasis">
          <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
          {{ formatDate(noticia.fechaCreacion) }}
        </span>
        <v-chip size="x-small" color="primary" variant="tonal" prepend-icon="mdi-newspaper">
          Noticia
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{ noticia: any }>()

const coverImage = computed(() => {
  const imgs = props.noticia?.imagenes
  if (!imgs) return null
  return imgs.split(',')[0].trim()
})

function stripHtml(html: string) {
  return html?.replace(/<[^>]*>/g, '') || ''
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}
</script>
