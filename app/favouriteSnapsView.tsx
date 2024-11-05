import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  getFavouriteSnaps,
  favouriteSnap,
  unfavouriteSnap,
  likeSnap,
  unlikeSnap,
  getLikedSnaps,
  shareSnap,
  unshareSnap,
} from '@/handlers/postHandler';
import { useRouter } from 'expo-router';
import styles from '../styles/favouriteSnapsView';
import SnapItem from '../components/snapItem';
import Toast from 'react-native-toast-message';
import BackButton from '../components/backButton';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { AuthContext } from '@/context/authContext';

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
  profileImage: string;
  retweetUser?: string;
  isShared?: boolean;
  mentions?: string[];
}



export default function FavoriteSnapsView() {
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfileImage = async (username: string): Promise<string> => {
    try {
      const imageRef = ref(storage, `profile_photos/${username}.png`);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      return 'https://via.placeholder.com/150';
    }
  };

useEffect(() => {
  const fetchFavouriteSnaps = async () => {
    setIsLoading(true);
    try {
      // Ejecutar ambas llamadas en paralelo
      const [favouriteResponse, likedResponse] = await Promise.all([
        getFavouriteSnaps(),
        getLikedSnaps(),
      ]);

      const favouriteSnapIds = favouriteResponse.snaps?.map((snap: any) => snap.id) || [];
      const likedSnapIds = likedResponse.snaps?.map((snap: any) => snap.id) || [];

      if (favouriteResponse.success && favouriteResponse.snaps) {
        const favouriteSnaps: Snap[] = await Promise.all(
          favouriteResponse.snaps.map(async (snap: any) => ({
            id: snap.id,
            username: snap.username,
            time: snap.time,
            message: snap.message,
            isPrivate: snap.isPrivate === 'true',
            likes: snap.likes || 0,
            likedByUser: likedSnapIds.includes(snap.id),
            canViewLikes: true,
            favouritedByUser: true,
            profileImage: await fetchProfileImage(snap.username), // Obtener la imagen de perfil
            retweetUser: snap.retweetUser || '',
            isShared: false, // Inicialmente no compartido
            mentions: snap.mentions || [],
          }))
        )

        setSnaps(favouriteSnaps);
        console.log('Snaps Favoritos:', favouriteSnaps);
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
      onSnapShare={() => handleSnapShare(item)} // Añadido
      isOwnProfile={false} // Asumiendo que no es el perfil propio
      likeIconColor={item.likedByUser ? 'red' : 'gray'}
      favouriteIconColor={item.favouritedByUser ? 'yellow' : 'gray'}
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

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Snaps Favoritos</Text>
        <BackButton />
      </View>

      {/* Lista de snaps favoritos */}
      {snaps.length > 0 ? (
            <FlatList
              data={snaps}
              keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : `snap-${index}`}
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
