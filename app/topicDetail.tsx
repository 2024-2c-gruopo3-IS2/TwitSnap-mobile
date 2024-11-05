import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BackButton from '../components/backButton';
import { searchSnapsByHashtag } from '@/handlers/postHandler';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebaseConfig';

export default function TopicDetail() {
  const { topic } = useLocalSearchParams(); // Obtener el tema desde los parámetros de la URL
  const [snaps, setSnaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Función para obtener la imagen de perfil de un usuario
  const fetchProfileImage = async (username) => {
    try {
      const imageRef = ref(storage, `profile_photos/${username}.png`);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      return 'https://via.placeholder.com/150'; // Imagen de placeholder en caso de error
    }
  };

  useEffect(() => {
    const fetchSnaps = async () => {
      setIsLoading(true);
      const response = await searchSnapsByHashtag(topic);

      if (response.success && response.snaps) {
        // Obtener la URL de la imagen de perfil para cada snap
        const snapsWithProfileImages = await Promise.all(
          response.snaps.map(async (snap) => {
            const profileImage = await fetchProfileImage(snap.username);
            return { ...snap, profileImage };
          })
        );

        setSnaps(snapsWithProfileImages);
      } else {
        setErrorMessage(response.message || `No se pudieron cargar los snaps para el hashtag #${topic}.`);
      }
      setIsLoading(false);
    };

    fetchSnaps();
  }, [topic]);

  const renderItem = ({ item }) => (
    <View style={styles.postItem}>
      {/* Imagen de perfil */}
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.username}>@{item.username}</Text>
        <Text style={styles.content}>{item.message}</Text>
      </View>
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

      {isLoading ? (
        <ActivityIndicator size="large" color="#1DA1F2" />
      ) : errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : snaps.length === 0 ? (
        <Text style={styles.noSnapsText}>No hay snaps relacionados con este tema.</Text>
      ) : (
        <FlatList
          data={snaps}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : `snap-${index}`)}
          renderItem={renderItem}
        />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 50,
    marginTop: 60,
  },
  header: {
    fontSize: 22,
    color: '#1DA1F2',
    fontWeight: 'bold',
    marginLeft: 85,
    marginTop: 25,
  },
  postItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  whiteText: {
    color: '#FFF',
  },
  blueText: {
    color: '#1DA1F2',
  },
  username: {
    color: '#1DA1F2',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    color: '#FFF',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noSnapsText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
