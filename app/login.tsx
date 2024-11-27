import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import styles from '../styles/login';
import { auth } from '@/firebaseConfig';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { AuthContext } from '@/context/authContext';
import * as AuthSession from 'expo-auth-session';
import { addMetric } from '@/handlers/metricsHandler';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { remove, set } from 'firebase/database';
import { removeToken, saveToken } from '@/handlers/authTokenHandler';
import { getProfile } from '@/handlers/profileHandler';
import { googleSignInHandler } from '@/handlers/loginHandler';

// GoogleSignin.configure({
//   webClientId: '856906798335-iqj29rkp14s4f8m4bmlg7rtk9rllh8vl.apps.googleusercontent.com',
// });

//WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
  const { login, isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      if (isAuthenticated) {
        router.replace('./tabs');
      }
    };

    checkSession();
  }, [isAuthenticated]);


  const handleGoogleSignIn = async () => {
//     await GoogleSignin.hasPlayServices();
//     await GoogleSignin.signOut();
//     const userInfo = await GoogleSignin.signIn();
//     console.log('User info:', userInfo);
//     const email = userInfo?.data?.user?.email;
//     if (email) {
//       console.log('Email:', email);
//       const response = await googleSignInHandler(email);
//
//       if (response.success) {
//         router.replace('./tabs');
//       }
//     } else {
//       Alert.alert('Error', 'No se pudo iniciar sesión con Google.');
//     }
  }

  // const handleGoogleSignIn = async () => {
  //   await GoogleSignin.hasPlayServices();
  //   const response = await GoogleSignin.signIn();

  //   const token = response.data?.idToken;

  //   if (token) {
  //     //await saveToken(token);
  //     console.log('Token saved:', token);
  //   } else {
  //     console.error('Token is null or undefined');
  //   }
  //   console.log('Google response:', response);


  //   //const profileResponse = await getProfile();

  //   //console.log('Profile response:', profileResponse);
  //   return;
  //   if (profileResponse.success && profileResponse.profile) {
  //     console.log('User profile:', profileResponse.profile);
  //     router.replace('./tabs');
  //   } else {
  //     const email = response.data?.user.email;
  //     const password = response.data?.user.id;

  //     router.push({
  //       pathname: './location',
  //       params: { email, password },
  //     });
  //   }

    // console.log('Token:', token);

    // console.log(response);
    //   const googleCredential = GoogleAuthProvider.credential(idToken);
    //   await signInWithCredential(auth, googleCredential);
    //   router.replace('./tabs');
    // } catch (error) {
    //   console.error('Error al iniciar sesión con Google:', error);
    //   Alert.alert('Error', 'No se pudo iniciar sesión con Google.');
  // }

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    try {
      await login(email, password);
      const endTime = Date.now(); // Termina el tiempo
      await addMetric('logins', endTime - startTime); // Registra el tiempo de login
      router.replace('./tabs');
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión.');
      await addMetric('logins_failed', 1); // Registra el fallo en login
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/twitsnap_logo.png')} style={styles.logoContainer} />
      </View>

      <Text style={styles.title}>Inicia sesión en TwitSnap</Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.googleButton} onPress={handleGoogleSignIn}>
          <View style={styles.googleButtonContent}>
            <Image
              source={require('../assets/images/google.png')}
              style={styles.googleLogo}
            />
            <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
          </View>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>o</Text>
          <View style={styles.divider} />
        </View>

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error.includes('correo electrónico') && <Text style={styles.errorText}>{error}</Text>}

        {email.length > 0 && (
          <>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                style={styles.passwordInput}
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
                value={password}
                autoCapitalize="none"
              />
              <Pressable
                style={styles.passwordVisibilityButton}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="white" />
              </Pressable>
            </View>
            {error.includes('contraseña') && <Text style={styles.errorText}>{error}</Text>}
          </>
        )}

        {error && !error.includes('correo electrónico') && !error.includes('contraseña') && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <Pressable style={styles.nextButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          )}
        </Pressable>

        <View style={styles.forgotPasswordContainer}>
          <Link href="/forgotPassword">
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </Link>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            ¿No tienes una cuenta?{' '}
            <Link href="./signup">
              <Text style={styles.signupLink}>Regístrate</Text>
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
}
