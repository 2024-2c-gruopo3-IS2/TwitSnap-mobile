import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from '../styles/confirmPin';
import { AuthContext } from '@/context/authContext';
import { generatePin, verifyPin } from '@/handlers/signUpHandler';

export default function ConfirmPinPage() {
  const router = useRouter();
  const { email, password, country, interests } = useLocalSearchParams(); // Datos del usuario
  const [enteredPin, setEnteredPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false); // Estado para la simulación del envío del nuevo PIN
  const { setIsAuthenticated, updateRegistrationState, clearRegistration } = useContext(AuthContext);

  useEffect(() => {
    const saveInitialState = async () => {
      await updateRegistrationState({
        currentStep: 'confirmPin',
        email,
        password,
        country,
        interests,
      });
    };

    saveInitialState();
  }, [email, password, country, interests, updateRegistrationState]);

  const handleConfirmPin = async () => {
    if (!enteredPin) {
      Alert.alert('Error', 'Por favor, ingresa el PIN de confirmación.');
      return;
    }

    setIsVerifying(true);

    try {
      const isValid = await verifyPin(email, enteredPin); // Verifica el PIN usando verifyPin

      if (isValid) {
        setIsAuthenticated(true);
        await clearRegistration(); // Limpia el estado de registro al confirmar exitosamente
        router.replace('/tabs');
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
      const newPin = await generatePin(email); // Genera un nuevo PIN usando generatePin
      console.log(`Nuevo PIN: ${newPin}`);
      await updateRegistrationState({ pin: newPin }); // Guarda el nuevo PIN en el estado de registro
      Alert.alert('Éxito', 'Se ha enviado un nuevo PIN a tu correo.');
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
