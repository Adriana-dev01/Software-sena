<template>
  <v-dialog v-model="model" max-width="400" persistent>
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center gap-2 pt-5 px-6">
        <v-icon :color="iconColor" size="28">{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text class="px-6">{{ message }}</v-card-text>
      <v-card-actions class="px-6 pb-4 gap-2">
        <v-spacer />
        <v-btn variant="text" @click="emit('cancel')">Cancelar</v-btn>
        <v-btn :color="confirmColor" variant="tonal" @click="emit('confirm')">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>()

withDefaults(
  defineProps<{
    title?: string
    message?: string
    confirmText?: string
    confirmColor?: string
    icon?: string
    iconColor?: string
  }>(),
  {
    title: '¿Confirmar acción?',
    message: '¿Estás seguro de que deseas continuar?',
    confirmText: 'Confirmar',
    confirmColor: 'error',
    icon: 'mdi-alert-circle-outline',
    iconColor: 'error',
  }
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>
