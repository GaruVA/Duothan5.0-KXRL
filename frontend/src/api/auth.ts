import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  teamName: string;
  email: string;
  password: string;
  members?: Array<{
    name: string;
    email: string;
  }>;
}

interface Team {
  id: string;
  teamName: string;
  email: string;
  members: Array<{
    name: string;
    email: string;
  }>;
}

interface AuthResponse {
  message: string;
  token: string;
  team: Team;
}

interface MeResponse {
  team: Team;
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('teamData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (teamData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', teamData);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  getMe: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  }
};

export const challengesAPI = {
  getAllChallenges: async (): Promise<any> => {
    const response = await api.get('/challenges');
    return response.data;
  },

  getChallengeById: async (id: string): Promise<any> => {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  }
};

export default api;
