<template>
  <v-chip :color="config.color" :prepend-icon="config.icon" size="small" variant="tonal">
    {{ config.label }}
  </v-chip>
</template>

<script setup lang="ts">
const props = defineProps<{ estado: string }>()

const config = computed(() => {
  switch (props.estado) {
    case 'aprobada':
      return { color: 'success', icon: 'mdi-check-circle', label: 'Aprobada' }
    case 'rechazada':
      return { color: 'error', icon: 'mdi-close-circle', label: 'Rechazada' }
    default:
      return { color: 'warning', icon: 'mdi-clock-outline', label: 'Pendiente' }
  }
})
</script>
