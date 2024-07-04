import axios, { AxiosInstance } from 'axios'

interface Memory {
  id: number
  title: string
  description: string
  date: string
  imageUrl: string
}

interface GetMemoriesResponse {
  memories: Memory[]
  page: number
  limit: number
  totalPages: number
  totalCount: number
}

interface GetMemoryResponse {
  memory: Memory
}

interface CreateMemoryResponse {
  message: string
}

interface UpdateMemoryResponse {
  message: string
}

interface DeleteMemoryResponse {
  message: string
}

interface UploadImageResponse {
  imageUrl: string
}

interface User {
  username: string
  name: string
  description: string
}


interface UpdateUserResponse {
  user: User
}

// Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4001',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

// Function to upload an image
export const uploadImage = async (
  imageFile: File
): Promise<UploadImageResponse> => {
  const formData = new FormData()
  formData.append('image', imageFile)

  const response = await apiClient.post<UploadImageResponse>(
    '/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

// GET /memories
export const fetchMemories = async (
  page: number = 1,
  limit: number = 5,
  order: string = 'asc'
): Promise<GetMemoriesResponse> => {
  const response = await apiClient.get<GetMemoriesResponse>('/memories', {
    params: { page, limit, order },
  })
  return response.data
}

// GET /memories/:id
export const fetchMemory = async (id: number): Promise<GetMemoryResponse> => {
  const response = await apiClient.get<GetMemoryResponse>(`/memories/${id}`)
  return response.data
}

// POST /memories
export const createMemory = async (
  title: string,
  description: string,
  date: string,
  imageUrl: string
): Promise<CreateMemoryResponse> => {
  const response = await apiClient.post<CreateMemoryResponse>('/memories', {
    title,
    description,
    date,
    imageUrl,
  })
  return response.data
}

// PUT /memories/:id
export const updateMemory = async (
  id: number,
  title: string,
  description: string,
  date: string
): Promise<UpdateMemoryResponse> => {
  const response = await apiClient.put<UpdateMemoryResponse>(
    `/memories/${id}`,
    {
      title,
      description,
      date,
    }
  )
  return response.data
}

// DELETE /memories/:id
export const deleteMemory = async (
  id: number
): Promise<DeleteMemoryResponse> => {
  const response = await apiClient.delete<DeleteMemoryResponse>(
    `/memories/${id}`
  )
  return response.data
}

// GET /user
export const fetchUser = async (
  username: string
): Promise<User> => {
  const response = await apiClient.get<UpdateUserResponse>(`/user/${username}`)
  return response.data.user
}

// POST /user
export const createUser = async (
  username: string,
  name: string,
  description: string
): Promise<User> => {
  const response = await apiClient.post<UpdateUserResponse>('/user', {
    username,
    name,
    description,
  })
  return response.data.user
}

export const getUser = async (username: string): Promise<User> => {
  const response = await axios.get<UpdateUserResponse>(`/user/${username}`)
  return response.data.user
}

// PUT /user
export const updateUser = async (user:User): Promise<User> => {
  console.log("sending")

  const request = {'name':user.name,'description': user.description}
  const response = await apiClient.put<UpdateUserResponse>(`/user/${user.username}`, request)
  console.log(response)
  return response.data.user
}
