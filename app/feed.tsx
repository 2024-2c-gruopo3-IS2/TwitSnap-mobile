import React, { useEffect, useState, useContext } from 'react';
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
  time: string;
  message: string;
  isPrivate: boolean;
  likes: number;
  likedByUser: boolean;
  canViewLikes: boolean;
  favouritedByUser: boolean;
  profileImage: string;
  retweetUsername: string;
  isShared?: boolean;
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
        const [response, favouriteResponse, likesResponse, sharedResponse] = await Promise.all([
          getFeedSnaps(),
          getFavouriteSnaps(),
          getLikedSnaps(),
          getSharedSnaps(),
        ]);

        const favouriteSnapIds = favouriteResponse.snaps?.map(favSnap => favSnap.id) || [];
        const likedSnapIds = likesResponse.snaps?.map(likeSnap => likeSnap.id) || [];
        const sharedSnapIds = sharedResponse.snaps?.map(sharedSnap => sharedSnap.id) || [];

        if (response.success && response.snaps && response.snaps.length > 0) {
          const fetchedSnaps: Snap[] = await Promise.all(
            response.snaps.map(async (snap: any) => ({
              id: snap._id,
              username: snap.username,
              time: snap.time,
              message: snap.message,
              isPrivate: snap.isPrivate,
              likes: snap.likes || 0,
              likedByUser: likedSnapIds.includes(snap._id),
              canViewLikes: true,
              favouritedByUser: favouriteSnapIds.includes(snap._id),
              isShared: sharedSnapIds.includes(snap._id),
              profileImage: await fetchProfileImage(snap.username),
              originalUsername: snap.originalUsername || undefined,
            }))
          );
          setSnaps(fetchedSnaps);
        } else {
          setSnaps([]);
        }
      } catch (error) {
        console.error("Error fetching feed snaps:", error);
        Toast.show({
          type: 'error',
          text1: 'Error al obtener los snaps del feed',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnaps();
  }, []);

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
          keyExtractor={(item) => item.id?.toString() || ''}
          renderItem={({ item }) => (
            <SnapItem
              snap={item}
              likeIconColor={item.likedByUser ? 'red' : 'gray'}
              favouriteIconColor={item.favouritedByUser ? 'yellow' : 'gray'}
              shareIconColor={item.isShared ? 'green' : 'gray'}
              currentUsername={currentUsername}
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
