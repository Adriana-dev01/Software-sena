<template>
  <v-card
    :to="`/software/${software.id}`"
    rounded="xl"
    elevation="2"
    hover
    height="100%"
    class="d-flex flex-column"
  >
    <v-img
      :src="coverImage || 'https://via.placeholder.com/400x200?text=Sin+imagen'"
      height="160"
      cover
    >
      <template #placeholder>
        <v-skeleton-loader type="image" />
      </template>
    </v-img>

    <v-card-title class="text-subtitle-1 font-weight-bold pt-3 pb-1">
      {{ software.nombre }}
    </v-card-title>

    <v-card-text class="flex-grow-1 pb-1">
      <p class="text-body-2 text-medium-emphasis" style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
        {{ software.descripcion || 'Sin descripción.' }}
      </p>
    </v-card-text>

    <v-card-text class="pt-0 pb-2">
      <div class="d-flex flex-wrap gap-1 mb-2">
        <v-chip
          v-for="tag in tags"
          :key="tag"
          size="x-small"
          color="primary"
          variant="tonal"
        >{{ tag }}</v-chip>
      </div>
      <div class="d-flex align-center">
        <v-rating
          :model-value="ratingValue"
          readonly
          density="compact"
          color="amber"
          size="small"
          half-increments
        />
        <span class="text-caption ml-1 text-medium-emphasis">{{ ratingValue }}/5</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{ software: any }>()

// valoracion llega como string desde el backend ("0.0"), lo convertimos a número
const ratingValue = computed(() => parseFloat(props.software?.valoracion) || 0)

const coverImage = computed(() => {
  const url = props.software?.urlImagen
  if (!url) return null
  return url.split(',')[0].trim()
})

const tags = computed(() => {
  const t = props.software?.tags
  if (!t) return []
  return t.split(',').map((s: string) => s.trim()).filter(Boolean).slice(0, 3)
})
</script>
