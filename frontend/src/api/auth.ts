import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

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
  },

  submitFlag: async (challengeId: string, flag: string): Promise<any> => {
    const response = await api.post(`/challenges/${challengeId}/submit-flag`, { flag });
    return response.data;
  }
};

// Judge0 API functions for code execution
export const judge0API = {
  getLanguages: async (): Promise<any> => {
    const response = await api.get('/judge0/languages');
    return response.data;
  },

  submitCode: async (submission: {
    source_code: string;
    language_id: number;
    stdin?: string;
    expected_output?: string;
    wait?: boolean;
  }): Promise<any> => {
    const response = await api.post('/judge0/submit', submission);
    return response.data;
  },

  getSubmission: async (token: string, fields?: string): Promise<any> => {
    const params = fields ? `?fields=${fields}` : '';
    const response = await api.get(`/judge0/submission/${token}${params}`);
    return response.data;
  },

  pollSubmission: async (token: string, maxAttempts?: number, interval?: number): Promise<any> => {
    const response = await api.post(`/judge0/poll/${token}`, {
      maxAttempts,
      interval
    });
    return response.data;
  }
};

export default api;
