// app/signup.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import styles from '../styles/signup';
import { saveToken } from '@/handlers/authTokenHandler';
import { registerUser } from '@/handlers/signUpHandler';
import { auth } from '../firebaseConfig';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { saveRegistrationState } from '@/helper/registrationStorage';
import { AuthContext } from '@/context/authContext';


WebBrowser.maybeCompleteAuthSession();

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const router = useRouter();
  const { signup, registrationState, updateRegistrationState } = useContext(AuthContext);


  // Configura el esquema de redirección
  const redirectUri = makeRedirectUri({
    // Reemplaza 'twitsnap' con el esquema que hayas definido en app.json
    scheme: 'myapp',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '856906798335-iqj29rkp14s4f8m4bmlg7rtk9rllh8vl.apps.googleusercontent.com',
    androidClientId: '284091085313-van729jfbnu1uge8ho1slufs0ss0vvvd.apps.googleusercontent.com',
    webClientId: '856906798335-iqj29rkp14s4f8m4bmlg7rtk9rllh8vl.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    //redirectUri: makeRedirectUri({scheme: 'myapp',}),
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleSignUp = async () => {
    setErrors({ email: '', password: '' });

    let hasError = false;
    let newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
      hasError = true;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'El correo electrónico no es válido.';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);


    try {
      await signup(email, password);
      // Navegar al siguiente paso después del registro inicial
      router.push({
        pathname: './location',
        params: { email, password },
      });
    } catch (error: any) {
      if (error.message === 'El correo electrónico ya está en uso.') {
        Alert.alert('Error', 'El correo electrónico ya está en uso.');
      } else {
        Alert.alert('Error', error.message || 'Error al registrar el usuario.');
      }
    }
  };

  const signUpWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await promptAsync();

      if (result.type === 'success') {
        const { authentication } = result;
        if (authentication?.idToken && authentication.accessToken) {
          const credential = GoogleAuthProvider.credential(authentication.idToken, authentication.accessToken);
          const userCredential = await signInWithCredential(auth, credential);

          const token = await userCredential.user.getIdToken();
          await saveToken(token);

          router.replace('./location');
        } else {
          Alert.alert('Error', 'No se pudo completar el registro con Google.');
        }
      } else {
        Alert.alert('Error', 'No se pudo completar el registro con Google.');
      }
    } catch (error) {
      console.error('Google Sign-Up Error:', error);
      Alert.alert('Error', 'Error en el registro con Google.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken && authentication.accessToken) {
        const credential = GoogleAuthProvider.credential(authentication.idToken, authentication.accessToken);
        signInWithCredential(auth, credential)
          .then(async (userCredential) => {
            const token = await userCredential.user.getIdToken();
            await saveToken(token);
            router.replace('./location');
          })
          .catch((error) => {
            console.error('Google Sign-Up Error:', error);
            Alert.alert('Error', 'Error en el registro con Google.');
          });
      } else {
        Alert.alert('Error', 'No se pudo completar el registro con Google.');
      }
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/twitsnap-logo.png')} style={styles.logoContainer} />
      </View>

      <Text style={styles.title}>Regístrate en TwitSnap</Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.googleButton} onPress={signUpWithGoogle}>
          <Image source={require('../assets/images/google-logo.png')} style={styles.googleIcon} />
          <Text style={styles.buttonText}>Registrarse con Google</Text>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>o</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

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
            <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="white" />
            </Pressable>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <Pressable style={styles.signupButton} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </Pressable>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            ¿Ya tienes una cuenta?{' '}
            <Link href="./login">
              <Text style={styles.signupLink}>Inicia sesión</Text>
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
}
