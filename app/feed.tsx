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
} from 'react-native';
import {
  getAllSnaps,
  likeSnap,
  unlikeSnap,
} from '@/handlers/postHandler'; // Asegúrate de importar likeSnap y unlikeSnap
import Footer from '../components/footer';
import { useRouter } from 'expo-router';
import styles from '../styles/feed';
import SnapItem from '../components/snapItem'; // Asegúrate de que la ruta sea correcta
import Icon from 'react-native-vector-icons/MaterialIcons';
import { usePostContext } from '../context/postContext'; 
import Toast from 'react-native-toast-message'; // Importar Toast

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
  const { addNewPost } = usePostContext();
  const router = useRouter();

  useEffect(() => {
    const fetchSnaps = async () => {
      const response = await getAllSnaps();
      console.log(response.snaps);
      console.log("username: " + response.snaps?.[0]?.username);

      if (response.success && response.snaps && response.snaps.length > 0) {
        const snaps: Snap[] = response.snaps.map((snap: any) => ({
          id: snap._id,
          username: snap.email, 
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

  // Función para manejar el Like
  const handleLike = async (snapId: string, likedByUser: boolean) => {
    // Optimizar la UI primero
    setSnaps(prevSnaps =>
      prevSnaps.map(snap => {
        if (snap.id === snapId) {
          const updatedLikeStatus = !likedByUser;
          const updatedLikes = updatedLikeStatus ? snap.likes + 1 : snap.likes - 1;
          return {
            ...snap,
            likedByUser: updatedLikeStatus,
            likes: updatedLikes,
          };
        }
        return snap;
      })
    );

    // Llamada a la API
    const apiResponse = likedByUser ? await unlikeSnap(snapId) : await likeSnap(snapId);

    if (apiResponse.success) {
      // Usar Toast
      Toast.show({
        type: 'success',
        text1: likedByUser ? 'Has quitado el "me gusta"' : 'Has dado "me gusta" exitosamente',
      });
    } else {
      // Revertir el cambio en caso de error
      setSnaps(prevSnaps =>
        prevSnaps.map(snap => {
          if (snap.id === snapId) {
            const revertedLikeStatus = likedByUser;
            const revertedLikes = revertedLikeStatus ? snap.likes + 1 : snap.likes - 1;
            return {
              ...snap,
              likedByUser: revertedLikeStatus,
              likes: revertedLikes,
            };
          }
          return snap;
        })
      );
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: apiResponse.message || 'Hubo un problema al procesar tu solicitud.',
      });
    }
  };

  const renderItem = ({ item }: { item: Snap }) => (
    <SnapItem snap={item} onLike={() => handleLike(item.id, item.likedByUser)} />
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
      <Footer  />

      {/* Añadir Toast */}
      <Toast />
    </View>
  );
}
