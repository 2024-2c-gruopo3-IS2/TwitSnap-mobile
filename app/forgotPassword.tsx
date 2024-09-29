// ForgotPasswordPage.js

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
// import { requestPasswordReset } from '@/handlers/loginHandler'; // Comentada porque no está implementada
import styles from '../styles/forgotPassword';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Lista predefinida de correos electrónicos válidos para simular la existencia en la base de datos
  const validEmails = [
    'fduca8@gmail.com',
    'usuario2@ejemplo.com',
    'usuario3@ejemplo.com',
    // Agrega más correos según sea necesario
  ];

  // Función para validar el formato del correo electrónico usando una expresión regular simple
  const isValidEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordReset = async () => {
    // Validar que el campo de correo electrónico no esté vacío
    if (!email) {
      Alert.alert('Error', 'Por favor, ingresa tu correo electrónico.');
      return;
    }

    // Validar el formato del correo electrónico
    if (!isValidEmailFormat(email)) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setIsLoading(true);

    try {
      // Simular una espera de procesamiento (por ejemplo, 2 segundos)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Validar si el correo electrónico existe en la lista predefinida
      if (validEmails.includes(email.toLowerCase())) {
        // Simular el envío exitoso del enlace de recuperación
        Alert.alert('Éxito', 'Se ha enviado un enlace de recuperación a tu correo electrónico.');
        router.replace('./login');
      } else {
        // Simular un error cuando el correo electrónico no está registrado
        Alert.alert('Error', 'El correo electrónico ingresado no está registrado.');
      }

      /* 
      // Código comentado para llamadas a la API cuando el endpoint esté disponible
      const response = await requestPasswordReset(email);
      if (response.success) {
        Alert.alert('Éxito', 'Se ha enviado un enlace de recuperación a tu correo electrónico.');
        router.replace('./login');
      } else {
        Alert.alert('Error', response.message || 'No se pudo procesar la solicitud.');
      }
      */
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Pressable style={styles.resetButton} onPress={handlePasswordReset} disabled={isLoading}>
        {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Enviar Enlace</Text>}
      </Pressable>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.backText}>← Volver al inicio de sesión</Text>
      </Pressable>
    </View>
  );
}
