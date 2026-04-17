<template>
  <div>
    <div class="d-flex align-center gap-3 mb-6">
      <v-btn to="/admin/software" icon="mdi-arrow-left" variant="text" />
      <h1 class="text-h5 font-weight-bold">Nuevo software</h1>
    </div>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <SoftwareForm :loading="loading" @submit="handleCreate" @cancel="router.push('/admin/software')" />
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const api = useApi()
const router = useRouter()
const loading = ref(false)
const error = ref('')

async function handleCreate(formData: FormData) {
  loading.value = true
  error.value = ''
  try {
    await api.post('/software', formData)
    router.push('/admin/software')
  } catch (e: any) {
    error.value = e.message || 'Error al crear software'
  } finally {
    loading.value = false
  }
}
</script>
