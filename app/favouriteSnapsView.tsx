// FavoriteSnapsView.tsx
import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  getFavouriteSnaps,
  getLikedSnaps,
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
  created_at: string;
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
  const { user } = useContext(AuthContext);
  const currentUsername = user?.username || '';

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
              created_at: snap.created_at,
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
          );

          // Ordenar los snaps por fecha y hora (los más recientes primero)
          favouriteSnaps.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);

            return dateB.getTime() - dateA.getTime(); // Ordena primero por fecha y hora
          });

          setSnaps(favouriteSnaps);
          console.log('Snaps Favoritos Ordenados:', favouriteSnaps);
        } else {
          setSnaps([]);
          Toast.show({
            type: 'info',
            text1: 'No tienes snaps favoritos.',
          });
        }
      } catch (error) {
        console.error('Error fetching favorite snaps:', error);
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



  // Función para manejar la eliminación de un snap de favoritos
  const handleUnfavourite = useCallback((snapId: string) => {
    setSnaps(prevSnaps => prevSnaps.filter(snap => snap.id !== snapId));
    Toast.show({
      type: 'success',
      text1: 'Snap eliminado de favoritos',
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Snap }) => (
      <SnapItem
        snap={item}
        isOwnProfile={false} // Asumiendo que no es el perfil propio
        onUnfavourite={handleUnfavourite} // Pasar el callback
        currentUsername={currentUsername} // Pasar el nombre de usuario actual
      />
    ),
    [handleUnfavourite, currentUsername]
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
        <BackButton />
        <Text style={styles.title}>Snaps Favoritos</Text>
        {/* Puedes agregar más elementos en el header si lo deseas */}
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
