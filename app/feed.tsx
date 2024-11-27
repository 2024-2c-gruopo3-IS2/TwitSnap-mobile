// Feed.tsx
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getFeedSnaps, getFavouriteSnaps, getLikedSnaps, getSharedSnaps } from '@/handlers/postHandler';
import styles from '../styles/feed';
import SnapItem from '../components/snapItem';
import Toast from 'react-native-toast-message';
import { AuthContext } from '@/context/authContext';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebaseConfig';

interface Snap {
  id: string;
  username: string;
  created_at: string;
  time: string;
  message: string;
  isPrivate: boolean;
  likes: number;
  likedByUser: boolean;
  canViewLikes: boolean;
  favouritedByUser: boolean;
  profileImage: string;
  retweetUser: string;
  originalUsername?: string;
}

export default function Feed() {
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const currentUsername = user?.username || '';

  const fetchProfileImage = async (username: string) => {
    try {
      const imageRef = ref(storage, `profile_photos/${username}.png`);
      return await getDownloadURL(imageRef);
    } catch {
      return 'https://via.placeholder.com/150';
    }
  };

  useEffect(() => {
    const fetchSnaps = async () => {
      setIsLoading(true);

      try {
//         const [response, favouriteResponse, likesResponse, sharedResponse] = await Promise.all([
//           getFeedSnaps(),
//           getFavouriteSnaps(),
//           getLikedSnaps(),
//           getSharedSnaps(),
//         ]);
        const [response] = await Promise.all([getFeedSnaps()])

//         const favouriteSnapIds = favouriteResponse.snaps?.map(favSnap => favSnap.id) || [];
//         const likedSnapIds = likesResponse.snaps?.map(likeSnap => likeSnap.id) || [];

        let fetchedSnaps: Snap[] = [];

        console.log("[FEED] response: ", response);

        if (response.success && response.snaps && response.snaps.length > 0) {
          fetchedSnaps = await Promise.all(
            response.snaps.map(async (snap: any) => ({
              id: snap._id,
              username: snap.username,
              created_at: snap.created_at,
              message: snap.message,
              isPrivate: snap.is_private === 'true',
              likes: snap.likes || 0,
              likedByUser: snap.is_liked || false,
              canViewLikes: true,
              favouritedByUser: snap.is_favourited || false,
              retweetUser: snap.retweet_user || '',
              profileImage: await fetchProfileImage(snap.username),
              originalUsername: snap.original_username || undefined,
              sharedByUser: snap.is_shared || false,
            }))
          );
        }


//         const uniqueSnaps = Array.from(new Map(allSnaps.map(snap => [snap.id, snap])).values());
        // Actualizar el estado con `uniqueSnaps`
        setSnaps(fetchedSnaps);

      } catch (error) {
        console.error("Error fetching feed snaps:", error);
        Toast.show({
          type: 'error',
          text1: 'Error al obtener los snaps del feed',
          text2: 'Hubo un problema al cargar los Snaps. Inténtalo de nuevo.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnaps();
  }, []);

  // Función para manejar la actualización del Feed cuando se comparte un Snap
  const handleShareSnap = useCallback((sharedSnap: Snap) => {
    setSnaps(prevSnaps => [sharedSnap, ...prevSnaps]);


    Toast.show({
      type: 'success',
      text1: 'Snap compartido',
      text2: 'El snap ha sido compartido exitosamente.',
    });
  }, [currentUsername]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {snaps.length > 0 ? (
        <FlatList
          data={snaps}
          keyExtractor={(item) => item.id} // Asegurarse de que cada ID sea único
          renderItem={({ item }) => (
            <SnapItem
              snap={item}
              isOwnProfile={false} // El feed no es un perfil propio
              onShare={(sharedSnap: Snap) => handleShareSnap(sharedSnap)} // Pasar el Snap compartido
              currentUsername={currentUsername}
              isOwned={false} // El feed no tiene propiedad 'isOwned'
            />
          )}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No se encontraron snaps</Text>
        </View>
      )}
      <Toast />
    </View>
  );
}
