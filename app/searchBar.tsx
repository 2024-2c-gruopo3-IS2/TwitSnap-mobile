import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ searchText, setSearchText, handleSearchButton, handleBackPress }) => {
  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Buscar usuario..."
        placeholderTextColor="#BBBBBB" // Color gris claro para el placeholder
      />
      <Ionicons name="search" size={24} color="#1DA1F2" style={styles.searchIcon} />

    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    paddingRight: 15,
    backgroundColor: 'black', // Fondo oscuro para la barra de búsqueda
    borderRadius: 25,
    paddingVertical: 5,
  },
  searchIcon: {
      marginLeft: 15,
      marginRight: 30,
    },
  searchInput: {
    flex: 1,
    height: 45,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#2C2C2C', // Fondo ligeramente más claro para el campo de entrada
    color: '#FFFFFF', // Texto blanco
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#1DA1F2", // Color azul para el botón de búsqueda
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    color: '#FFFFFF', // Texto blanco para el botón
    fontWeight: '600',
  },
});

export default SearchBar;
