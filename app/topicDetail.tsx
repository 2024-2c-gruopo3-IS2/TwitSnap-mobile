import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BackButton from '../components/backButton';
import {
  searchSnapsByHashtag,
  shareSnap,
  unshareSnap,
  likeSnap,
  unlikeSnap,
  favouriteSnap,
  unfavouriteSnap,
  getFavouriteSnaps,
  getLikedSnaps,
} from '@/handlers/postHandler';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import SnapItem from '../components/snapItem';
import Toast from 'react-native-toast-message';
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
  retweetUser: string;
  isShared: boolean;
  mentions?: string[];
}

export default function TopicDetail() {
  const { topic } = useLocalSearchParams(); // Obtener el tema desde los parámetros de la URL
  const [snaps, setSnaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useContext(AuthContext);

  // Función para obtener la imagen de perfil de un usuario
  const fetchProfileImage = async (username: string) => {
    try {
      const imageRef = storage().ref(`profile_photos/${username}.png`); // Usa @react-native-firebase/storage
      const url = await imageRef.getDownloadURL();
      return url;
    } catch (error) {
      return 'https://via.placeholder.com/150';
    }
  };
useEffect(() => {
  const fetchSnaps = async () => {
    setIsLoading(true);
    try {
      // Ejecutar las llamadas a la API en paralelo
      const [snapsResponse, favouriteResponse, likesResponse] = await Promise.all([
        searchSnapsByHashtag(topic as string),
        getFavouriteSnaps(),
        getLikedSnaps(),
      ]);

      const favouriteSnapIds = favouriteResponse.snaps?.map(favSnap => favSnap.id) || [];
      const likedSnapIds = likesResponse.snaps?.map(likeSnap => likeSnap.id) || [];

      if (snapsResponse.success && snapsResponse.snaps && snapsResponse.snaps.length > 0) {
        const snapsWithDetails: Snap[] = await Promise.all(
          snapsResponse.snaps.map(async (snap: any) => {
            const profileImage = await fetchProfileImage(snap.username);
            return {
              id: snap._id,
              username: snap.username,
              time: snap.time,
              message: snap.message,
              isPrivate: snap.isPrivate === 'true',
              likes: snap.likes || 0,
              likedByUser: likedSnapIds.includes(snap._id),
              canViewLikes: true,
              favouritedByUser: favouriteSnapIds.includes(snap._id),
              profileImage: profileImage,
              retweetUser: snap.retweetUser || '',
              isShared: false,
              mentions: snap.mentions || [],
            };
          })
        );

        setSnaps(snapsWithDetails);
      } else {
        setSnaps([]);
      }
    } catch (error) {
      console.error('Error fetching topic snaps:', error);
      setErrorMessage('Ocurrió un error al cargar los snaps.');
    } finally {
      setIsLoading(false);
    }
  };

  fetchSnaps();
}, [topic]);



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

  // Función para manejar el Favorito
  const handleFavourite = async (snapId: string, favouritedByUser: boolean) => {
    setSnaps(prevSnaps =>
      prevSnaps.map(snap => {
        if (snap.id === snapId) {
          return {
            ...snap,
            favouritedByUser: !favouritedByUser,
          };
        }
        return snap;
      })
    );

    const apiResponse = favouritedByUser ? await unfavouriteSnap(snapId) : await favouriteSnap(snapId);

    if (apiResponse.success) {
      Toast.show({
        type: 'success',
        text1: favouritedByUser ? 'Has quitado el favorito' : 'Has marcado como favorito exitosamente',
      });
    } else {
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


  // Función para manejar la compartición/descompartición de un snap
  const handleToggleShare = async (snap: Snap) => {
    if (snap.isShared) {
      // Descompartir el snap
      const result = await unshareSnap(snap.id);
      if (result.success) {
        setSnaps(prevSnaps =>
          prevSnaps.map(s => (s.id === snap.id ? { ...s, isShared: false } : s))
        );
        Toast.show({
          type: 'success',
          text1: 'Snap descompartido exitosamente.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.message || 'No se pudo descompartir el snap.',
        });
      }
    } else {
      // Compartir el snap
      const result = await shareSnap(snap.id);
      if (result.success) {
        setSnaps(prevSnaps =>
          prevSnaps.map(s => (s.id === snap.id ? { ...s, isShared: true } : s))
        );
        Toast.show({
          type: 'success',
          text1: 'Snap compartido exitosamente.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.message || 'No se pudo compartir el snap.',
        });
      }
    }
  };

    // Definir el renderItem utilizando SnapItem
    const renderItemCallback = useCallback(
    ({ item }: { item: Snap }) => (
      <SnapItem
        snap={item}
        onLike={() => handleLike(item.id, item.likedByUser)}
        onFavourite={() => handleFavourite(item.id, item.favouritedByUser)}
        onSnapShare={() => handleToggleShare(item)}
        isOwnProfile={false}
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
          renderItem={renderItemCallback}
          contentContainerStyle={{ paddingBottom: 20 }}
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
