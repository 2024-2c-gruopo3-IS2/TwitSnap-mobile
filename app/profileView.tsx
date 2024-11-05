// ProfileView.tsx
import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProfile, getUserProfile } from '@/handlers/profileHandler';
import { followUser, unfollowUser, getFollowers, getFollowed } from '@/handlers/followHandler';
import BackButton from '@/components/backButton';
import styles from '../styles/profileView';
import {
  deleteSnap,
  updateSnap,
  getSnapsByUsername,
  getFavouriteSnaps,
  favouriteSnap,
  unfavouriteSnap,
  likeSnap,
  unlikeSnap,
  getLikedSnaps
} from '@/handlers/postHandler';
import { Avatar } from 'react-native-elements';
import { removeToken } from '@/handlers/authTokenHandler';
import EditSnapModal from '@/components/editSnapModal';
import SnapItem from '@/components/snapItem';
import Footer from '../components/footer';
import { useSegments } from 'expo-router';
import Toast from 'react-native-toast-message';
import {AuthContext} from '@/context/authContext';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebaseConfig';
import {shareSnap, getSharedSnaps} from '@/handlers/postHandler';

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
  retweetUser: string; //si esta vacio es un tweet normal, sino es un retweet
  isShared: boolean;
}

export default function ProfileView() {
  const router = useRouter();
  const segments = useSegments();
  const { username } = useLocalSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const isOwnProfile = !username;
  const [isFavouriteView, setIsFavouriteView] = useState(false);
  const { user, logout } = useContext(AuthContext);

  // Nuevas variables de estado para los contadores
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  // Estados para el modal de edición
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSnap, setSelectedSnap] = useState<Snap | null>(null);
  // Estados relacionados con el seguimiento
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isFollowedBy, setIsFollowedBy] = useState(false); // Seguimiento mutuo
  const [loadingImage, setLoadingImage] = useState(false);

  // Función para manejar la navegación al presionar el botón "Volver"
  const handleBackPress = () => {
    const previousPage = segments[segments.length - 2]; // Obtener la página anterior

    // Si la página anterior es "followers" o "following", redirigir al feed
    if (previousPage === 'followers' || previousPage === 'following') {
      router.replace('/feed'); // Redirige al feed u otra ruta principal
    } else {
      router.back(); // Si no, vuelve a la página anterior normalmente
    }
  };

  const fetchProfileImage = async (username: string) => {
    try {
      const imageRef = await ref(storage, `profile_photos/${username}.png`);
      const url = await getDownloadURL(imageRef);

      return url;
    } catch (error) {
      return 'https://via.placeholder.com/150';
    }
  };

    // Función para obtener los snaps compartidos por el usuario
    const fetchSharedSnaps = async () => {
      const response = await getSharedSnaps();
      if (response.success && response.snaps) {
        // Extraer los IDs de los snaps compartidos
        const sharedSnapIds = new Set(response.snaps.map((snap) => snap.id));

        // Actualizar el estado de los snaps para marcar los compartidos
        setSnaps((prevSnaps) =>
          prevSnaps.map((snap) => ({
            ...snap,
            isShared: sharedSnapIds.has(snap.id),
          }))
        );
      }
    };

  const handleChangeProfilePhoto = async () => {
    if (!isOwnProfile) {
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      const localFilePath = result.assets[0].uri;
      
      if (!profile.username) {
        console.error('No logged in user or user email found');
        return;
      }

      const storageRef = ref(storage, `profile_photos/${profile.username}.png`);
      const response = await fetch(localFilePath);
      const blob = await response.blob();

      setLoadingImage(true);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setProfileImage(downloadURL);
      const updatedSnaps = snaps.map(snap => {
        return {
          ...snap,
          profileImage: downloadURL,
        };
      });
      setSnaps(updatedSnaps);
      setLoadingImage(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoadingImage(false);
      Alert.alert('Error', 'There was an error uploading your profile image. Please try again.');
    }
  };

  useEffect(() => {
      fetchProfile();
      },[username,isOwnProfile]);


    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // 1. Obtener el perfil (propio o de otro usuario)
        const profileResponse = isOwnProfile ? await getProfile() : await getUserProfile(username as string);

        if (profileResponse.success) {
          setProfile(profileResponse.profile);
          const profileImage = await fetchProfileImage(profileResponse.profile.username);
          
          setProfileImage(profileImage);

          // 2. Preparar promesas para obtener estado de seguimiento, seguidores y seguidos
          let isFollowingPromise: Promise<boolean> = Promise.resolve(false);
          if (!isOwnProfile) {
            isFollowingPromise = (async () => {
              const currentProfile = await getProfile();
              if (currentProfile.success) {
                const followed = await getFollowed(currentProfile.profile.username);
                if (followed.success) {
                  return (followed.followed ?? []).includes(profileResponse.profile.username);
                }
              }
              return false;
            })();
          }

          // 3. Obtener seguidores y seguidos del perfil actual
          const followersPromise = getFollowers(profileResponse.profile.username);
          const followingPromise = getFollowed(profileResponse.profile.username);
          console.log("followersPromise: ", followersPromise);
            console.log("followingPromise: ", followingPromise);

          // 4. Ejecutar todas las promesas en paralelo
          const [isFollowingResult, followersResponse, followingResponse, snapResponse, likesResponse, favouriteResponse, sharedResponse] = await Promise.all([
            isFollowingPromise,
            followersPromise,
            followingPromise,
            getSnapsByUsername(profileResponse.profile.username),
            getLikedSnaps(),
            getFavouriteSnaps(),
            getSharedSnaps(),
          ]);
            // Verificar si la respuesta de los snaps compartidos es exitosa y obtener los IDs de los snaps compartidos
            const sharedSnapIds = sharedResponse.success ? new Set(sharedResponse.snaps?.map((snap) => snap.id)) : new Set();

            console.log("followers: ", followersResponse);
            console.log("following: ", followingResponse);

          // 5. Actualizar estado de seguimiento
          if (!isOwnProfile) {
            setIsFollowing(isFollowingResult);
          }

          // 6. Actualizar contadores de seguidores y seguidos
          if (followersResponse.success) {
            setFollowersCount((followersResponse.followers ?? []).length);
          } else {
            // console.error('Error al obtener los seguidores:', followersResponse.message);
            // Alert.alert('El perfil es privado.');
            setFollowersCount('X'); // Valor por defecto en caso de error
            // Mostrar un Toast si los seguidores no son accesibles (perfil privado)
            Toast.show({
              type: 'info',
              text1: 'Privacidad',
              text2: 'Este perfil es privado.',
              visibilityTime: 4000, // Tiempo de visualización (4 segundos)
            });
          }

          if (followingResponse.success) {
            setFollowingCount((followingResponse.followed ?? []).length);
          } else {
            // console.error('Error al obtener los seguidos:', followingResponse.message);
            setFollowingCount('X'); // Valor por defecto en caso de error
          }
          
          // 7. Procesar snaps si existen
          if (snapResponse.success && snapResponse.snaps && snapResponse.snaps.length > 0) {
            const likedSnapsIds = likesResponse.snaps?.map(snap => snap.id) || [];
            const favouriteSnapsIds = favouriteResponse.snaps?.map(snap => snap.id) || [];
            // Modificar cada snap para agregar información del autor y del retweet
            const processedSnaps: Snap[] = await Promise.all(
              snapResponse.snaps.map(async (snap: any) => {
                  let originalUsername = snap.username;
                let authorProfileImage = await fetchProfileImage(snap.username);

                // Si el snap es un retweet, obtener el perfil original
                if (snap.retweetUser) {
                  originalUsername = snap.username;
                  authorProfileImage = await fetchProfileImage(snap.username);
                }

                return {
                  id: snap._id,
                  username: originalUsername,
                  time: snap.time,
                  message: snap.message,
                  isPrivate: snap.isPrivate === 'true',
                  likes: snap.likes || 0,
                  likedByUser: likedSnapsIds.includes(snap._id),
                  canViewLikes: true,
                  favouritedByUser: favouriteSnapsIds.includes(snap._id),
                  profileImage: authorProfileImage,
                  retweetUser: snap.retweetUser || "",
                  isShared: sharedSnapIds.has(snap._id),
                };
              })
            );
            setSnaps(processedSnaps);
          } else {
            setSnaps([]); // Manejar caso sin snaps
          }
        } else {
          Alert.alert('Error', profileResponse.message || 'No se pudo obtener el perfil.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Ocurrió un error al obtener el perfil.');
      } finally {
        setIsLoading(false);
      }
    };

  // Función para recargar el perfil
  const reloadProfile = async () => {
    try {
      const response = await getUserProfile(profile.username);
      if (response.success) {
        setProfile(response.profile);
      } else {
        console.error('Error al recargar el perfil:', response.message);
      }
    } catch (error) {
      console.error('Error al recargar el perfil:', error);
    }
  };

  const handleFollow = async () => {
    if (isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      const response = await followUser(profile.username);

      if (response.success) {
        setIsFollowing(true);
        setProfile((prev: any) => ({ ...prev, followers_count: (prev.followers_count || 0) + 1 }));
        //setFollowersCount(prev => prev + 1); // Actualizar contador local
        Toast.show({ type: 'success', text1: 'Has seguido al usuario exitosamente.' });
        await fetchProfile(); // Recargar el perfil para actualizar el estado de seguimiento
      } else {
        Alert.alert('Error', response.message || 'No se pudo seguir al usuario.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al seguir al usuario.');
      console.error('Error al seguir al usuario:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      const response = await unfollowUser(profile.username);

      if (response.success) {
        setIsFollowing(false);
        setProfile((prev: any) => ({ ...prev, followers_count: (prev.followers_count || 1) - 1 }));
        //setFollowersCount(prev => (prev > 0 ? prev - 1 : 0)); // Actualizar contador local con mínimo 0
        Toast.show({ type: 'success', text1: 'Has dejado de seguir al usuario.' });
        await fetchProfile(); // Recargar el perfil para actualizar el estado de seguimiento

      } else {
        Alert.alert('Error', response.message || 'No se pudo dejar de seguir al usuario.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al dejar de seguir al usuario.');
      console.error('Error al dejar de seguir al usuario:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleEditSnap = (snap: Snap) => {
    setSelectedSnap(snap);
    setIsEditModalVisible(true);
  };

  const handleUpdateSnap = async (snapId: string, message: string, isPrivate: boolean) => {
    try {
      const result = await updateSnap(snapId, message, isPrivate);

      if (result.success) {
        // Actualizar el snap en la lista
        setSnaps(prevSnaps =>
          prevSnaps.map(snap =>
            snap.id === snapId ? { ...snap, message, isPrivate } : snap
          )
        );
        Alert.alert('Éxito', 'Snap actualizado exitosamente');
        setIsEditModalVisible(false);
        setSelectedSnap(null);
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar el snap.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar el snap.');
      console.error('Error al actualizar el snap:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout(); // Llamar al método logout del contexto
              router.replace('/login'); // Redirigir a la página de login
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión. Inténtalo nuevamente.');
              console.error('Error al cerrar sesión:', error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteSnap = (snapId: string) => {

    Alert.alert(
      'Eliminar Snap',
      '¿Estás seguro de que quieres eliminar este snap?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
              console.log("Snap ID DELETE: " + snapId);
            const result = await deleteSnap(snapId as unknown as number);

            if (result.success) {
              setSnaps(snaps.filter(snap => snap.id !== snapId));
              Alert.alert('Éxito', 'Snap eliminado exitosamente');
            } else {
              Alert.alert('Error', 'No se pudo eliminar el snap.');
            }
          },
        },
      ]
    );
  };

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
  }

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

  // Función para compartir el Snap (Retweet)
  const onSnapShare = async (snap: Snap) => {
    try {
      const result = await shareSnap(snap.id); // Llama al endpoint con el ID del snap

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Snap compartido',
          text2: 'El snap ha sido compartido exitosamente.',
        });

        // Opcional: Puedes actualizar la lista de snaps para reflejar el retweet
        setSnaps((prevSnaps) => [
          { ...snap, retweetUser: profile.username }, // Agrega el retweet en la lista local
          ...prevSnaps,
        ]);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error al compartir',
          text2: result.message || 'Hubo un problema al compartir el snap.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Ocurrió un error al intentar compartir el snap.',
      });
    }
  };





  // Función para renderizar el encabezado de la lista
  const renderHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        <BackButton onPress={handleBackPress} />
        <View style={styles.rightSpace} />
      </View>

      {profile.cover_photo ? (
        <Image
          source={{ uri: profile.cover_photo }}
          style={styles.coverPhoto}
        />
      ) : (
        <View style={[styles.coverPhoto, { backgroundColor: 'black' }]} />
      )}

    <View style={styles.profilePictureContainer}>
      <Avatar
          rounded
          size="xlarge"
          source={{ uri: profileImage }}
          containerStyle={styles.profilePicture}
          onPress={handleChangeProfilePhoto}
        />
    </View>
    

      <Text style={styles.name}>
        {profile.name} {profile.surname}
      </Text>
      <Text style={styles.username}>@{profile.username}</Text>

      {/* Descripción del usuario */}
      {profile.description && (
        <Text style={styles.description}>
          {profile.description}
        </Text>
      )}

      <View style={styles.followContainer}>
        <Pressable
          onPress={() =>
            router.push(`/followers?username=${encodeURIComponent(profile.username)}`)
          }
          style={styles.followSection}
        >
          <Text style={styles.followNumber}>{followersCount}</Text>
          <Text style={styles.followLabel}>Seguidores</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push(`/following?username=${encodeURIComponent(profile.username)}`)
          }
          style={styles.followSection}
        >
          <Text style={styles.followNumber}>{followingCount}</Text>
          <Text style={styles.followLabel}>Seguidos</Text>
        </Pressable>
      </View>

      {!isOwnProfile && (
        <Pressable
          style={[
            styles.followButton,
            isFollowing ? styles.unfollowButton : styles.followButtonStyle,
          ]}
          onPress={isFollowing ? handleUnfollow : handleFollow}
          disabled={isFollowLoading}
        >
          {isFollowLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.followButtonText}>
              {isFollowing ? 'Dejar de Seguir' : 'Seguir'}
            </Text>
          )}
        </Pressable>
      )}

      {isOwnProfile && (
        <View style={styles.profileActionsContainer}>
          <Pressable style={styles.editProfileButton} onPress={() => router.push('/profileEdit')}>
            <Icon name="edit" size={24} color="#fff" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </Pressable>
          {/* Nuevo Botón: Snaps Favoritos */}
          <Pressable style={styles.favouriteSnapsButton} onPress={() => router.push('/favouriteSnapsView')}>
            <Icon name="bookmark" size={24} color="#fff" />
            <Text style={styles.favouriteSnapsButtonText}>Fav Snaps</Text>
          </Pressable>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.snapTitle}>Snaps</Text>
    </View>
  );

  const renderItemCallback = useCallback(
    ({ item }: { item: Snap }) => (
      <SnapItem
        snap={item}
        onLike={() => handleLike(item.id, item.likedByUser)}
        onFavourite={() => handleFavourite(item.id, item.favouritedByUser)}
        onEdit={isOwnProfile ? handleEditSnap : undefined}
        onDelete={isOwnProfile ? handleDeleteSnap : undefined}
        onSnapShare={() => handleToggleShare(item)}
        isOwnProfile={isOwnProfile}
        likeIconColor={item.likedByUser ? 'red' : 'gray'}
        favouriteIconColor={item.favouritedByUser ? 'yellow' : 'gray'}

      />
    ),
    [isOwnProfile]
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorTextLarge}>No se encontró el perfil.</Text>
          <Text style={styles.errorTextLarge}>Intenta nuevamente o revisa tu conexión.</Text>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </Pressable>
        </View>
        <View>
          <Footer />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={snaps}
        keyExtractor={(item) => item.id}
        renderItem={renderItemCallback}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.snapsList}
      />

      {/* Modal de Edición de Snap */}
      <EditSnapModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedSnap(null);
        }}
        snap={
          selectedSnap
            ? {
                id: selectedSnap.id,
                username: selectedSnap.username,
                time: selectedSnap.time,
                message: selectedSnap.message,
                isPrivate: selectedSnap.isPrivate,
              }
            : null
        }
        onSubmit={handleUpdateSnap}
      />
    </View>
  );
}
