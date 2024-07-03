import axios, { AxiosInstance } from 'axios';

// Define the types for the responses
interface Memory {
  id: number;
  img: string;
  title: string;
  description: string;
  date: string;
}

interface GetMemoriesResponse {
  memories: Memory[];
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}

interface GetMemoryResponse {
  memory: Memory;
}

interface CreateMemoryResponse {
  message: string;
}

interface UpdateMemoryResponse {
  message: string;
}

interface DeleteMemoryResponse {
  message: string;
}

// Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4001',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*',
  },
});

// GET /memories
export const fetchMemories = async (page: number = 1, limit: number = 5): Promise<GetMemoriesResponse> => {
  const response = await apiClient.get<GetMemoriesResponse>('/memories', {
    params: { page, limit },
  });
  return response.data;
};

// GET /memories/:id
export const fetchMemory = async (id: number): Promise<GetMemoryResponse> => {
  const response = await apiClient.get<GetMemoryResponse>(`/memories/${id}`);
  return response.data;
};

// POST /memories
export const createMemory = async (name: string, description: string, timestamp: string): Promise<CreateMemoryResponse> => {
  const response = await apiClient.post<CreateMemoryResponse>('/memories', {
    name,
    description,
    timestamp,
  });
  return response.data;
};

// PUT /memories/:id
export const updateMemory = async (id: number, name: string, description: string, timestamp: string): Promise<UpdateMemoryResponse> => {
  const response = await apiClient.put<UpdateMemoryResponse>(`/memories/${id}`, {
    name,
    description,
    timestamp,
  });
  return response.data;
};

// DELETE /memories/:id
export const deleteMemory = async (id: number): Promise<DeleteMemoryResponse> => {
  const response = await apiClient.delete<DeleteMemoryResponse>(`/memories/${id}`);
  return response.data;
};
