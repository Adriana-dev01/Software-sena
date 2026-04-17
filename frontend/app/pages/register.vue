<template>
  <v-card rounded="xl" elevation="4" class="pa-2">
    <v-card-title class="text-h6 font-weight-bold pt-4 px-6">Crear cuenta</v-card-title>
    <v-card-text class="px-6">
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = ''">
        {{ error }}
      </v-alert>

      <v-form @submit.prevent="handleRegister">
        <v-row dense>
          <v-col cols="6">
            <v-text-field
              v-model="form.firstName"
              label="Nombre"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Requerido']"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="form.lastName"
              label="Apellido"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Requerido']"
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="form.email"
          label="Correo electrónico"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="comfortable"
          class="mb-3"
          :rules="[v => !!v || 'Requerido']"
        />
        <v-text-field
          v-model="form.phone"
          label="Teléfono (opcional)"
          prepend-inner-icon="mdi-phone-outline"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />
        <v-text-field
          v-model="form.password"
          label="Contraseña"
          :type="showPass ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
          variant="outlined"
          density="comfortable"
          class="mb-4"
          :rules="[v => !!v || 'Requerido', v => v.length >= 6 || 'Mínimo 6 caracteres']"
          @click:append-inner="showPass = !showPass"
        />
        <v-btn type="submit" color="primary" size="large" block :loading="loading">
          Registrarse
        </v-btn>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-center pb-4">
      <span class="text-caption text-medium-emphasis">¿Ya tienes cuenta?</span>
      <v-btn to="/login" variant="text" size="small" color="primary" class="ml-1">
        Ingresar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { register } = useAuth()
const form = reactive({ firstName: '', lastName: '', email: '', password: '', phone: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

async function handleRegister() {
  if (!form.firstName || !form.lastName || !form.email || !form.password) return
  loading.value = true
  error.value = ''
  try {
    await register(form)
  } catch (e: any) {
    error.value = e.message || 'Error al registrar usuario'
  } finally {
    loading.value = false
  }
}
</script>
