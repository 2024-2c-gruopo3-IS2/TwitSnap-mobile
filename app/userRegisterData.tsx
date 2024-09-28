import React, { useState } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createProfile } from '@/handlers/profileHandler';
import styles from '../styles/userRegisterData';

export default function UserDataPage() {
  const router = useRouter();
  const { email, password, country, interests } = useLocalSearchParams(); 
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');

  // Función para validar que la fecha de nacimiento sea válida
  const isValidDateOfBirth = () => {
    const currentDate = new Date();
    const enteredDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    if (!year || !month || !day) return false;
    if (enteredDate > currentDate) return false;
    if (enteredDate.getFullYear() !== parseInt(year) || enteredDate.getMonth() !== parseInt(month) - 1 || enteredDate.getDate() !== parseInt(day)) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!name || !surname || !username || !isValidDateOfBirth()) {
      Alert.alert('Error', 'Por favor, completa todos los campos correctamente.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
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
        
      <View style={styles.dateRow}>
        {/* Día */}
        <View style={styles.dateColumn}>
          <Text style={styles.subLabel}>Día</Text>
          <Picker
            selectedValue={day}
            onValueChange={(itemValue) => setDay(itemValue)}
            style={styles.picker}
          >
            {[...Array(31).keys()].map(i => (
              <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
            ))}
          </Picker>
        </View>
          
        {/* Mes */}
        <View style={styles.dateColumn}>
          <Text style={styles.subLabel}>Mes</Text>
          <Picker
            selectedValue={month}
            onValueChange={(itemValue) => setMonth(itemValue)}
            style={styles.picker}
          >
            {[...Array(12).keys()].map(i => (
              <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
            ))}
          </Picker>
        </View>
          
        {/* Año */}
        <View style={styles.dateColumn}>
          <Text style={styles.subLabel}>Año</Text>
          <Picker
            selectedValue={year}
            onValueChange={(itemValue) => setYear(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 100 }, (_, i) => 2023 - i).map(year => (
              <Picker.Item key={year} label={`${year}`} value={`${year}`} />
            ))}
          </Picker>
        </View>
      </View>

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
