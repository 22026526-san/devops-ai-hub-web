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

export const getPostsApi = (params) => {
  return axiosInstance.get('/posts', { params }) 
}

export const bookmarkPostApi = (postId) => {
  return axiosInstance.post(`/posts/${postId}/bookmark`)
}

export const unbookmarkPostApi = (postId) => {
  return axiosInstance.delete(`/posts/${postId}/bookmark`)
}

export const getMyBookmarksApi = (params) => {
  return axiosInstance.get('/users/me/bookmarks', { params })
}

export const likePostApi = (postId) => {
  return axiosInstance.post(`/posts/${postId}/like`)
}

export const unlikePostApi = (postId) => {
  return axiosInstance.delete(`/posts/${postId}/like`)
}

export const getMyLikesApi = (params) => {
  return axiosInstance.get('/users/me/likes', { params })
}