import axiosInstance from '@/api/axios' 

export const getTagsApi = (params) => {
  return axiosInstance.get('/tags',{params})
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

export const getPostCommentsApi = async (postId) => {
  return axiosInstance.get(`/posts/${postId}/comments`)
}

export const createCommentApi = async (payload)=> {
  return axiosInstance.post('/comments', payload)
}

export const replyCommentApi = async (commentId, payload) => {
  return axiosInstance.post(`/comments/${commentId}/reply`, payload)
}

export const updateCommentApi = async (id, payload) => {
  return axiosInstance.put(`/comments/${id}`, payload)
}

export const deleteCommentApi = async (id) => {
  return axiosInstance.delete(`/comments/${id}`)
}

export const getPostByIdApi = (id) => {
  return axiosInstance.get(`/posts/${id}`)
}

export const updatePostApi = (id, data) => {
  return axiosInstance.put(`/posts/${id}`, data)
}

export const deletePostApi = (id) => {
  return axiosInstance.delete(`/posts/${id}`)
}

export const createQuestionPostApi = (data) => {
  return axiosInstance.post('/posts/question', data)
}

export const createPipelinePostApi = (data) => {
  return axiosInstance.post('/posts/pipeline', data)
}

export const getPipelineByPostIdApi = (postId) => {
  return axiosInstance.get(`/pipelines/${postId}`)
}

export const getPipelineVersionsApi = (postId) => {
  return axiosInstance.get(`/pipelines/${postId}/versions`)
}

export const createPipelineVersionApi = (postId, data) => {
  return axiosInstance.post(`/pipelines/${postId}/versions`, data)
}

export const getPipelineVersionByIdApi = (versionId) => {
  return axiosInstance.get(`/pipelines/versions/${versionId}`)
}