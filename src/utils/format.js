export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}  ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

export const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}
