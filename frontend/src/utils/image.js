import { API_BASE_URL } from '../services/api'

export const getMediaUrl = (path) => {
    if (!path) return ''
    if (path.startsWith('http')) return path

    // Remove /api from the end of API_BASE_URL if present to get the root URL
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '')

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`

    return `${baseUrl}${cleanPath}`
}
