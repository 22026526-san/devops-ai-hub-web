// src/api/modules/auth.api.js
import axiosInstance from '../axios'

export const requestRegisterOtpApi = async (payload) => {
  return axiosInstance.post('/auth/register/request-otp', payload)
}

export const verifyRegisterOtpApi = async (payload) => {
  return axiosInstance.post('/auth/register/verify-otp', payload)
}

export const loginApi = async (payload) => {
  return axiosInstance.post('/auth/login', payload)
}

export const requestForgotPasswordOtpApi = async (payload) => {
  return axiosInstance.post('/auth/forgot-password/request-otp', payload)
}

export const resetPasswordApi = async (payload) => {
  return axiosInstance.post('/auth/forgot-password/reset', payload)
}