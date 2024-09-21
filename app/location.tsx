import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import styles from '../styles/location';

export default function UbicacionPage() {
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([]); // Lista de países
  const [selectedCountry, setSelectedCountry] = useState(''); // País seleccionado
  const [cities, setCities] = useState<string[]>([]); // Lista de ciudades
  const [selectedCity, setSelectedCity] = useState(''); // Ciudad seleccionada
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
      } catch (error) {
        console.error('Error al obtener los países:', error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch para obtener las ciudades de un país usando la API de CountriesNow
  const fetchCities = async (countryName: string) => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: countryName,
        }),
      });
      const data = await response.json();
      
      if (data.error || !data.data) {
        console.error('No se encontraron ciudades para el país seleccionado.');
        setCities([]);
      } else {
        // Ordenar las ciudades alfabéticamente
        const sortedCities = data.data.sort((a: string, b: string) => a.localeCompare(b));
        setCities(sortedCities); // Actualizar lista de ciudades
      }
    } catch (error) {
      console.error('Error al obtener las ciudades:', error);
      setCities([]); // Vaciar la lista de ciudades en caso de error
    }
  };

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName); // Guardar el nombre del país directamente
    fetchCities(countryName); // Llamar a fetchCities con el nombre del país
  };

  const handleNext = async () => {
    if (!selectedCountry || !selectedCity) {
      Alert.alert('Error', 'Por favor, selecciona tu país y ciudad.');
    } else {
      try {
        console.log(selectedCountry, selectedCity);
        await SecureStore.setItemAsync('country', selectedCountry);
        await SecureStore.setItemAsync('city', selectedCity);
        router.push({
          pathname: './interests',
          params: { email, password, country: selectedCountry, city: selectedCity },
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

      {/* Selector de países */}
      <Picker
        selectedValue={selectedCountry}
        onValueChange={(value) => handleCountryChange(value)}
        style={styles.picker}
      >
        {countries.map((country) => (
          <Picker.Item key={country.code} label={country.name} value={country.name} />
        ))}
      </Picker>

      {/* Selector de ciudades */}
      {selectedCountry && cities.length > 0 && (
        <>
          <Text style={styles.label}>Selecciona tu ciudad:</Text>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(value) => setSelectedCity(value)}
            style={styles.picker}
          >
            {cities.map((city, index) => (
              <Picker.Item key={index} label={city} value={city} />
            ))}
          </Picker>
        </>
      )}

      {/* Botón Siguiente */}
      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </Pressable>
    </View>
  );
}