// src/api/modules/user.api.js
import axiosInstance from '../axios'

export const getMyInfoApi = async () => {
  return axiosInstance.get('/users/me')
}

export const updateProfileApi = async (payload) => {
  return axiosInstance.put('/users/profile', payload)
}

export const updateAvatarApi = async (formData) => {
  return axiosInstance.put('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteAvatarApi = async () => {
  return axiosInstance.delete('/users/avatar')
}