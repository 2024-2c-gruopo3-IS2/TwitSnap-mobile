// app/ForgotPasswordPage.tsx

import React, { useState, useContext } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { requestPasswordReset, resetPassword } from '@/handlers/loginHandler'; // Asegúrate de importar correctamente las funciones
import styles from '../styles/forgotPassword';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const router = useRouter();

  // Función para validar el formato del correo electrónico usando una expresión regular simple
  const isValidEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para manejar la solicitud de reseteo de contraseña
  const handlePasswordResetRequest = async () => {
    console.log('handlePasswordResetRequest called');
    // Validar que el campo de correo electrónico no esté vacío
    if (!email) {
      Alert.alert('Error', 'Por favor, ingresa tu correo electrónico.');
      console.log('Validation failed: email is empty');
      return;
    }

    // Validar el formato del correo electrónico
    if (!isValidEmailFormat(email)) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
      console.log('Validation failed: invalid email format');
      return;
    }

    setIsLoading(true);
    console.log(`Sending password reset request for email: ${email}`);

    try {
      const response = await requestPasswordReset(email.toLowerCase());
      console.log('Response from requestPasswordReset:', response);

      if (response.success) {
        Alert.alert(
          'Éxito',
          response.message || 'Se ha enviado un enlace de recuperación a tu correo electrónico.',
          [
            {
              text: 'OK',
              onPress: () => {
                setResetRequested(true);
                console.log('Password reset requested successfully');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'No se pudo procesar tu solicitud de recuperación.');
        console.log('Password reset request failed:', response.message);
      }
    } catch (error) {
      console.error('Error al solicitar el reseteo de contraseña:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
      console.log('Password reset request process completed');
    }
  };

  // Función para manejar el cambio de contraseña
  const handleChangePassword = async () => {
    console.log('handleChangePassword called');
    // Validar que todos los campos estén llenos
    if (!email || !newPassword || !token) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      console.log('Validation failed: one or more fields are empty');
      return;
    }

    // Validar el formato del correo electrónico
    if (!isValidEmailFormat(email)) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
      console.log('Validation failed: invalid email format');
      return;
    }

    // Validar la fuerza de la nueva contraseña
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      console.log('Validation failed: password too short');
      return;
    }

    setIsLoading(true);
    console.log(`Attempting to reset password for email: ${email} with token: ${token}`);

    try {
      const response = await resetPassword(email.toLowerCase(), newPassword, token);
      console.log('Response from resetPassword:', response);

      if (response.success) {
        Alert.alert(
          'Éxito',
          response.message || 'Tu contraseña ha sido actualizada correctamente.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/login');
                console.log('Password reset successfully, navigating to login');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'No se pudo procesar tu solicitud.');
        console.log('Password reset failed:', response.message);
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
      console.log('Password change process completed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/twitsnap_logo.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>Recuperar Contraseña</Text>

        {/* Campo de Correo Electrónico */}
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />

        {/* Mostrar Campos Adicionales Después de Solicitar el Enlace */}
        {resetRequested && (
          <>
            {/* Campo de Nueva Contraseña */}
            <TextInput
              placeholder="Nueva Contraseña"
              placeholderTextColor="#aaa"
              style={styles.input}
              onChangeText={setNewPassword}
              value={newPassword}
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
            />

            {/* Campo de Token */}
            <TextInput
              placeholder="Token de Reseteo"
              placeholderTextColor="#aaa"
              style={styles.input}
              onChangeText={setToken}
              value={token}
              autoCapitalize="none"
            />
          </>
        )}

        {/* Botón de Enviar Enlace o Cambiar Contraseña */}
        {!resetRequested ? (
          <Pressable
            style={[styles.resetButton, isLoading && styles.buttonDisabled]}
            onPress={handlePasswordResetRequest}
            disabled={isLoading}
            accessibilityLabel="Enviar enlace de recuperación de contraseña"
            accessibilityRole="button"
          >
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Enviar Enlace</Text>}
          </Pressable>
        ) : (
          <Pressable
            style={[styles.resetButton, isLoading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={isLoading}
            accessibilityLabel="Cambiar contraseña"
            accessibilityRole="button"
          >
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Cambiar Contraseña</Text>}
          </Pressable>
        )}

        {/* Botón para Volver al Inicio de Sesión */}
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Volver al inicio de sesión</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
