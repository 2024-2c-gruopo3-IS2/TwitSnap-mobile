// SearchPage.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Link } from 'expo-router'; // Usamos Link para navegar a los perfiles de usuarios
import styles from '../styles/search';
import Footer from '../components/footer'; // Importamos el Footer

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Lista hardcodeada de usuarios
  const users = [
    { id: 1, username: 'Brandn912', name: 'Brandon' },
    { id: 2, username: 'MartinJRR', name: 'Martín' },
    { id: 3, username: 'FR4N', name: 'Francisco' },
    { id: 4, username: 'VAL3N', name: 'Valentín' },
  ];

  // Filtramos los usuarios según el query de búsqueda
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <View key={user.id} style={styles.resultItem}>
              <Link href={`./user-profile?id=${user.id}`} asChild>
                <Pressable>
                  <Text style={styles.username}>{user.username}</Text>
                  <Text style={styles.name}>{user.name}</Text>
                </Pressable>
              </Link>
            </View>
          ))
        ) : (
          <Text style={styles.resultText}>No se encontraron resultados</Text>
        )}
      </ScrollView>

      {/* Footer global */}
      <Footer />
    </View>
  );
}
