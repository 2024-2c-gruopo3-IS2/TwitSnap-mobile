// components/LoginPage.tsx
import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/login';

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    Alert.alert('Login', 'Iniciar sesión con Google');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', '¿Olvidaste tu contraseña?');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/twitsnap-logo.png')} style={styles.logoContainer} />
      </View>
      <Text style={styles.title}>Inicia sesión en TwitSnap</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={handleLogin}>
          <Image source={require('../assets/images/google-logo.png')} style={styles.googleIcon} />
          <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>o</Text>
          <View style={styles.divider} />
        </View>
        <TextInput
          placeholder="Teléfono, correo electrónico o nombre"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setPhone}
        />
        {phone.length > 0 && (
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              style={styles.passwordInput}
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.passwordVisibilityButton} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={() => { }}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} onPress={handleForgotPassword}>
          <Text style={styles.ghostButtonText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          ¿No tienes una cuenta?{" "}
          <Text style={styles.signupLink} onPress={() => { }}>
            Regístrate
          </Text>
        </Text>
      </View>
    </View>
  );
}
