import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Logger utility
const logger = {
  debug: (message: string, data?: any) => {
    if (import.meta.env.VITE_LOG_LEVEL === 'debug') {
      console.log(`[API] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[API ERROR] ${message}`, error);
  },
  info: (message: string, data?: any) => {
    console.info(`[API INFO] ${message}`, data);
  }
};

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = 'varta_token';
  private static readonly USER_KEY = 'varta_user';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    logger.debug('Token stored');
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    logger.debug('Token removed');
  }

  static getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

// Exponential backoff utility
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const exponentialBackoff = async (
  fn: () => Promise<any>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === maxRetries - 1 || error.response?.status < 500) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, i);
      logger.debug(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await sleep(delay);
    }
  }
};

// Base API client factory
const createApiClient = (baseURL: string, serviceName: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000, // Increased to 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      const token = TokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[${serviceName}] Sending token:`, token.substring(0, 50) + '...');
      } else {
        console.log(`[${serviceName}] No token available`);
      }
      logger.debug(`${serviceName} Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });
      return config;
    },
    (error) => {
      logger.error(`${serviceName} Request Error`, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      logger.debug(`${serviceName} Response: ${response.status}`, response.data);
      return response;
    },
    (error) => {
      logger.error(`${serviceName} Response Error`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Handle 401 - redirect to login
      if (error.response?.status === 401) {
        TokenManager.removeToken();
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Service clients
export const userClient = createApiClient(
  import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8086',
  'UserService'
);

export const contentClient = createApiClient(
  import.meta.env.VITE_CONTENT_SERVICE_URL || 'http://localhost:8087',
  'ContentService'
);

// API wrapper with retry logic
const apiCall = async <T>(
  client: AxiosInstance,
  config: AxiosRequestConfig,
  useRetry: boolean = true
): Promise<T> => {
  const makeRequest = () => client.request<T>(config).then(response => response.data);
  
  if (useRetry && ['GET', 'PUT', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
    return exponentialBackoff(makeRequest);
  }
  
  return makeRequest();
};

export { TokenManager, logger, apiCall };