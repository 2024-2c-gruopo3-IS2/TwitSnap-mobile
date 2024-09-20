import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/birthday';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { getToken, saveToken } from '../handlers/authTokenHandler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Asegúrate de tener una función para obtener el correo electrónico usando el token
const getEmailFromToken = async (token: string) => {
  try {
    console.log('Obteniendo email con el token:', token);
    const response = await fetch(`https://auth-microservice-vvr6.onrender.com/auth/get-email-from-token?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Email obtenido:', data.email);
      return data.email;
    } else {
      throw new Error(data.error || 'Error al obtener el correo electrónico');
    }
  } catch (error) {
    console.error('Error en getEmailFromToken:', error);
    Alert.alert('Error', 'No se pudo obtener el correo electrónico.');
  }
};

// Función para validar si el nombre de usuario es único
const validateUsername = async (username: string) => {
  try {
    const response = await fetch(`https://profile-microservice.onrender.com/validate-username?username=${username}`);
    const data = await response.json();
    if (response.ok) {
      return data.isUnique; // Devolverá `true` si es único, `false` si no
    } else {
      throw new Error(data.error || 'Error al validar el nombre de usuario');
    }
  } catch (error) {
    console.error('Error en validateUsername:', error);
    return false;
  }
};

// Función para crear el perfil usando el microservicio de perfiles
const createProfile = async (email: string, username: string, name: string, surname: string, birthday: string, country: string) => {
  try {
    console.log('Creando perfil con los datos:', { email, username, name, surname, birthday, country });
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const response = await fetch('https://profile-microservice.onrender.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        profile_data: {
          email,
          username,
          name,
          surname,
          location: country,
          description: 'Hey there! I am using TwitSnap.',
          date_of_birth: birthday,
        },
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Perfil creado:', data.message);
      return data.message;
    } else {
      throw new Error(data.error || 'Error al crear el perfil');
    }
  } catch (error) {
    console.error('Error en createProfile:', error);
    Alert.alert('Error', 'No se pudo crear el perfil.');
  }
};

export default function BirthdayPage() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('1');
  const [selectedMonth, setSelectedMonth] = useState<string>('1');
  const [selectedYear, setSelectedYear] = useState<string>('2000');
  const router = useRouter();

  const handleConfirmar = async () => {
    if (!name || !surname || !username || !selectedDay || !selectedMonth || !selectedYear) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const isUsernameUnique = await validateUsername(username);
    if (!isUsernameUnique) {
      Alert.alert('Error', 'El nombre de usuario ya está en uso.');
      return;
    }

    const formattedDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}`;
    console.log('Fecha de cumpleaños formateada:', formattedDate);

    try {
      const country = await SecureStore.getItemAsync('country');
      if (!country) {
        Alert.alert('Error', 'No se encontró el país seleccionado.');
        return;
      }

      const token = await getToken();
      if (token) {
        const email = await getEmailFromToken(token);
        if (email) {
          await createProfile(email, username, name, surname, formattedDate, country);
          router.push('./feed');
        }
      } else {
        Alert.alert('Error', 'No se encontró el token de autenticación.');
      }
    } catch (error) {
      console.error('Error en handleConfirmar:', error);
      Alert.alert('Error', 'No se pudo completar la acción.');
    }
  };

  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(<Picker.Item key={i} label={i.toString()} value={i.toString()} />);
    }
    return days;
  };

  const generateMonths = () => {
    const months = [
      { label: 'Enero', value: '1' },
      { label: 'Febrero', value: '2' },
      { label: 'Marzo', value: '3' },
      { label: 'Abril', value: '4' },
      { label: 'Mayo', value: '5' },
      { label: 'Junio', value: '6' },
      { label: 'Julio', value: '7' },
      { label: 'Agosto', value: '8' },
      { label: 'Septiembre', value: '9' },
      { label: 'Octubre', value: '10' },
      { label: 'Noviembre', value: '11' },
      { label: 'Diciembre', value: '12' },
    ];
    return months.map((month) => (
      <Picker.Item key={month.value} label={month.label} value={month.value} />
    ));
  };

  const generateYears = () => {
    const years = [];
    for (let i = new Date().getFullYear(); i >= 1900; i--) {
      years.push(<Picker.Item key={i} label={i.toString()} value={i.toString()} />);
    }
    return years;
  };
   
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completa tu información</Text>

      {/* Botón para confirmar */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.confirmButton} onPress={handleConfirmar}>
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </Pressable>
      </View>
  
      {/* Título para el campo de nombre */}
      <Text style={styles.fieldTitle}>Nombre</Text>
      <TextInput
        placeholder="Ingresa tu nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* Título para el campo de apellido */}
      <Text style={styles.fieldTitle}>Apellido</Text>
      <TextInput
        placeholder="Ingresa tu apellido"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
      />

      {/* Título para el campo de nombre de usuario */}
      <Text style={styles.fieldTitle}>Nombre de usuario</Text>
      <TextInput
        placeholder="Elige un nombre de usuario único"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
  
      {/* Título para seleccionar la fecha de nacimiento */}
      <Text style={styles.fieldTitle}>Fecha de nacimiento</Text>
  
      {/* Contenedor horizontal para día/mes/año */}
      <View style={styles.dateContainer}>
        {/* ComboBox para seleccionar el día */}
        <Picker
          selectedValue={selectedDay}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedDay(itemValue)}
        >
          {generateDays()}
        </Picker>
  
        {/* ComboBox para seleccionar el mes */}
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        >
          {generateMonths()}
        </Picker>
  
        {/* ComboBox para seleccionar el año */}
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {generateYears()}
        </Picker>
      </View>
    </View>
  );

}
  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Completa tu información</Text>

//       {/* Campo para el nombre */}
//       <TextInput
//         label="Nombre"
//         placeholder="Ingresa tu nombre"
//         value={name}
//         mode="outlined"
//         onChangeText={setName}
//         style={styles.input}
//       />

//       {/* Campo para el apellido */}
//       <TextInput
//         label="Apellido"
//         placeholder="Ingresa tu apellido"
//         value={surname}
//         mode="outlined"
//         onChangeText={setSurname}
//         style={styles.input}
//       />

//       {/* Campo para el nombre de usuario */}
//       <TextInput
//         label="Nombre de usuario"
//         placeholder="Elige un nombre de usuario único"
//         value={username}
//         mode="outlined"
//         onChangeText={setUsername}
//         style={styles.input}
//       />

//       {/* Botón para mostrar el selector de fecha */}
//       <Button mode="contained" onPress={showDatePicker} style={styles.dateButton}>
//         {birthday ? `Fecha de nacimiento: ${birthday.toLocaleDateString()}` : 'Selecciona tu fecha de nacimiento'}
//       </Button>

//       {/* Selector de fecha */}
//       <DateTimePickerModal
//         isVisible={isDatePickerVisible}
//         mode="date"
//         onConfirm={handleConfirm}
//         onCancel={hideDatePicker}
//       />

//       {/* Botón para confirmar */}
//       <View style={styles.buttonContainer}>
//         <Button mode="contained" onPress={handleConfirmar} style={styles.confirmButton}>
//           Confirmar
//         </Button>
//       </View>
//     </View>
//   );
// }
