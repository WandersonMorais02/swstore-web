import { api } from '../../services/api'

export type UploadedFile = {
  name: string
  url: string | null
  path: string
  mimeType: string
  size: number

  alt?: string
  isMain?: boolean
  order?: number
}

async function uploadFile(url: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post<UploadedFile>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return data
}

export async function uploadProductPreview(file: File) {
  return uploadFile('/files/products/previews', file)
}

export async function uploadProductOriginal(file: File) {
  return uploadFile('/files/products/originals', file)
}

export async function uploadUserAvatar(file: File) {
  return uploadFile('/files/users/avatar', file)
}
