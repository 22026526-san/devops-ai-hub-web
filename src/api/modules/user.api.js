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

export const requestUpdateUserOtpApi = async (payload) => {
  return axiosInstance.post('/users/request-update-user-otp', payload)
}

export const verifyUpdateUserOtpApi = async (payload) => {
  return axiosInstance.post('/users/verify-update-user-otp', payload)
}

export const getUserProfileByIdApi = async (userId) => {
  return axiosInstance.get(`/users/${userId}/profile`)
}

export const getProfilesApi = async (params) => {
  return axiosInstance.get('/users/profiles', { params })
}

export const getSuggestedFollowsApi = async (params) => {
  return axiosInstance.get('/users/suggested-follows', { params })
}

export const updateUserRoleApi = async (userId, payload) => {
  return axiosInstance.put(`/users/${userId}/role`, payload)
}

export const updateUserStatusApi = async (userId, payload) => {
  return axiosInstance.put(`/users/${userId}/status`, payload)
}

export const followUserApi = async (userId) => {
  return axiosInstance.post(`/users/${userId}/follow`)
}

export const unfollowUserApi = async (userId) => {
  return axiosInstance.delete(`/users/${userId}/follow`)
}

export const getUserFollowersApi = async (userId, params) => {
  return axiosInstance.get(`/users/${userId}/followers`, { params })
}

export const getUserFollowingApi = async (userId, params) => {
  return axiosInstance.get(`/users/${userId}/following`, { params })
}