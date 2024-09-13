import React, { useState } from 'react';
import { View, Image, Text, TextInput, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import styles from '../styles/signup';

export default function SignUpPage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const handleSignUp = () => {
    Alert.alert('Sign Up', 'Registro exitoso');
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
        <Link href="/feed" asChild>
          <Pressable style={styles.signupButton}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </Pressable>
        </Link>

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
