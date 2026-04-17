<template>
  <div>
    <div class="d-flex align-center gap-3 mb-6">
      <v-btn to="/admin/software" icon="mdi-arrow-left" variant="text" />
      <h1 class="text-h5 font-weight-bold">Editar software</h1>
    </div>

    <v-progress-circular v-if="loadingData" indeterminate color="primary" class="d-block mx-auto my-12" />

    <template v-else-if="software">
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = ''">
        {{ error }}
      </v-alert>
      <v-alert v-if="success" type="success" variant="tonal" class="mb-4">
        Software actualizado correctamente
      </v-alert>

      <SoftwareForm
        :software="software"
        :loading="loading"
        @submit="handleUpdate"
        @cancel="router.push('/admin/software')"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const route = useRoute()
const router = useRouter()
const api = useApi()
const software = ref<any>(null)
const loadingData = ref(true)
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleUpdate(formData: FormData) {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    await api.patch(`/software/${route.params.id}`, formData)
    success.value = true
    setTimeout(() => router.push('/admin/software'), 1200)
  } catch (e: any) {
    error.value = e.message || 'Error al actualizar software'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    software.value = await api.get<any>(`/software/${route.params.id}`)
  } finally {
    loadingData.value = false
  }
})
</script>
