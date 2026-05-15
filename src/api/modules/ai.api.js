import axiosInstance from '@/api/axios' 

export const aiChatApi = (data,config = {}) => {
  return axiosInstance.post('/ai/chat', data,config)
}

export const getConversationsByUserIdApi = (userId) => {
  return axiosInstance.get(`/ai/conversations/user/${userId}`)
}

export const getConversationMessagesApi = (conversationId) => {
  return axiosInstance.get(`/ai/conversations/${conversationId}/messages`)
}
export const changeTitleMessagesApi = (title, conversationId) => {
  return axiosInstance.put(`/ai/conversations/${conversationId}/title`,title)
}
export const deleteMessagesApi = (conversationId) => {
  return axiosInstance.delete(`/ai/conversations/${conversationId}`)
}