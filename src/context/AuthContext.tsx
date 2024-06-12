import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  authenticated: boolean | null;
}

interface AuthContextProps {
  authState: AuthState;
  OnLogin: (username: string, password: string) => Promise<any>;
  OnLogout: () => Promise<void>;
  RefreshAccessToken: () => Promise<any>;
}

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const API_URL = 'https://test.ecomdata.co.uk/api';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    refreshToken: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthState({
          token,
          refreshToken,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/token/`, {
        username,
        password,
      });

      setAuthState({
        token: result.data.access,
        refreshToken: result.data.refresh,
        authenticated: true,
      });

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${result.data.access}`;

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.access);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.refresh);

      return result;
    } catch (e) {
      handleAxiosError(e, 'Login failed');
      return {
        error: true,
        msg: e?.response?.data?.msg || 'An unknown error occurred',
      };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    axios.defaults.headers.common['Authorization'] = '';
    setAuthState({ token: null, refreshToken: null, authenticated: false });
  };

  const refresh = async () => {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

    try {
      const result = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: refreshToken,
      });

      setAuthState((prevState) => ({
        ...prevState,
        token: result.data.access,
        refreshToken: result.data.refresh || prevState.refreshToken,
        authenticated: true,
      }));

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${result.data.access}`;
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.access);
      if (result.data.refresh) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.refresh);
      }

      return result;
    } catch (e) {
      handleAxiosError(e, 'Refresh failed');
      return {
        error: true,
        msg: e?.response?.data?.msg || 'An unknown error occurred',
      };
    }
  };

  const handleAxiosError = (error: any, context: string) => {
    console.error(`${context}:`, error);
    if (error.response) {
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error(
        'The request was made but no response was received',
        error.request
      );
    } else {
      console.error('Error', error.message);
    }
    console.error('Config:', error.config);
  };

  // Axios interceptor to refresh token on 401 error
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshResult = await refresh();
        if (!refreshResult.error) {
          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${refreshResult.data.access}`;
          return axios(originalRequest);
        } else {
          await logout();
          return Promise.reject(refreshResult);
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider
      value={{
        authState,
        OnLogin: login,
        OnLogout: logout,
        RefreshAccessToken: refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
