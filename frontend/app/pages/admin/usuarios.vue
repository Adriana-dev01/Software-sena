<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">Gestión de Usuarios</h1>

    <v-card rounded="xl" elevation="2">
      <v-card-text>
        <v-text-field
          v-model="search"
          placeholder="Buscar usuario..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
          clearable
        />

        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          :search="search"
          items-per-page="10"
          rounded="lg"
        >
          <template #item.avatar="{ item }">
            <v-avatar color="primary" size="36" class="my-1">
              <span class="text-caption font-weight-bold text-white">
                {{ initials(item) }}
              </span>
            </v-avatar>
          </template>

          <template #item.fullName="{ item }">
            {{ item.firstName }} {{ item.lastName }}
          </template>

          <template #item.role="{ item }">
            <v-chip
              :color="roleColor(item.role)"
              size="small"
              variant="tonal"
            >
              {{ item.role }}
            </v-chip>
          </template>

          <template #item.isActive="{ item }">
            <v-chip
              :color="item.isActive ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ item.isActive ? 'Activo' : 'Inactivo' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              v-if="item.isActive"
              icon="mdi-account-off"
              size="small"
              variant="text"
              color="error"
              @click="confirmDeactivate(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <ConfirmDialog
      v-model="deactivateDialog"
      title="Desactivar usuario"
      :message="`¿Deseas desactivar a ${selectedUser?.firstName} ${selectedUser?.lastName}? No podrá iniciar sesión.`"
      confirm-text="Desactivar"
      icon="mdi-account-off"
      @confirm="deactivateUser"
      @cancel="deactivateDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const api = useApi()
const loading = ref(false)
const search = ref('')
const users = ref<any[]>([])
const deactivateDialog = ref(false)
const selectedUser = ref<any>(null)

const headers = [
  { title: '', key: 'avatar', sortable: false, width: '56px' },
  { title: 'Nombre', key: 'fullName' },
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'role' },
  { title: 'Estado', key: 'isActive' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

function initials(user: any) {
  return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
}

function roleColor(role: string) {
  return role === 'super_admin' ? 'red' : role === 'noticias' ? 'orange' : 'blue'
}

function confirmDeactivate(user: any) {
  selectedUser.value = user
  deactivateDialog.value = true
}

async function deactivateUser() {
  if (!selectedUser.value) return
  deactivateDialog.value = false
  try {
    await api.delete(`/users/${selectedUser.value.id}`)
    const idx = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (idx !== -1) users.value[idx].isActive = false
  } catch (e: any) {
    alert(e.message || 'Error al desactivar usuario')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    users.value = await api.get<any[]>('/users')
  } finally {
    loading.value = false
  }
})
</script>
