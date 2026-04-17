<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">Mi perfil</h1>

    <v-row justify="center">
      <v-col cols="12" md="7" lg="6">
        <v-card rounded="xl" elevation="2">
          <v-card-text class="pa-6">
            <div class="text-center mb-6">
              <v-avatar size="80" color="teal-darken-2" class="mb-3">
                <span class="text-h5 text-white font-weight-bold">{{ initials }}</span>
              </v-avatar>
              <div class="text-h6 font-weight-bold">{{ authStore.fullName }}</div>
              <v-chip size="small" color="teal" variant="tonal" class="mt-1">
                <v-icon start>mdi-newspaper</v-icon>
                {{ authStore.user?.role }}
              </v-chip>
            </div>

            <v-alert v-if="success" type="success" variant="tonal" class="mb-4" closable @click:close="success = false">
              Perfil actualizado correctamente
            </v-alert>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = ''">
              {{ error }}
            </v-alert>

            <v-form @submit.prevent="handleUpdate">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field v-model="form.firstName" label="Nombre" variant="outlined" density="comfortable" :rules="[v => !!v || 'Requerido']" />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="form.lastName" label="Apellido" variant="outlined" density="comfortable" :rules="[v => !!v || 'Requerido']" />
                </v-col>
              </v-row>
              <v-text-field v-model="form.email" label="Correo electrónico" type="email" variant="outlined" density="comfortable" class="mb-3" />
              <v-text-field v-model="form.phone" label="Teléfono" variant="outlined" density="comfortable" class="mb-4" />
              <v-btn type="submit" color="teal-darken-2" block size="large" :loading="loading">
                Guardar cambios
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'noticias' })

const authStore = useAuthStore()
const api = useApi()
const loading = ref(false)
const success = ref(false)
const error = ref('')

const form = reactive({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
})

const initials = computed(() =>
  `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase()
)

async function handleUpdate() {
  loading.value = true
  success.value = false
  error.value = ''
  try {
    const updated = await api.patch<any>(`/users/${authStore.user?.id}`, form)
    authStore.updateUser(updated)
    success.value = true
  } catch (e: any) {
    error.value = e.message || 'Error al actualizar perfil'
  } finally {
    loading.value = false
  }
}
</script>
