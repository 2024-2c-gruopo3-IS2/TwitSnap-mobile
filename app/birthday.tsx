import React, { useState } from 'react';
import { View, Text, Pressable, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/birthday';
import { useRouter } from 'expo-router';

export default function BirthdayPage() {
  const [selectedDay, setSelectedDay] = useState<string>('1');
  const [selectedMonth, setSelectedMonth] = useState<string>('1');
  const [selectedYear, setSelectedYear] = useState<string>('2000');
  const router = useRouter();

  const handleConfirmarCumple = () => {
    if (!selectedDay || !selectedMonth || !selectedYear) {
      Alert.alert('Error', 'Por favor, selecciona tu fecha de cumpleaños completa.');
    } else {
      const formattedDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}`;
      console.log('Fecha de cumpleaños seleccionada:', formattedDate);
      router.push('./feed');
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
      <Text style={styles.title}>¿Cuándo es tu cumpleaños?</Text>

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

      {/* Botón para confirmar la fecha */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.confirmButton} onPress={handleConfirmarCumple}>
          <Text style={styles.confirmButtonText}>Empecemos!</Text>
        </Pressable>
      </View>
    </View>
  );
}
