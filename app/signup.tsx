import React, { useState } from 'react';
import { View, Image, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import styles from '../styles/signup';

export default function SignUpPage() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Para manejar la navegación

  const handleSignUp = async () => {
    // Validación de campos obligatorios (CA4)
    let missingFields = [];
    if (!email) {
      missingFields.push('Correo electrónico');
    }
    if (!password) {
      missingFields.push('Contraseña');
    }
    if (missingFields.length > 0) {
      alert(`Faltan los siguientes campos: ${missingFields.join(', ')}.`);
      return;
    }
    setIsLoading(true);

    try {
      // Simulación de una llamada al servidor para el registro
      // const response = await fetch('https://api.ejemplo.com/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      const response = { ok: true }; // Simulación de respuesta exitosa

      if (response.ok) {
        // Registro exitoso, redirigir a la página de ubicación (CA2)
        router.push('./location');
      } else {
        // Registro fallido
        alert('Error al registrar el usuario. Inténtalo de nuevo.');
        // const data = await response.json();
        // alert(`Error del servicio: ${data.message || 'Ha ocurrido un error al registrar el usuario.'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con el servidor.');
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
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              style={styles.passwordInput}
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
              value={password}
            />
            <Pressable style={styles.passwordVisibilityButton} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="white" />
            </Pressable>
          </View>
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
