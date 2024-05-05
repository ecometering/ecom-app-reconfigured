import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setItemAsync } from 'expo-secure-store';
import { height, unitH, isIos } from '../utils/constant';
import { PrimaryColors, Transparents } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { OnLogin } = useAuth();
  const navigation = useNavigation();

  const appContext = useContext(AppContext);

  const login = async () => {
    const result = await OnLogin!(username, password);
    console.log('file : LoginPage.tsx ~ line 47 ~ login ~ result', result);
    if (result && result.error) {
      alert(result.msg);
    }
  };

  const handleLoginPress = () => {
    console.log('Login button pressed');

    login();
  };

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={isIos ? 'padding' : null}
      >
        <ScrollView style={styles.flex}>
          <View style={{ justifyContent: 'center', height: height * 0.9 }}>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/icons/logo167.png')} />
            </View>
            <View style={styles.body}>
              <TextInput
                value={username}
                onChangeText={(text: string) => setUsername(text)}
                placeholder={'User Name'}
                autoCapitalize="none"
                style={styles.input}
              />
              <View style={styles.spacer} />
              <TextInput
                value={password}
                onChangeText={(text: string) => setPassword(text)}
                placeholder={'Password'}
                secureTextEntry={true}
                autoCapitalize="none"
                style={styles.input}
              />
              <View style={styles.spacer} />
              <Button onPress={handleLoginPress} title="Login" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
    backgroundColor: 'white',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '70%',
    height: unitH * 50,
    backgroundColor: Transparents.SandColor2,
    borderRadius: 0,
    color: PrimaryColors.Black,
    paddingVertical: unitH * 10,
  },
  spacer: {
    height: unitH * 10,
  },
  button: {
    width: '70%',
    height: unitH * 50,
    backgroundColor: PrimaryColors.Blue,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowOffset: {
      width: 2.5,
      height: 2.5,
    },
  },
  buttonTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: unitH * 10,
  },
});

export default LoginPage;
