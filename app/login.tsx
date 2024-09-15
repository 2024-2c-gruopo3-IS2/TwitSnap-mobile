import React, { useState } from 'react';
import { View, Image, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import styles from '../styles/login';

export default function LoginPage() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para el indicador de carga
  const [error, setError] = useState(''); // Estado para manejar mensajes de error
  const router = useRouter(); // Para manejar la navegación

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
      // Simulación de llamada al servidor para el inicio de sesión
      const response = await new Promise<{ ok: boolean; status?: string }>((resolve, reject) => {
        setTimeout(() => {
          const isServiceError = false; // Cambia a 'true' para simular un error de servicio
          const isUserBlocked = false;  // Cambia a 'true' para simular un usuario bloqueado
          const isCredentialsValid = email === 'usuario@example.com' && password === 'Password123!';

          if (isServiceError) {
            reject(new Error('Error del servicio. Por favor, inténtalo más tarde.'));
          } else if (isUserBlocked) {
            resolve({ ok: false, status: 'blocked' });
          } else if (isCredentialsValid) {
            resolve({ ok: true });
          } else {
            resolve({ ok: false, status: 'invalid_credentials' });
          }
        }, 1000); // Simular retraso de 1 segundo
      });

      if (response.ok) {
        // CA1: Inicio de sesión exitoso
        router.replace('./feed'); // Navegar a la página de inicio (feed)
      } else {
        // Manejo de errores específicos
        if (response.status === 'blocked') {
          // CA4: Usuario bloqueado
          Alert.alert('Cuenta bloqueada', 'Tu cuenta ha sido bloqueada. Por favor, contacta al soporte.');
        } else if (response.status === 'invalid_credentials') {
          // CA1: Credenciales inválidas
          setError('Correo electrónico o contraseña incorrectos.');
        }
      }
    } catch (error) {
      // CA2: Error del servicio
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Error al conectar con el servidor.';
      Alert.alert('Error', errorMessage);
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
