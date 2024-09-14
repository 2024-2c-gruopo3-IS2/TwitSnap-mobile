import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { IconButton } from 'react-native-paper';
import styles from '../styles/search'; 
import Footer from '../components/footer'; // Importamos el Footer

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <IconButton icon="magnify" iconColor="#fff" size={24} />
        <TextInput
          style={styles.input}
          placeholder="Buscar en TwitSnap"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Search Results */}
      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultText}>Resultados de búsqueda aparecerán aquí</Text>
      </ScrollView>

      {/* Botón Volver */}
      <View style={styles.backButtonContainer}>
        <Pressable style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>

      {/* Footer global */}
      <Footer />
    </View>
  );
}
