import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

export function useAuth() {
  const authStore = useAuthStore()
  const api = useApi()
  const router = useRouter()

  /**
   * Extrae el token de la respuesta del backend.
   * NestJS/Passport puede devolver "access_token" o "token".
   */
  function extractToken(response: any): string {
    return response?.access_token || response?.token || ''
  }

  /**
   * Si el backend no devuelve el objeto user en la respuesta de login,
   * lo carga desde /users/profile usando el token recibido.
   */
  async function resolveUser(response: any, token: string): Promise<any> {
    if (response?.user) return response.user

    // Fallback: cargamos el perfil del usuario autenticado
    const config = useRuntimeConfig()
    const res = await fetch(`${config.public.apiBase}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('No se pudo obtener el perfil del usuario')
    const json = await res.json()
    // Desenvuelve { data: user } si aplica
    return json?.data !== undefined ? json.data : json
  }

  async function login(email: string, password: string) {
    const response = await api.post<any>('/auth/login', { email, password })
    const token = extractToken(response)
    const user = await resolveUser(response, token)
    authStore.setAuth(token, user)
    redirectByRole()
  }

  async function register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) {
    const response = await api.post<any>('/auth/register', data)
    const token = extractToken(response)
    const user = await resolveUser(response, token)
    authStore.setAuth(token, user)
    redirectByRole()
  }

  function redirectByRole() {
    const role = authStore.user?.role
    if (role === 'super_admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  async function logout() {
    authStore.logout()
    router.push('/login')
  }

  return { login, register, logout, redirectByRole }
}
