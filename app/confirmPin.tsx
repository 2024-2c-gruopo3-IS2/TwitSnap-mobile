import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from '../styles/confirmPin';

export default function ConfirmPinPage() {
  const router = useRouter();
  const { email, password, country, interests, pin: originalPin } = useLocalSearchParams(); // Recibe el PIN original
  const [enteredPin, setEnteredPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pin, setPin] = useState(originalPin); // Mantenemos un estado para el PIN actual
  const [isResending, setIsResending] = useState(false); // Estado para la simulación del envío del nuevo PIN

  const handleConfirmPin = async () => {
    if (!enteredPin) {
      Alert.alert('Error', 'Por favor, ingresa el PIN de confirmación.');
      console.log("Pin original: " + pin);
      console.log("Pin ingresado: " + enteredPin);
      return;
    }

    setIsVerifying(true);

    try {
      // Simular espera de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verificar el PIN ingresado
      if (enteredPin === pin) {
        Alert.alert('Éxito', 'Tu cuenta ha sido confirmada exitosamente.');
        router.replace('./feed');
      } else {
        Alert.alert('Error', 'El PIN ingresado es incorrecto.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendPin = async () => {
    setIsResending(true);

    try {
      // Simular el envío de un nuevo PIN (espera de 2 segundos)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generar un nuevo PIN simulado (para esta demostración, un número aleatorio)
      const newPin = Math.floor(1000 + Math.random() * 9000).toString();
      setPin(newPin);

      Alert.alert('Nuevo PIN Enviado', `Se ha enviado un nuevo PIN: ${newPin}`);
      console.log(`Nuevo PIN: ${newPin}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo enviar un nuevo PIN. Intenta nuevamente.');
    } finally {
      setIsResending(false);
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

      <Pressable onPress={handleResendPin} disabled={isResending}>
        {isResending ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.resendText}>¿No recibiste el PIN? Solicitar nuevamente</Text>
        )}
      </Pressable>
    </View>
  );
}
