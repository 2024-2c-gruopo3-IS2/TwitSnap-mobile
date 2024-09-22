import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { checkUsernameAvailability, createProfile } from '@/handlers/profileHandler';
import { registerUser } from '../handlers/signUpHandler';
import styles from '../styles/userRegisterData';
import { removeToken } from '@/handlers/authTokenHandler';

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
  // const handleUsernameBlur = async () => {
  //   if (username) {
  //     setIsCheckingUsername(true);
  //     const isAvailable = await checkUsernameAvailability(username);
  //     setIsCheckingUsername(false);
  //     if (!isAvailable) {
  //       Alert.alert('Error', 'El nombre de usuario ya está en uso. Por favor, elige otro.');
  //       setUsername(''); // Reset username if it's taken
  //     }
  //   }
  // };
   // Función para validar la fecha de nacimiento
   const isValidDateOfBirth = (dob: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dob)) {
      return false;
    }

    const [year, month, day] = dob.split('-').map(Number);
    const currentDate = new Date();
    const enteredDate = new Date(year, month - 1, day);

    // Validar que la fecha exista
    if (enteredDate.getFullYear() !== year || enteredDate.getMonth() + 1 !== month || enteredDate.getDate() !== day) {
      return false;
    }

    // Validar que no sea una fecha futura
    if (enteredDate > currentDate) {
      return false;
    }

    return true;
  };

  // Function to submit data
  const handleSubmit = async () => {
    if (!name || !surname || !username || !dateOfBirth) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (!isValidDateOfBirth(dateOfBirth)) {
    Alert.alert('Error', 'Fecha de nacimiento inválida. Debe estar en formato YYYY-MM-DD,\n Por ejemplo 2008-01-01');
      return;
    }

    setIsSubmitting(true);

    try {
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
        //onBlur={handleUsernameBlur}
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
