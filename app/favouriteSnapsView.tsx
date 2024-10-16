// FavoriteSnapsView.tsx

import React, { useEffect, useState, useCallback } from 'react';
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
  getFavouriteSnaps,
  likeSnap,
  unlikeSnap,
  favouriteSnap,
  unfavouriteSnap,
} from '@/handlers/postHandler';
import { useRouter } from 'expo-router';
import styles from '../styles/favouriteSnapsView'; // Asegúrate de que la ruta es correcta
import SnapItem from '../components/snapItem';
import Toast from 'react-native-toast-message';

interface Snap {
  id: string;
  username: string;
  time: string;
  message: string;
  isPrivate: boolean;
  likes: number;
  likedByUser: boolean;
  canViewLikes: boolean;
  favouritedByUser: boolean;
}

export default function FavoriteSnapsView() {
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavouriteSnaps = async () => {
      setIsLoading(true);
      try {
        const response = await getFavouriteSnaps();
        if (response.success && response.snaps && response.snaps.length > 0) {
          const favouriteSnaps: Snap[] = response.snaps.map((snap: any) => {
            console.log("Snap ID:", snap._id); // Log para verificar IDs
            return {
              id: snap._id,
              username: snap.email,
              time: snap.time,
              message: snap.message,
              isPrivate: snap.isPrivate === 'true',
              likes: snap.likes || 0,
              likedByUser: snap.likedByUser || false,
              canViewLikes: true, // Asumiendo que puedes ver likes en tus favoritos
              favouritedByUser: true, // Todos los snaps en esta vista ya están favoritos
            };
          });
          setSnaps(favouriteSnaps);
        } else {
          setSnaps([]);
          Toast.show({
            type: 'info',
            text1: 'No tienes snaps favoritos.',
          });
        }
      } catch (error) {
        console.error("Error fetching favorite snaps:", error);
        Toast.show({
          type: 'error',
          text1: 'Error al obtener los snaps favoritos',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavouriteSnaps();
  }, []);

  // Función para manejar el Like
  const handleLike = async (snapId: string, likedByUser: boolean) => {
    // Optimizar la UI primero
    setSnaps(prevSnaps =>
      prevSnaps.map(snap => {
        if (snap.id === snapId) {
          const updatedLikeStatus = !snap.likedByUser;
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

  // Función para manejar el Favourite
  const handleFavourite = async (snapId: string, favouritedByUser: boolean) => {
    setSnaps(prevSnaps =>
      prevSnaps.map(snap => {
        if (snap.id === snapId) {
          return {
            ...snap,
            favouritedByUser: !snap.favouritedByUser,
          };
        }
        return snap;
      })
    );

    // Llamada a la API
    const apiResponse = favouritedByUser ? await unfavouriteSnap(snapId) : await favouriteSnap(snapId);

    if (apiResponse.success) {
      Toast.show({
        type: 'success',
        text1: favouritedByUser ? 'Has quitado el favorito' : 'Has marcado como favorito exitosamente',
      });
      // Si se desmarca como favorito, eliminarlo de la lista
      if (favouritedByUser) {
        setSnaps(prevSnaps => prevSnaps.filter(snap => snap.id !== snapId));
      }
    } else {
      // Revertir el cambio en caso de error
      setSnaps(prevSnaps =>
        prevSnaps.map(snap => {
          if (snap.id === snapId) {
            return {
              ...snap,
              favouritedByUser: favouritedByUser,
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

  const renderItem = useCallback(
    ({ item }: { item: Snap }) => (
      <SnapItem
        snap={item}
        onLike={() => handleLike(item.id, item.likedByUser)}
        onFavourite={() => handleFavourite(item.id, item.favouritedByUser)}
      />
    ),
    [snaps]
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

      {/* Lista de snaps favoritos */}
      {snaps.length > 0 ? (
        <FlatList
          data={snaps}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No tienes snaps favoritos</Text>
        </View>
      )}

      {/* Añadir Toast */}
      <Toast />
    </View>
  );
}
