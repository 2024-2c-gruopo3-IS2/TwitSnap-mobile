import React, { useState } from 'react';
import { View, Image, Text, TextInput, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import styles from '../styles/login';

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const handleLogin = () => {
    Alert.alert('Login', 'Iniciar sesión con Google');
    // Navigate to FeedPage after logging in
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/twitsnap-logo.png')} style={styles.logoContainer} />
      </View>

      {/* Title Section */}
      <Text style={styles.title}>Inicia sesión en TwitSnap</Text>

      {/* Login Button Section */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.googleButton} onPress={handleLogin}>
          <Image source={require('../assets/images/google-logo.png')} style={styles.googleIcon} />
          <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
        </Pressable>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>o</Text>
          <View style={styles.divider} />
        </View>

        {/* Input Fields */}
        <TextInput
          placeholder="Teléfono, correo electrónico o nombre"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setPhone}
        />

        {/* Password Input Field */}
        {phone.length > 0 && (
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              style={styles.passwordInput}
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
            />
            <Pressable style={styles.passwordVisibilityButton} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="white" />
            </Pressable>
          </View>
        )}

        {/* Login Button */}
        <Link href="/feed" asChild>
          <Pressable style={styles.nextButton}>
            <Text style={styles.buttonText}>Siguiente</Text>
          </Pressable>
        </Link>

        {/* Sign Up Section */}
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
