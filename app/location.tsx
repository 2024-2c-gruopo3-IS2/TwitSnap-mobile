import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import styles from '../styles/location';

export default function UbicacionPage() {
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<{ name: string; code: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingCities, setLoadingCities] = useState(false);
  const [citiesError, setCitiesError] = useState(false);
  const router = useRouter();
  const { email, password } = useLocalSearchParams();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const countryList = data.map((country: { name: { common: string }; cca2: string }) => ({
          name: country.name.common,
          code: country.cca2,
        })).sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
        setCountries(countryList);
        setFilteredCountries(countryList);
      } catch (error) {
        console.error('Error al obtener los países:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  const fetchCities = async (countryName: string) => {
    setLoadingCities(true);
    setCitiesError(false);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country: countryName }),
      });
      const data = await response.json();
      if (data.error || !data.data) {
        setCities([]);
        setCitiesError(true);
      } else {
        const sortedCities = data.data.sort((a: string, b: string) => a.localeCompare(b));
        setCities(sortedCities);
        setFilteredCities(sortedCities); // Establece las ciudades filtradas al cargar
      }
    } catch (error) {
      console.error('Error al obtener las ciudades:', error);
      setCitiesError(true);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    setSearchTerm(countryName);
    fetchCities(countryName);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleCitySearch = (term: string) => {
    setSelectedCity('');
    setFilteredCities(cities.filter(city => city.toLowerCase().includes(term.toLowerCase())));
  };

  const handleNext = async () => {
    if (!selectedCountry || !selectedCity) {
      Alert.alert('Error', 'Por favor, selecciona tu país y ciudad.');
    } else {
      try {
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

      <TextInput
        placeholder="Buscar país..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
      />

      <Picker
        selectedValue={selectedCountry}
        onValueChange={handleCountryChange}
        style={styles.picker}
      >
        {filteredCountries.map((country) => (
          <Picker.Item key={country.code} label={country.name} value={country.name} />
        ))}
      </Picker>

      <Text style={styles.label}>Selecciona tu ciudad:</Text>

      {loadingCities ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : citiesError ? (
        <Text style={styles.errorText}>No hay ciudades disponibles en este país.</Text>
      ) : (
        <>
          <TextInput
            placeholder="Buscar ciudad..."
            onChangeText={handleCitySearch}
            style={styles.input}
          />
          <Picker
            selectedValue={selectedCity}
            onValueChange={handleCityChange}
            style={styles.picker}
          >
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <Picker.Item key={index} label={city} value={city} />
              ))
            ) : (
              <Picker.Item label="No se encontraron ciudades" value="" />
            )}
          </Picker>
        </>
      )}

      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </Pressable>
    </View>
  );
}
