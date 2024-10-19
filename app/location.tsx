import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, TextInput, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import styles from '../styles/location';
import { saveRegistrationState, getRegistrationState } from '@/helper/registrationStorage';

export default function UbicacionPage() {
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([]); // Lista de países
  const [filteredCountries, setFilteredCountries] = useState<{ name: string; code: string }[]>([]); // Lista filtrada de países
  const [searchQuery, setSearchQuery] = useState(''); // Consulta de búsqueda
  const [selectedCountry, setSelectedCountry] = useState(''); // País seleccionado
  const router = useRouter();
  const { email, password } = useLocalSearchParams(); // Obtener los parámetros de la URL

  // Fetch para obtener los países desde la API de RESTCountries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const countryList = data
          .map((country: { name: { common: string }; cca2: string }) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)); // Ordenar países alfabéticamente
        setCountries(countryList);
        setFilteredCountries(countryList); // Inicialmente, la lista filtrada es igual a la lista completa
      } catch (error) {
        console.error('Error al obtener los países:', error);
      }
    };

    fetchCountries();
  }, []);

  // Filtrar países en base a la consulta de búsqueda
  useEffect(() => {
      const loadSavedState = async () => {
          const savedState = await getRegistrationState();
          if (savedState?.country) {
              setSelectedCountry(savedState.country);
        }
        const filteredList = countries.filter((country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        };
        setFilteredCountries(filteredList);
        loadSavedState();
      }, [searchQuery, countries]);

  // Manejar selección o deselección del país
  const handleCountrySelect = (country: string) => {
    if (selectedCountry === country) {
      // Si el país ya está seleccionado, lo deselecciona
      setSelectedCountry('');
    } else {
      // Si es un nuevo país, lo selecciona
      setSelectedCountry(country);
    }
  };

    const handleNext = async () => {
        if (!selectedCountry) {
        Alert.alert('Error', 'Por favor, selecciona tu país.');
        } else {
        try {
          console.log(selectedCountry);
          await SecureStore.setItemAsync('country', selectedCountry);

          const registrationState = {
            email,
            password,
            country: selectedCountry,
            currentStep: 'interests',
          };
          await saveRegistrationState(registrationState);

          router.push({
            pathname: './interests',
            params: { email, password, country: selectedCountry },
          });
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'No se pudo guardar la información.');
        }
        }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Dónde resides?</Text>
      <Text style={styles.label}>Selecciona tu país de residencia:</Text>

      {/* Input de búsqueda de países */}
      <TextInput
        placeholder="Escribe tu país"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      {/* Lista de países filtrados */}
      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.countryButton,
              selectedCountry === item.name ? { backgroundColor: '#0A84FF' } : { backgroundColor: '#333' }, // Cambiar color según la selección
            ]}
            onPress={() => handleCountrySelect(item.name)}
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </Pressable>
        )}
      />

      {/* Botón Siguiente */}
      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </Pressable>
    </View>
  );
}
