import axios from '@/lib/axios'

const BASE = '/brands'

/**
 * Admin Brand CRUD service — uses axios so FormData (file uploads) works.
 */
export const brandAdminApi = {
  /** Get all brands */
  getAll() {
    return axios.get(BASE).then((r) => r.data)
  },

  /** Get single brand */
  getById(id) {
    return axios.get(`${BASE}/${id}`).then((r) => r.data)
  },

  /**
   * Create a brand (multipart/form-data)
   * @param {{ name: string, inventorName: string, logo: File, inventorImage?: File }} data
   */
  create(data) {
    const fd = new FormData()
    fd.append('name', data.name)
    fd.append('inventorName', data.inventorName)
    fd.append('logo', data.logo)
    if (data.inventorImage) {
      fd.append('inventorImage', data.inventorImage)
    }
    return axios.post(BASE, fd).then((r) => r.data)
  },

  /**
   * Update a brand (multipart/form-data)
   * @param {string} id
   * @param {{ name?: string, inventorName?: string, logo?: File, inventorImage?: File }} data
   */
  update(id, data) {
    const fd = new FormData()
    if (data.name) fd.append('name', data.name)
    if (data.inventorName) fd.append('inventorName', data.inventorName)
    if (data.logo) fd.append('logo', data.logo)
    if (data.inventorImage) fd.append('inventorImage', data.inventorImage)
    return axios.patch(`${BASE}/${id}`, fd).then((r) => r.data)
  },

  /** Delete a brand */
  delete(id) {
    return axios.delete(`${BASE}/${id}`).then((r) => r.data)
  },
}
