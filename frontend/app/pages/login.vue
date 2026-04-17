<template>
  <v-card rounded="xl" elevation="4" class="pa-2">
    <v-card-title class="text-h6 font-weight-bold pt-4 px-6">Iniciar sesión</v-card-title>
    <v-card-text class="px-6">
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = ''">
        {{ error }}
      </v-alert>

      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="form.email"
          label="Correo electrónico"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="comfortable"
          class="mb-3"
          :rules="[v => !!v || 'Campo requerido']"
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
          :rules="[v => !!v || 'Campo requerido']"
          @click:append-inner="showPass = !showPass"
        />
        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          :loading="loading"
        >
          Ingresar
        </v-btn>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-center pb-4">
      <span class="text-caption text-medium-emphasis">¿No tienes cuenta?</span>
      <v-btn to="/register" variant="text" size="small" color="primary" class="ml-1">
        Regístrate
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { login } = useAuth()
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

async function handleLogin() {
  if (!form.email || !form.password) return
  loading.value = true
  error.value = ''
  try {
    await login(form.email, form.password)
  } catch (e: any) {
    error.value = e.message || 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>
