import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const AUTH_TOKENS_KEY = 'authTokens'

export const getStoredTokens = () => {
  try {
    const raw = localStorage.getItem(AUTH_TOKENS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const storeTokens = (tokens) => {
  if (!tokens) {
    localStorage.removeItem(AUTH_TOKENS_KEY)
    return
  }
  localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens))
}

let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

api.interceptors.request.use(
  (config) => {
    const tokens = getStoredTokens()
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error)
    }

    const tokens = getStoredTokens()
    if (!tokens?.refresh) {
      storeTokens(null)
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (!isRefreshing) {
      isRefreshing = true
      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          { refresh: tokens.refresh }
        )
        const newTokens = {
          ...tokens,
          access: res.data.access
        }
        storeTokens(newTokens)
        isRefreshing = false
        onRefreshed(newTokens.access)
      } catch (refreshError) {
        isRefreshing = false
        storeTokens(null)
        return Promise.reject(refreshError)
      }
    }

    return new Promise((resolve) => {
      subscribeTokenRefresh((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        resolve(api(originalRequest))
      })
    })
  }
)

export const auth = {
  login: async (payload) => {
    const response = await api.post('/auth/login/', payload)
    return response.data
  },
  register: async (payload) => {
    const response = await api.post('/auth/register/', payload)
    return response.data
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile/')
    return response.data
  },
  sendOtp: async (email) => {
    const response = await api.post('/auth/send-otp/', { email })
    return response.data
  }
}

export const products = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.collection) params.append('collection', filters.collection)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.color) params.append('color', filters.color)
    const query = params.toString()
    const response = await api.get(`/products/${query ? `?${query}` : ''}`)
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/products/${id}/`)
    return response.data
  }
}

export const cart = {
  get: async () => {
    const response = await api.get('/cart/')
    return response.data
  },
  add: async (productId, quantity = 1, size = null, color = null) => {
    const response = await api.post('/cart/', { productId, quantity, size, color })
    return response.data
  },
  update: async (id, quantity) => {
    const response = await api.patch(`/cart/${id}/`, { quantity })
    return response.data
  },
  remove: async (id) => {
    const response = await api.delete(`/cart/${id}/`)
    return response.data
  },
  clear: async () => {
    const response = await api.delete('/cart/clear/')
    return response.data
  }
}

export const orders = {
  getAll: async () => {
    const response = await api.get('/orders/')
    return response.data
  },
  create: async (shippingAddress) => {
    const response = await api.post('/orders/', { shipping_address: shippingAddress })
    return response.data
  }
}

export default api
