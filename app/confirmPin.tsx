// ConfirmPinPage.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from '../styles/confirmPin';

export default function ConfirmPinPage() {
  const router = useRouter();
  const { email, password, country, interests, pin } = useLocalSearchParams(); // Recibe el PIN simulado
  const [enteredPin, setEnteredPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleConfirmPin = async () => {
    // Validar que el campo del PIN no esté vacío
    if (!enteredPin) {
      Alert.alert('Error', 'Por favor, ingresa el PIN de confirmación.');
      return;
    }

    setIsVerifying(true);

    try {
      // Simular una espera de procesamiento (por ejemplo, 2 segundos)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Validar el PIN ingresado
      if (enteredPin === pin) {
        Alert.alert('Éxito', 'Tu cuenta ha sido confirmada exitosamente.');
        // Navegar al feed o pantalla principal
        router.replace('./feed');
      } else {
        Alert.alert('Error', 'El PIN ingresado es incorrecto.');
      }

      /*
      // En una implementación real, realizarías una llamada al backend para verificar el PIN
      const response = await verifyPin(email, enteredPin);
      if (response.success) {
        Alert.alert('Éxito', 'Tu cuenta ha sido confirmada exitosamente.');
        router.replace('./feed');
      } else {
        Alert.alert('Error', response.message || 'El PIN ingresado es incorrecto.');
      }
      */
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirma tu Registro</Text>
      <Text style={styles.subtitle}>Ingresa el PIN de confirmación enviado a tu correo electrónico.</Text>

      <TextInput
        placeholder="PIN de Confirmación"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setEnteredPin}
        value={enteredPin}
        keyboardType="numeric"
        autoCapitalize="none"
      />

      <Pressable style={styles.confirmButton} onPress={handleConfirmPin} disabled={isVerifying}>
        {isVerifying ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirmar PIN</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.resendText}>¿No recibiste el PIN? Solicitar nuevamente</Text>
      </Pressable>
    </View>
  );
}
