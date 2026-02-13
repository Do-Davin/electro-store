import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://electro-store-backend-p7dc.onrender.com',
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
