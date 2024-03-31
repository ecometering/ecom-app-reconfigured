import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure to install @react-native-async-storage/async-storage with npm or yarn
import axios from 'axios'; // Make sure to install axios with npm or yarn

const generateToken = async (username, password) => {
  try {
    const response = await axios.post("https://test.ecomdata.co.uk/api/token/", {
      username,
      password,
    });
    console.log(response.data);
    const { access: accessToken, refresh: refreshToken } = response.data;
    // Store tokens in AsyncStorage or any secure storage you prefer
    await AsyncStorage.setItem('userToken', accessToken);
    console.log('Access token stored.', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    console.log('Refresh token stored.', refreshToken);
    console.log('Login successful, tokens stored.');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
const refreshTokenFunc = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await axios.post("https://test.ecomdata.co.uk/api/token/", {
      refreshToken,
    });

    if (response.data.success) {
      const { accessToken } = response.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      console.log('Access token refreshed.');
    } else {
      // If the refresh token is invalid, remove tokens and force login
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      console.log('Refresh token invalid, please log in again.');
      // Force logout logic here (navigate to login screen, etc.)
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};


export { generateToken, refreshTokenFunc };