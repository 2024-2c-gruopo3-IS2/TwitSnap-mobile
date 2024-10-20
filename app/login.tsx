import React, { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import styles from '../styles/login';
import { saveToken, getToken } from '@/handlers/authTokenHandler';
import { loginUser } from '@/handlers/loginHandler';
import { auth, provider } from '@/firebaseConfig'; // Importa tu configuración de Firebase
import { signInWithCredential } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '856906798335-iqj29rkp14s4f8m4bmlg7rtk9rllh8vl.apps.googleusercontent.com',
    iosClientId: '856906798335-iqj29rkp14s4f8m4bmlg7rtk9rllh8vl.apps.googleusercontent.com',
    androidClientId: '284091085313-van729jfbnu1uge8ho1slufs0ss0vvvd.apps.googleusercontent.com',
    webClientId: '856906798335-iqj29rkp14s4f8m4bmlg7rtk9rllh8vl.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    const checkSession = async () => {
      const token = await getToken();
      if (token) {
        router.replace('./feed');
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        const credential = GoogleAuthProvider.credential(null, authentication.accessToken);
        signInWithCredential(auth, credential)
          .then(async (userCredential) => {
            const token = await userCredential.user.getIdToken();
            await saveToken(token);
            router.replace('./feed');
          })
          .catch((error) => {
            console.error('Error al iniciar sesión con Google:', error);
            Alert.alert('Error', 'Error al iniciar sesión con Google.');
          });
      }
    }
  }, [response]);

  const signInWithGoogle = () => {
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
      const response = await loginUser(email, password);
      if (response.success) {
        if (response.token) {
          await saveToken(response.token);
          router.replace('./feed');
        } else {
          setError('No se recibió un token de autenticación.');
        }
      } else {
        setError(response.message || 'Error al iniciar sesión.');
      }
    } catch (error) {
      setError('Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/twitsnap-logo.png')} style={styles.logoContainer} />
      </View>

      <Text style={styles.title}>Inicia sesión en TwitSnap</Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.googleButton} onPress={signInWithGoogle}>
          <Image source={require('../assets/images/google-logo.png')} style={styles.googleIcon} />
          <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
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