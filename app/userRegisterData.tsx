import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Text, Pressable, Alert, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Importa el DateTimePickerModal
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createProfile } from '@/handlers/profileHandler';
import styles from '../styles/userRegisterData';
import { clearRegistrationState, saveRegistrationState, getRegistrationState } from '@/helper/registrationStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '@/context/authContext';

export default function UserDataPage() {
  const router = useRouter();
  const { email, password, country, interests } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null); // Estado para manejar la fecha
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // Estado para mostrar/ocultar el DatePicker
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUser } = useContext(AuthContext);

  useEffect(() => {
    const loadSavedState = async () => {
      const savedState = await getRegistrationState();
      if (savedState) {
        setName(savedState.name || '');
        setSurname(savedState.surname || '');
        setUsername(savedState.username || '');
        setDescription(savedState.description || '');
        if (savedState.date_of_birth) {
          setDateOfBirth(new Date(savedState.date_of_birth));
        }
      }
    };
    loadSavedState();
  }, []);

  // Función para manejar la selección de fecha
  const handleConfirmDate = (date: Date) => {
    setDateOfBirth(date);
    setDatePickerVisible(false);
  };

  // Función para validar que la fecha de nacimiento sea válida
  const isValidDateOfBirth = () => {
    if (!dateOfBirth) return false;
    const currentDate = new Date();
    return dateOfBirth < currentDate; // Asegura que la fecha es pasada
  };

  const handleSubmit = async () => {
    if (!name || !surname || !username || !isValidDateOfBirth()) {
      Alert.alert('Error', 'Por favor, completa todos los campos correctamente.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = dateOfBirth?.toISOString().split('T')[0]; // Formatea la fecha como YYYY-MM-DD

      const profileData = {
        name,
        surname,
        username,
        description,
        location: country as string,
        date_of_birth: formattedDate,
        interests: typeof interests === 'string' ? interests.split(',') : [],
      };

      await saveRegistrationState({ ...profileData, email, password, country, interests, currentStep: 'userRegisterData' });

      const profileResponse = await createProfile(profileData);

      if (!profileResponse.success) {
        Alert.alert('Error', String(profileResponse.message) || 'Error al crear el perfil.');
        setIsSubmitting(false);
        router.push('./login');
      } else {
        await refreshUser();
      }

      await clearRegistrationState();

      // Navegar a la página de confirmación del PIN
      router.push({
        pathname: './confirmPin',
        params: { email, password, country, interests },
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo completar el registro.');
      await AsyncStorage.removeItem('currentUsername');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('@/assets/images/twitsnap_logo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Completa tu perfil</Text>

        {/* Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          placeholder="Ingresa tu nombre"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setName}
          value={name}
        />

        {/* Apellido */}
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          placeholder="Ingresa tu apellido"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setSurname}
          value={surname}
        />

        {/* Nombre de Usuario */}
        <Text style={styles.label}>Nombre de Usuario</Text>
        <TextInput
          placeholder="Ingresa tu nombre de usuario"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />

        {/* Descripción del Usuario */}
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          placeholder="Escribe algo sobre ti"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setDescription}
          value={description}
          multiline // Permite múltiples líneas de texto
        />

        {/* Fecha de Nacimiento */}
        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <Pressable
          style={styles.datePickerButton}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={styles.datePickerText}>
            {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Selecciona tu fecha de nacimiento'}
          </Text>
        </Pressable>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisible(false)}
          maximumDate={new Date()} // Evita seleccionar una fecha futura
        />

        <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Completar Registro</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
