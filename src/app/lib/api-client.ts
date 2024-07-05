import axios, { AxiosInstance } from 'axios'
import { Memory } from '../../types';

const getCookie = (name:string) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Usage
const getUsername = ()=>{
  const username = getCookie('username');
  if (!username){
    throw Error("Username not found in cookie")
  }
  return username
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
  baseURL: import.meta.env.VITE_API_URL,
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
  order: string = 'asc',
  username: string | undefined = undefined
): Promise<GetMemoriesResponse> => {
  let requestUsername = username
  if (!requestUsername) {
    requestUsername= getUsername()
  }
  console.log(requestUsername, "REQUESTED")

  const response = await apiClient.get<GetMemoriesResponse>('/memories', {
    params: { 'username':requestUsername, page, limit, order },
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
  const username = getUsername()

  const response = await apiClient.post<CreateMemoryResponse>('/memories', {
    username,
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
export const fetchUser = async (username:string): Promise<User> => {
  let requestUsername = username
  if (!username) {
    const cookieUsername = getUsername()
    requestUsername = cookieUsername
  }
  const response = await apiClient.get<UpdateUserResponse>('/user', {
    params: { username:requestUsername },
  })
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

// PUT /user
export const updateUser = async (user: User): Promise<User> => {
  const response = await apiClient.put<UpdateUserResponse>(
    `/user`,
    {
      name: user.name,
      description: user.description,
    },
    {
      params: { username: user.username }
    }
  )
  return response.data.user
}