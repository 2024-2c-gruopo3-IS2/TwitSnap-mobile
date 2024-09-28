import React, { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import styles from '../styles/login';
import { loginUser } from '@/handlers/loginHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); 
  const router = useRouter(); 
  
  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('token');
      const expiration = await AsyncStorage.getItem('expiration');

      if (token && expiration && Date.now() < parseInt(expiration)) {
        router.replace('./feed'); // Si el token es válido, navegar a la página protegida
      } else if (expiration && Date.now() >= parseInt(expiration)) {
        Alert.alert('Sesión expirada', 'Por favor, inicie sesión nuevamente.'); // CA3: Sesión expirada
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('expiration');
      }
    };

    checkSession();
  }, []);
  
  
  // Expresiones regulares para validación
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    // Reiniciar mensajes de error
    setError('');

    // Validación de campos
    if (!email || !password) {
      setError('Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('El correo electrónico no es válido.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(email, password);
      
      console.log('API Response:', response);
      
      if (response.success) {
        router.replace('./feed'); 
      } else {
        if (response.message === 'invalid credentials') {
          setError('El correo o la contraseña son incorrectos.'); 
        } else {
          setError(response.message || 'Error al iniciar sesión.');
        }
      }
    } catch (error) {
      setError('Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sección del Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/twitsnap-logo.png')} style={styles.logoContainer} />
      </View>

      {/* Sección del Título */}
      <Text style={styles.title}>Inicia sesión en TwitSnap</Text>

      {/* Sección de Botones */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.googleButton} onPress={() => Alert.alert('Login', 'Iniciar sesión con Google')}>
          <Image source={require('../assets/images/google-logo.png')} style={styles.googleIcon} />
          <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
        </Pressable>

        {/* Divisor */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>o</Text>
          <View style={styles.divider} />
        </View>

        {/* Campos de Entrada */}
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {/* Mostrar mensaje de error de correo electrónico */}
        {error && error.includes('correo electrónico') && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Campo de Contraseña */}
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
            {/* Mostrar mensaje de error de contraseña */}
            {error && error.includes('contraseña') && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </>
        )}

        {/* Mostrar otros mensajes de error */}
        {error && !error.includes('correo electrónico') && !error.includes('contraseña') && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Botón de Iniciar Sesión */}
        <Pressable style={styles.nextButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          )}
        </Pressable>

        {/* Sección de Registro */}
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
