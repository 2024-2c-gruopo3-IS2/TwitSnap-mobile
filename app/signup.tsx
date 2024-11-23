// app/signup.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import styles from '../styles/signup';
import { saveToken } from '@/handlers/authTokenHandler';
import { registerUser } from '@/handlers/signUpHandler';
import { auth } from '../firebaseConfig';
import { saveRegistrationState } from '@/helper/registrationStorage';
import { AuthContext } from '@/context/authContext';
import {addMetric} from '@/handlers/metricsHandler';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const router = useRouter();
  const { signup, registrationState, updateRegistrationState } = useContext(AuthContext);

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
    const startTime = Date.now();

    try {
      await signup(email, password);
      const endTime = Date.now();
       await addMetric('signups', endTime - startTime);
      // Navegar al siguiente paso después del registro inicial
      router.push({
        pathname: './location',
        params: { email, password },
      });
    } catch (error: any) {
        await addMetric('signups_failed', 1);
      if (error.message === 'El correo electrónico ya está en uso.') {
        Alert.alert('Error', 'El correo electrónico ya está en uso.');
      } else {
        Alert.alert('Error', error.message || 'Error al registrar el usuario.');
      }
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/twitsnap_logo.png')} style={styles.logoContainer} />
      </View>

      <Text style={styles.title}>Regístrate en TwitSnap</Text>

      <View style={styles.buttonContainer}>

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