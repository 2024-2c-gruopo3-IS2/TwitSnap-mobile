import React, { useState } from 'react';
import { View, Image, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import styles from '../styles/signup';
import { registerUser } from '@/handlers/signUpHandler';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  // Expresiones regulares para validación
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleSignUp = async () => {
    setErrors({ email: '', password: '' });

    let hasError = false;
    let newErrors = { email: '', password: '' };

    // Validar correo electrónico
    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
      hasError = true;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'El correo electrónico no es válido.';
      hasError = true;
    }

    // Validar contraseña
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
      const response = await registerUser(email, password);
      if (response.success) {
        router.push({
          pathname: './location',
          params: { email, password }
        });
      } else {
        if (response.message === 'Email already in use') {
          Alert.alert('Error', 'El correo electrónico ya está en uso.');
        } else {
          Alert.alert('Error', 'Error al registrar el usuario.');
      }
    }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/twitsnap-logo.png')} style={styles.logoContainer} />
      </View>

      <Text style={styles.title}>Regístrate en TwitSnap</Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.googleButton}
          onPress={() => Alert.alert('Registro con Google', 'Funcionalidad no implementada aún')}
        >
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
            <Pressable
              style={styles.passwordVisibilityButton}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
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
