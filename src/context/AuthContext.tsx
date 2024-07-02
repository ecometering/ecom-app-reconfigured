import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
  authState: {
    token: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
  };
  RefreshAccessToken: () => Promise<any>;
  OnLogin: (username: string, password: string) => Promise<any>;
  OnLogout: () => Promise<any>;
}

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
export const API_URL = 'https://test.ecomdata.co.uk/api';
const AuthContext = createContext<AuthProps>({} as AuthProps);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    refreshToken: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

        if (token && refreshToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setAuthState({
            token: token,
            refreshToken: refreshToken,
            authenticated: true,
          });
        }
      } catch (error) {
        console.error('Error accessing SecureStore:', error);
      }
    };

    loadToken();

    const setupInterceptors = () => {
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response && error.response.status === 401) {
            const refreshed = await refresh();
            if (!refreshed.error) {
              error.config.headers[
                'Authorization'
              ] = `Bearer ${authState.token}`;
              return axios(error.config);
            }
          }
          return Promise.reject(error);
        }
      );
    };

    setupInterceptors();
  }, [authState.token]);

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
      console.error('Login failed:', e);

      if (e.response) {
        console.error('Data:', e.response.data);
        console.error('Status:', e.response.status);
        console.error('Headers:', e.response.headers);
      } else if (e.request) {
        console.error(
          'The request was made but no response was received',
          e.request
        );
      } else {
        console.error('Error', e.message);
      }

      return {
        error: true,
        msg:
          e?.response?.data?.detail ||
          'An unknown error occurred. Please try again later.',
      };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      delete axios.defaults.headers.common['Authorization'];

      setAuthState({ token: null, refreshToken: null, authenticated: false });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refresh = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token available');

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
      console.error('Refresh failed:', e);

      if (e.response) {
        console.error('Data:', e.response.data);
        console.error('Status:', e.response.status);
        console.error('Headers:', e.response.headers);
      } else if (e.request) {
        console.error(
          'The request was made but no response was received',
          e.request
        );
      } else {
        console.error('Error', e.message);
      }

      return {
        error: true,
        msg:
          e?.response?.data?.detail ||
          'An unknown error occurred. Please try again later.',
      };
    }
  };

  const value = {
    OnLogin: login,
    OnLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
