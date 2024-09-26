// feed.tsx (Modificado)
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { getAllSnaps, createSnap } from '@/handlers/postHandler';
import Footer from '../components/footer';
import { useRouter } from 'expo-router';
import styles from '../styles/feed';
import SnapItem from '../components/snapItem'; // Asegúrate de que la ruta sea correcta
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Snap {
  id: string; 
  username: string;
  time: string;
  message: string;
  isPrivate: boolean;
  likes: number;
  likedByUser: boolean;
  canViewLikes: boolean;
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
      // Simulación de llamada a la API
      // const response = await getAllSnaps();
      const response = {
        success: true,
        snaps: [
          {
            _id: 'snap1',
            username: 'usuario1',
            time: 'Hace 2 horas',
            message: 'Este es mi primer snap!',
            isPrivate: false,
            likes: 10,
            likedByUser: false,
            canViewLikes: true, // Simulación de privacidad
          },
          {
            _id: 'snap2',
            username: 'usuario2',
            time: 'Ayer',
            message: 'Otro día, otro snap.',
            isPrivate: true,
            likes: 5,
            likedByUser: true,
            canViewLikes: false, // Simulación de privacidad
          },
          // Agrega más snaps simulados si es necesario
        ],
      };

      if (response.success && response.snaps && response.snaps.length > 0) {
        const snaps: Snap[] = response.snaps.map((snap: any) => ({
          id: snap._id,
          username: snap.username, 
          time: snap.time,
          message: snap.message,
          isPrivate: snap.isPrivate,
          likes: snap.likes || 0,
          likedByUser: snap.likedByUser || false,
          canViewLikes: snap.canViewLikes || false,
        }));
        setSnaps(snaps); 
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
        likes: response.snap.likes,
        likedByUser: response.snap.likedByUser,
        canViewLikes: response.snap.canViewLikes,
      };
      setSnaps([newSnap, ...snaps]); 
    }
  };

  // Función para manejar el Like
  const handleLike = (snapId: string) => {
    setSnaps(prevSnaps =>
      prevSnaps.map(snap => {
        if (snap.id === snapId) {
          const updatedLikeStatus = !snap.likedByUser;
          const updatedLikes = updatedLikeStatus ? snap.likes + 1 : snap.likes - 1;
          // Simulación de confirmación visual
          Alert.alert(
            updatedLikeStatus ? 'Me Gusta' : 'Me Gusta Cancelado',
            updatedLikeStatus 
              ? 'Has dado "Me Gusta" al TwitSnap.'
              : 'Has cancelado tu "Me Gusta" al TwitSnap.'
          );
          return {
            ...snap,
            likedByUser: updatedLikeStatus,
            likes: updatedLikes,
          };
        }
        return snap;
      })
    );
  };

  const renderItem = ({ item }: { item: Snap }) => (
    <SnapItem snap={item} onLike={handleLike} />
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
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No se encontraron snaps</Text>
        </View>      
      )}

      {/* Footer con botón + */}
      <Footer addNewPost={addNewPost} />
    </View>
  );
}
