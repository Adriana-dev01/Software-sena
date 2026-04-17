import { useAuthStore } from '~/stores/auth'

export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const baseURL = config.public.apiBase

  async function request<T>(
    endpoint: string,
    options: RequestInit & { params?: Record<string, string> } = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options

    let url = `${baseURL}${endpoint}`
    if (params) {
      const qs = new URLSearchParams(params).toString()
      url += `?${qs}`
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    }

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    // Remove Content-Type for FormData
    if (fetchOptions.body instanceof FormData) {
      delete headers['Content-Type']
    }

    const response = await fetch(url, { ...fetchOptions, headers })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    const text = await response.text()
    if (!text) return {} as T

    const json = JSON.parse(text)

    // El backend envuelve todas las respuestas en { data: ... }
    // gracias al TransformInterceptor de NestJS
    return json?.data !== undefined ? json.data : json
  }

  return {
    get: <T>(endpoint: string, params?: Record<string, string>) =>
      request<T>(endpoint, { method: 'GET', params }),

    post: <T>(endpoint: string, body?: unknown) =>
      request<T>(endpoint, {
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),

    patch: <T>(endpoint: string, body?: unknown) =>
      request<T>(endpoint, {
        method: 'PATCH',
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),

    delete: <T>(endpoint: string) =>
      request<T>(endpoint, { method: 'DELETE' }),
  }
}
