// components/SignUpPage.tsx
import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/signup';

export default function SignUpPage({ togglePage }: { togglePage: () => void }) { 
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignUp = () => {
    Alert.alert('Sign Up', 'Registro exitoso');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/twitsnap-logo.png')} style={styles.logoContainer} />
      </View>
      <Text style={styles.title}>Regístrate en TwitSnap</Text>
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
          <TouchableOpacity style={styles.passwordVisibilityButton} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          ¿Ya tienes una cuenta?{" "}
          <Text style={styles.signupLink} onPress={togglePage}> {/* Llamar a togglePage */}
            Inicia sesión
          </Text>
        </Text>
      </View>
    </View>
  );
}
