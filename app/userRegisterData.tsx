import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { checkUsernameAvailability, createProfile } from '@/handlers/profileHandler';
import { registerUser } from '../handlers/signUpHandler';
import styles from '../styles/userRegisterData';

export default function UserDataPage() {
  const router = useRouter();
  const { email, password, country, interests } = useLocalSearchParams(); // Obtener datos previos
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to check username availability
  const handleUsernameBlur = async () => {
    if (username) {
      setIsCheckingUsername(true);
      const isAvailable = await checkUsernameAvailability(username);
      setIsCheckingUsername(false);
      if (!isAvailable) {
        Alert.alert('Error', 'El nombre de usuario ya está en uso. Por favor, elige otro.');
        setUsername(''); // Reset username if it's taken
      }
    }
  };

  // Function to submit data
  const handleSubmit = async () => {
    if (!name || !surname || !username || !dateOfBirth) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setIsSubmitting(true);

    try {
      // // 1. Register the user with auth API
      // const authResponse = await registerUser(email as string, password as string);

      // if (!authResponse.success) {
      //   Alert.alert('Error', String(authResponse.message) || 'Error al registrar el usuario.');
      //   setIsSubmitting(false);
      //   return;
      // }
      console.log('email:', email);
      console.log('password:', password);
      console.log('country:', country);
      console.log('interests:', interests);
      console.log('name:', name);
      console.log('surname:', surname);
      console.log('username:', username);
      console.log('dateOfBirth:', dateOfBirth);
      const formattedDate = new Date(dateOfBirth).toISOString().split('T')[0];
      const description = 'Hola, soy nuevo en la plataforma.';

      const profileData = {
        name,
        surname,
        username,
        description,
        location: country as string,
        date_of_birth: formattedDate,
        interests: typeof interests === 'string' ? interests.split(',') : [],
      };

      const profileResponse = await createProfile(profileData);

      if (!profileResponse.success) {
        Alert.alert('Error', String(profileResponse.message) || 'Error al crear el perfil.');
        setIsSubmitting(false);
        return;
      }
      // // 1. Register the user with auth API
      // const authResponse = await registerUser(email as string, password as string);

      // if (!authResponse.success) {
      //   Alert.alert('Error', String(authResponse.message) || 'Error al registrar el usuario.');
      //   setIsSubmitting(false);
      //   return;
      // }
      // Registration completed successfully
      Alert.alert('Éxito', 'Registro completado exitosamente.');
      router.push('./feed'); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo completar el registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completa tu perfil</Text>

      {/* Label for Name */}
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        placeholder="Ingresa tu nombre"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setName}
        value={name}
      />

      {/* Label for Surname */}
      <Text style={styles.label}>Apellido</Text>
      <TextInput
        placeholder="Ingresa tu apellido"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setSurname}
        value={surname}
      />

      {/* Label for Username */}
      <Text style={styles.label}>Nombre de Usuario</Text>
      <TextInput
        placeholder="Ingresa tu nombre de usuario"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setUsername}
        onBlur={handleUsernameBlur}
        value={username}
        autoCapitalize="none"
      />
      {isCheckingUsername && <ActivityIndicator size="small" color="#000" />}

      {/* Label for Date of Birth */}
      <Text style={styles.label}>Fecha de nacimiento formato (YYYY-MM-DD)</Text>
      <TextInput
        placeholder="Ingresa tu fecha de nacimiento"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setDateOfBirth}
        value={dateOfBirth}
      />

      <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Completar Registro</Text>
        )}
      </Pressable>
    </View>
  );
}
