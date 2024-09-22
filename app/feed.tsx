import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import { getAllSnaps, createSnap } from '@/handlers/postHandler';
import BackButton from '../components/backButton';
import Footer from '../components/footer';
import { useRouter } from 'expo-router';


interface Snap {
  id: number;
  username: string;
  time: string;
  content: string;
  isPrivate: boolean;
}

type Post = {
  content: string;
  isPrivate: boolean;
};

export default function Feed() {
  const [searchQuery, setSearchQuery] = useState('');
  const [snaps, setSnaps] = useState<Snap[]>([
    {
      id: 1,
      username: 'user1',
      time: 'Hace 2 horas',
      content: 'Este es un TwitSnap de ejemplo.',
      isPrivate: false,
    },
    {
      id: 2,
      username: 'user2',
      time: 'Hace 3 horas',
      content: '¡Hola a todos! Este es otro TwitSnap de ejemplo.',
      isPrivate: false,
    },
  ]);
  const [filteredSnaps, setFilteredSnaps] = useState<Snap[]>(snaps);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSnaps = async () => {
      const response = await getAllSnaps();
      if (response.success && response.snaps && response.snaps.length > 0) {
        setSnaps(response.snaps); // Guardamos todos los snaps
        setFilteredSnaps(response.snaps); // Inicialmente mostramos todos
      }
      setIsLoading(false);
    };

    fetchSnaps();
  }, []);

  // Función para añadir un nuevo snap al feed
  const addNewPost = async (newPost: Post): Promise<void> => {
    const { content, isPrivate } = newPost;
    const response = await createSnap(content, isPrivate);
    if (response.success && response.snap) {
      const newSnap = response.snap;
      setSnaps([newSnap, ...snaps]); // Añadir al inicio
      setFilteredSnaps([newSnap, ...filteredSnaps]); // Actualizar la lista filtrada
    }
  };

  const renderItem = ({ item }: { item: Snap }) => (
    <Pressable
      style={styles.snapContainer}
      onPress={() => router.push(`/profileView`)} // Hardcode temporal
    >
      <View style={styles.snapHeader}>
        <Text style={styles.username}>@{item.username}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.content}>{item.content}</Text>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}


      {/* Lista de snaps */}
      {filteredSnaps.length > 0 ? (
        <FlatList
          data={filteredSnaps}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <Text style={styles.noResultsText}>No se encontraron snaps</Text>
      )}

      {/* Footer con botón + */}
      <Footer addNewPost={addNewPost} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    fontSize: 16,
  },
  snapContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  snapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    color: '#1DA1F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
  content: {
    color: '#fff',
    fontSize: 16,
  },
  noResultsText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
