import React, { useState } from 'react';
import { View, Image, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import styles from '../styles/signup';

export default function SignUpPage() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // State for validation errors
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleSignUp = async () => {
    // Reset errors
    setErrors({ email: '', password: '' });

    // Validation checks
    let hasError = false;
    let newErrors = { email: '', password: '' };

    // CA4: Validate email
    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
      hasError = true;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'El correo electrónico no es válido.';
      hasError = true;
    }

    // CA4: Validate password
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate a server call for registration
      // Replace with actual API call in production
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const isServiceError = false; // Set to true to simulate a service error
          if (isServiceError) {
            reject(new Error('Error del servicio. Por favor, inténtalo más tarde.'));
          } else {
            resolve({ ok: true });
          }
        }, 1000);
      });

      if ((response as { ok: boolean }).ok) {
        // CA1: Successful registration
        // CA2: Navigate to location screen to obtain default location
        router.push('./location');
      } else {
        // CA5: Registration failed due to service error
        Alert.alert('Error', 'Error al registrar el usuario. Inténtalo de nuevo.');
      }
    } catch (error) {
      // CA5: Handle service error
      console.error(error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message || 'Error al conectar con el servidor.');
      } else {
        Alert.alert('Error', 'Error al conectar con el servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/twitsnap-logo.png')} style={styles.logoContainer} />
      </View>

      {/* Title Section */}
      <Text style={styles.title}>Regístrate en TwitSnap</Text>

      {/* Google Sign-Up Button */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.googleButton} onPress={handleSignUp}>
          <Image source={require('../assets/images/google-logo.png')} style={styles.googleIcon} />
          <Text style={styles.buttonText}>Registrarse con Google</Text>
        </Pressable>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>o</Text>
          <View style={styles.divider} />
        </View>

        {/* Email and Password Fields */}
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
          {/* Display email validation error */}
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
            <Pressable
              style={styles.passwordVisibilityButton}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="white" />
            </Pressable>
          </View>
          {/* Display password validation error */}
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        {/* Sign Up Button */}
        <Pressable style={styles.signupButton} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </Pressable>

        {/* Link to Login */}
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
