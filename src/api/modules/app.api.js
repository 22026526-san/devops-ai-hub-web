import axiosInstance from '@/api/axios' 

export const getTagsApi = () => {
  return axiosInstance.get('/tags')
}

export const createTagApi = (data) => {
  return axiosInstance.post('/tags', data)
}

export const getTagByIdApi = (id) => {
  return axiosInstance.get(`/tags/${id}`)
}

export const updateTagApi = (id, data) => {
  return axiosInstance.put(`/tags/${id}`, data)
}