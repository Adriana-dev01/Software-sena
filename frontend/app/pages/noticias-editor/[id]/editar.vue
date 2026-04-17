<template>
  <div>
    <div class="d-flex align-center gap-3 mb-6">
      <v-btn to="/noticias-editor" icon="mdi-arrow-left" variant="text" />
      <h1 class="text-h5 font-weight-bold">Editar noticia</h1>
      <EstadoChip v-if="noticia" :estado="noticia.estado" class="ml-2" />
    </div>

    <v-progress-circular v-if="loadingData" indeterminate color="teal" class="d-block mx-auto my-12" />

    <!-- Bloqueo si no está en pendiente -->
    <v-alert
      v-else-if="noticia && noticia.estado !== 'pendiente'"
      type="warning"
      variant="tonal"
      icon="mdi-lock-outline"
      class="mb-4"
    >
      Esta noticia está en estado <strong>{{ noticia.estado }}</strong> y no puede ser editada.
      Solo las noticias en estado <strong>pendiente</strong> pueden modificarse.
    </v-alert>

    <template v-else-if="noticia">
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = ''">
        {{ error }}
      </v-alert>
      <v-alert v-if="success" type="success" variant="tonal" class="mb-4">
        Noticia actualizada correctamente
      </v-alert>

      <v-card rounded="xl" elevation="2">
        <v-card-text class="pa-6">
          <v-form ref="formRef" @submit.prevent="handleUpdate">
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="form.titulo"
                  label="Título *"
                  variant="outlined"
                  density="comfortable"
                  counter="255"
                  :rules="[v => !!v || 'Requerido', v => v.length <= 255 || 'Máx 255']"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.resumen"
                  label="Resumen (opcional)"
                  variant="outlined"
                  density="comfortable"
                  rows="2"
                  auto-grow
                />
              </v-col>

              <v-col cols="12">
                <div class="text-subtitle-2 font-weight-bold mb-2">Contenido *</div>
                <NoticiaEditor
                  v-model="form.contenidoHtml"
                  @update:text="form.contenidoTexto = $event"
                />
                <div v-if="contentError" class="text-caption text-error mt-1">{{ contentError }}</div>
              </v-col>

              <!-- Imágenes actuales -->
              <v-col v-if="currentImages.length" cols="12" class="mt-2">
                <div class="text-subtitle-2 font-weight-bold mb-2">Imágenes actuales</div>
                <div class="d-flex flex-wrap gap-3">
                  <div v-for="(img, i) in currentImages" :key="i" class="position-relative">
                    <v-img :src="img" width="100" height="75" rounded="lg" cover />
                    <v-btn
                      icon="mdi-close"
                      size="x-small"
                      color="error"
                      class="position-absolute"
                      style="top:-8px;right:-8px"
                      @click="removeImage(img)"
                    />
                  </div>
                </div>
              </v-col>

              <!-- Nuevas imágenes -->
              <v-col cols="12" class="mt-2">
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

            <div class="d-flex gap-3 mt-4">
              <v-btn
                type="submit"
                color="teal-darken-2"
                size="large"
                prepend-icon="mdi-content-save"
                :loading="loading"
              >
                Guardar cambios
              </v-btn>
              <v-btn variant="text" size="large" to="/noticias-editor">Cancelar</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'noticias' })

const route = useRoute()
const router = useRouter()
const api = useApi()
const formRef = ref()
const noticia = ref<any>(null)
const loadingData = ref(true)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const contentError = ref('')
const newImages = ref<File[]>([])
const removedImages = ref<string[]>([])

const form = reactive({
  titulo: '',
  resumen: '',
  contenidoHtml: '',
  contenidoTexto: '',
})

const currentImages = computed(() => {
  const imgs = noticia.value?.imagenes
  if (!imgs) return []
  return imgs.split(',').map((u: string) => u.trim()).filter((u: string) => !removedImages.value.includes(u))
})

function removeImage(url: string) {
  removedImages.value.push(url)
}

async function handleUpdate() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  if (!form.contenidoTexto.trim()) {
    contentError.value = 'El contenido es requerido'
    return
  }
  contentError.value = ''
  loading.value = true
  error.value = ''
  success.value = false
  try {
    const fd = new FormData()
    fd.append('titulo', form.titulo)
    fd.append('resumen', form.resumen || '')
    fd.append('contenidoTexto', form.contenidoTexto)
    fd.append('contenidoHtml', form.contenidoHtml)
    if (removedImages.value.length) {
      fd.append('imagenesAEliminar', removedImages.value.join(','))
    }
    for (const file of newImages.value) {
      fd.append('imagenes', file)
    }
    await api.patch(`/noticias/${route.params.id}`, fd)
    success.value = true
    setTimeout(() => router.push('/noticias-editor'), 1200)
  } catch (e: any) {
    error.value = e.message || 'Error al actualizar la noticia'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const data = await api.get<any>(`/noticias/${route.params.id}`)
    noticia.value = data
    form.titulo = data.titulo || ''
    form.resumen = data.resumen || ''
    form.contenidoHtml = data.contenidoHtml || data.contenidoTexto || ''
    form.contenidoTexto = data.contenidoTexto || ''
  } finally {
    loadingData.value = false
  }
})
</script>
