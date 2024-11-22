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

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
  const { login, isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Configura el proveedor de Google con los IDs de cliente
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '856906798335-iqj29rkp14s4f8m4bmlg7rtk9rllh8vl.apps.googleusercontent.com',
    androidClientId: '856906798335-7gmq64nn5upj2qfng38q858al4ngosu6.apps.googleusercontent.com',
    useProxy: true,
  });

  useEffect(() => {
    const checkSession = async () => {
      if (isAuthenticated) {
        router.replace('./tabs');
      }
    };

    checkSession();
  }, [isAuthenticated]);

  useEffect(() => {
      console.log('Checking Google response');
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google authentication:', authentication);

      const credential = GoogleAuthProvider.credential(authentication.idToken, authentication.accessToken);
      console.log('Google credential:', credential);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          // Usuario autenticado correctamente
          const user = userCredential.user;
          console.log('Usuario autenticado:', user);
          router.replace('./tabs');
        })
        .catch((error) => {
          console.error('Error al iniciar sesión con Google:', error);
          Alert.alert('Error', 'No se pudo iniciar sesión con Google.');
        });
    }
  }, [response]);

  const handleGoogleSignIn = () => {
      console.log('Prompting Google sign in');
    promptAsync();
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('./tabs');
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión.');
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
        <Pressable style={styles.googleButton} onPress={handleGoogleSignIn} disabled={!request}>
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
