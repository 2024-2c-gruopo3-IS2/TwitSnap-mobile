import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SearchBar = ({ searchText, setSearchText, handleSearchButton }) => {
  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search name"
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    paddingRight: 15,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: '#F8F8F8',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#2D58A0",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SearchBar;

