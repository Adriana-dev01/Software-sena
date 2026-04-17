<script setup lang="ts">
// La página de inicio carga las noticias públicas
definePageMeta({ layout: false })
await navigateTo('/noticias', { replace: true })
</script>
