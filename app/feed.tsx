import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { getAllSnaps, createSnap } from '@/handlers/postHandler';
import Footer from '../components/footer';
import { useRouter } from 'expo-router';
import styles from '../styles/feed';

interface Snap {
  id: string; 
  username: string;
  time: string;
  message: string;
  isPrivate: boolean;
}

interface Post {
  id?: string;  
  username: string;
  time: string;
  message: string;
  isPrivate: boolean;
}

export default function Feed() {
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSnaps = async () => {
      const response = await getAllSnaps();
      if (response.success && response.snaps && response.snaps.length > 0) {
        const snaps: Snap[] = response.snaps.map((snap: any) => ({
          id: snap._id,
          username: snap.email, //va USERNAME
          time: snap.time,
          message: snap.message,
          isPrivate: snap.isPrivate,
        }));
        setSnaps(snaps); // Guardamos todos los snaps
      }
      setIsLoading(false);
    };

    fetchSnaps();
  }, []);

  // Función para añadir un nuevo snap al feed
  const addNewPost = async (newPost: Post): Promise<void> => {
    const { message , isPrivate } = newPost;
    const response = await createSnap(message, isPrivate);
    if (response.success && response.snap) {
      const newSnap: Snap = {
        id: response.snap.id.toString(),
        username: response.snap.username,
        time: response.snap.time,
        message: response.snap.content,
        isPrivate: response.snap.isPrivate,
      };
      setSnaps([newSnap, ...snaps]); // Añadir al inicio
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
      <Text style={styles.content}>{item.message}</Text>
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
      {/* Logo en el centro arriba */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/twitsnap-logo.png')} 
          style={styles.logo}
        />
      </View>

      {/* Lista de snaps */}
      {snaps.length > 0 ? (
        <FlatList
          data={snaps}
          keyExtractor={(item) => item.id?.toString() || ''}  
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
