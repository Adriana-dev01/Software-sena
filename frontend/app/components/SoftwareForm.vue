<template>
  <v-card rounded="xl" elevation="0">
    <v-card-text>
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-row dense>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="local.nombre"
              label="Nombre del software *"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Requerido', v => v.length <= 255 || 'Máx 255 caracteres']"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="local.estado"
              label="Estado *"
              :items="['activo', 'inactivo']"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Requerido']"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="local.descripcion"
              label="Descripción"
              variant="outlined"
              density="comfortable"
              rows="3"
              auto-grow
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="local.tags"
              label="Etiquetas (separadas por coma)"
              variant="outlined"
              density="comfortable"
              hint="Ej: web, mobile, backend"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="local.autores"
              label="Autores"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="local.urlAplicacion"
              label="URL de la aplicación"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-link"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-slider
              v-model="local.valoracion"
              label="Valoración"
              min="0"
              max="5"
              step="0.5"
              thumb-label
              color="amber"
              track-color="amber-lighten-3"
            >
              <template #append>
                <span class="text-body-2 font-weight-bold">{{ local.valoracion }}/5</span>
              </template>
            </v-slider>
          </v-col>

          <!-- Imágenes actuales -->
          <v-col v-if="currentImages.length" cols="12">
            <p class="text-subtitle-2 font-weight-bold mb-2">Imágenes actuales</p>
            <div class="d-flex flex-wrap gap-3">
              <div v-for="(img, i) in currentImages" :key="i" class="position-relative">
                <v-img :src="img" width="100" height="80" rounded="lg" cover />
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  color="error"
                  class="position-absolute"
                  style="top: -8px; right: -8px;"
                  @click="removeCurrentImage(i)"
                />
              </div>
            </div>
          </v-col>

          <!-- Upload nuevas imágenes -->
          <v-col cols="12">
            <v-file-input
              v-model="newImages"
              label="Agregar imágenes"
              prepend-inner-icon="mdi-image-plus"
              prepend-icon=""
              variant="outlined"
              density="comfortable"
              accept="image/*"
              multiple
              show-size
            />
          </v-col>
        </v-row>

        <div class="d-flex gap-3 mt-2">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="loading"
          >
            {{ props.software ? 'Guardar cambios' : 'Crear software' }}
          </v-btn>
          <v-btn variant="text" size="large" @click="emit('cancel')">Cancelar</v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  software?: any
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: FormData]
  cancel: []
}>()

const formRef = ref()
const newImages = ref<File[]>([])
const removedImages = ref<string[]>([])

const local = reactive({
  nombre: '',
  descripcion: '',
  tags: '',
  autores: '',
  urlAplicacion: '',
  estado: 'activo',
  valoracion: 0,
  urlImagen: '',
})

const currentImages = computed(() => {
  const urls = local.urlImagen
    ? local.urlImagen.split(',').map((u: string) => u.trim()).filter(Boolean)
    : []
  return urls.filter((u: string) => !removedImages.value.includes(u))
})

function removeCurrentImage(index: number) {
  const img = currentImages.value[index]
  removedImages.value.push(img)
}

watch(
  () => props.software,
  (sw) => {
    if (sw) {
      local.nombre = sw.nombre || ''
      local.descripcion = sw.descripcion || ''
      local.tags = sw.tags || ''
      local.autores = sw.autores || ''
      local.urlAplicacion = sw.urlAplicacion || ''
      local.estado = sw.estado || 'activo'
      local.valoracion = parseFloat(sw.valoracion) || 0
      local.urlImagen = sw.urlImagen || ''
    }
  },
  { immediate: true }
)

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const fd = new FormData()
  fd.append('nombre', local.nombre)
  fd.append('descripcion', local.descripcion || '')
  fd.append('tags', local.tags || '')
  fd.append('autores', local.autores || '')
  fd.append('urlAplicacion', local.urlAplicacion || '')
  fd.append('estado', local.estado)
  fd.append('valoracion', String(local.valoracion))

  if (removedImages.value.length) {
    fd.append('imagenesAEliminar', removedImages.value.join(','))
  }

  if (currentImages.value.length) {
    fd.append('urlImagen', currentImages.value.join(','))
  }

  for (const file of newImages.value) {
    fd.append('imagenes', file)
  }

  emit('submit', fd)
}
</script>
