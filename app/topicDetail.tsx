// app/topicDetail.tsx

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BackButton from '../components/backButton';

export default function TopicDetail() {
  const { topic } = useLocalSearchParams(); // Obtener el tema desde los parámetros de la URL

  // Datos ficticios de publicaciones relacionadas con el tema seleccionado
  const relatedPosts = [
    { id: '1', username: '@user1', content: `Discusión sobre ${topic} #1` },
    { id: '2', username: '@user2', content: `Ideas innovadoras en ${topic}` },
    { id: '3', username: '@user3', content: `Análisis profundo de ${topic}` },
    // Agrega más publicaciones aquí si es necesario
  ];

  const renderItem = ({ item }) => (
    <View style={styles.postItem}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton />
        <Text style={styles.header}>
          <Text style={styles.whiteText}>Trending Topic </Text>
          <Text style={styles.blueText}>{topic}</Text>
        </Text>
        </View>

      <FlatList
        data={relatedPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',      // Coloca los elementos en una fila
    alignItems: 'center',      // Alinea los elementos verticalmente al centro
    justifyContent: 'space-between', // Espacio uniforme entre los elementos
    marginBottom: 50,
    marginTop: 60,
  },
  header: {
    fontSize: 22,
    color: '#1DA1F2',
    fontWeight: 'bold',
    marginLeft: 85,            // Espacio entre el botón y el texto
    marginTop: 25,
  },
  postItem: {
    padding: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
    whiteText: {
      color: '#FFF', // "Trending Topic" en blanco
    },
    blueText: {
      color: '#1DA1F2', // `topic` en azul
    },
  username: {
    color: '#1DA1F2',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    color: '#FFF',
  },
});
