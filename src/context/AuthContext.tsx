import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
  authState?: {
    token: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
  };
  RefreshAccessToken?: () => Promise<any>;
  OnLogin?: (username: string, password: string) => Promise<any>;
  OnLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
export const API_URL = 'https://test.ecomdata.co.uk/api';
const AuthContext = createContext<AuthProps>({});

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
    authenticated: null,
    refreshToken: null,
  });
  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      console.log('stored token', token);
      console.log('stored refreshToken', refreshToken);

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthState({
          token: token,
          refreshToken: refreshToken,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);
  const login = async (username: string, password: string) => {
    try {
      console.log('API url:', `${API_URL}/token`);
      const result = await axios.post(`${API_URL}/token/`, {
        username,
        password,
      });

      console.log('file : AuthContext.tsx ~ line 31 ~ login ~ result', result);
      setAuthState({
        token: result.data.access,
        refreshToken: result.data.refresh,
        authenticated: true,
      });
      console.log(
        'file : AuthContext.tsx ~ line 34 ~ login ~ authState',
        authState
      );

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${result.data.access}`;

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.access);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.refresh);
      return result;
    } catch (e) {
      console.error('Login failed:', e); // Log high-level error
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Data:', e.response.data);
        console.error('Status:', e.response.status);
        console.error('Headers:', e.response.headers);
      } else if (e.request) {
        // The request was made but no response was received
        console.error(
          'The request was made but no response was received',
          e.request
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', e.message);
      }
      console.error('Config:', e.config);

      return {
        error: true,
        msg: e?.response?.data?.msg || 'An unknown error occurred',
      };
    }
  };
  const logout = async () => {
    console.log('file : AuthContext.tsx ~ line 47 ~ logout ~ logout called');
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    axios.defaults.headers.common['Authorization'] = '';
    console.log(
      'file : AuthContext.tsx ~ line 50 ~ logout ~ token removed',
      authState.token
    );
    setAuthState({ token: null, refreshToken: null, authenticated: false });
    console.log(
      'file : AuthContext.tsx ~ line 52 ~ logout ~ authState',
      authState
    );
    console.log(
      'file : AuthContext.tsx ~ line 53 ~ logout ~ token removed',
      authState.token
    );
  };
  const refresh = async () => {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    console.log({ refreshToken });
    try {
      console.log('API url:', `${API_URL}/token/refresh`);
      const result = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: refreshToken,
      });

      console.log('Refresh result:', result.data.access);
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
      console.error('Config:', e.config);

      return {
        error: true,
        msg: e?.response?.data?.msg || 'An unknown error occurred',
      };
    }
  };

  const value = {
    OnLogin: login,
    OnLogout: logout,
    authState,
    RefreshAccessToken: refresh,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
