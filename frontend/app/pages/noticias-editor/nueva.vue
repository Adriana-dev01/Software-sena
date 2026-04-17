<template>
  <div>
    <div class="d-flex align-center gap-3 mb-6">
      <v-btn to="/noticias-editor" icon="mdi-arrow-left" variant="text" />
      <h1 class="text-h5 font-weight-bold">Nueva noticia</h1>
    </div>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <v-card rounded="xl" elevation="2">
      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="handleCreate">
          <v-row dense>
            <!-- Título -->
            <v-col cols="12">
              <v-text-field
                v-model="form.titulo"
                label="Título de la noticia *"
                variant="outlined"
                density="comfortable"
                counter="255"
                :rules="[v => !!v || 'Requerido', v => v.length <= 255 || 'Máx 255 caracteres']"
              />
            </v-col>

            <!-- Resumen -->
            <v-col cols="12">
              <v-textarea
                v-model="form.resumen"
                label="Resumen (opcional)"
                variant="outlined"
                density="comfortable"
                rows="2"
                auto-grow
                hint="Breve descripción visible en el listado público"
                persistent-hint
              />
            </v-col>

            <!-- Editor WYSIWYG -->
            <v-col cols="12">
              <div class="text-subtitle-2 font-weight-bold mb-2">
                Contenido de la noticia *
              </div>
              <NoticiaEditor
                v-model="form.contenidoHtml"
                placeholder="Redacta aquí el contenido completo de la noticia..."
                @update:text="form.contenidoTexto = $event"
              />
              <div v-if="contentError" class="text-caption text-error mt-1">
                {{ contentError }}
              </div>
            </v-col>

            <!-- Imágenes -->
            <v-col cols="12" class="mt-2">
              <v-file-input
                v-model="imagenes"
                label="Imágenes (máx. 10)"
                prepend-inner-icon="mdi-image-plus"
                prepend-icon=""
                variant="outlined"
                density="comfortable"
                accept="image/*"
                multiple
                show-size
                :rules="[v => !v || v.length <= 10 || 'Máximo 10 imágenes']"
              />
            </v-col>
          </v-row>

          <!-- Preview imágenes seleccionadas -->
          <div v-if="imagenes.length" class="d-flex flex-wrap gap-2 mb-4">
            <v-chip
              v-for="(file, i) in imagenes"
              :key="i"
              size="small"
              closable
              @click:close="imagenes.splice(i, 1)"
            >
              {{ file.name }}
            </v-chip>
          </div>

          <div class="d-flex gap-3 mt-4">
            <v-btn
              type="submit"
              color="teal-darken-2"
              size="large"
              prepend-icon="mdi-send"
              :loading="loading"
            >
              Publicar noticia
            </v-btn>
            <v-btn variant="text" size="large" to="/noticias-editor">Cancelar</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'noticias' })

const api = useApi()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const error = ref('')
const contentError = ref('')
const imagenes = ref<File[]>([])

const form = reactive({
  titulo: '',
  resumen: '',
  contenidoHtml: '',
  contenidoTexto: '',
})

async function handleCreate() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  if (!form.contenidoTexto.trim()) {
    contentError.value = 'El contenido es requerido'
    return
  }
  contentError.value = ''

  loading.value = true
  error.value = ''
  try {
    const fd = new FormData()
    fd.append('titulo', form.titulo)
    fd.append('resumen', form.resumen || '')
    fd.append('contenidoTexto', form.contenidoTexto)
    fd.append('contenidoHtml', form.contenidoHtml)
    for (const file of imagenes.value) {
      fd.append('imagenes', file)
    }
    await api.post('/noticias', fd)
    router.push('/noticias-editor')
  } catch (e: any) {
    error.value = e.message || 'Error al crear la noticia'
  } finally {
    loading.value = false
  }
}
</script>
