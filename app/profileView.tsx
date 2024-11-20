// ProfileView.tsx
import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Pressable,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProfile, getUserProfile } from '@/handlers/profileHandler';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowed,
} from '@/handlers/followHandler';
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
  getLikedSnaps,
  shareSnap,
  getSharedSnaps,
} from '@/handlers/postHandler';
import { Avatar } from 'react-native-elements';
import EditSnapModal from '@/components/editSnapModal';
import SnapItem from '@/components/snapItem';
import Footer from '../components/footer';
import { useSegments } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthContext } from '@/context/authContext';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebaseConfig';
import { followUserNotify } from '@/handlers/notificationHandler';

interface Snap {
  id: string;
  type: 'shared' | 'original'; // New property to indicate snap type
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
  originalUsername?: string;
}

export default function ProfileView() {
  const router = useRouter();
  const segments = useSegments();
  const { username } = useLocalSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string>('https://via.placeholder.com/150');
  const [isLoading, setIsLoading] = useState(true);
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const { user, logout } = useContext(AuthContext);
  const currentUsername = user?.username || '';
  const isOwnProfile = !username;
  const [isCertified, setIsCertified] = useState<boolean>(false);


  // Variables de estado para los contadores
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  // Estado para verificar si hay seguimiento mutuo
  const [isMutuallyFollowing, setIsMutuallyFollowing] = useState<boolean>(false);

  // Estados para el modal de edición
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSnap, setSelectedSnap] = useState<Snap | null>(null);

  // Estados relacionados con el seguimiento
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Estados para el menú de estadísticas
  const [isStatisticsMenuVisible, setIsStatisticsMenuVisible] = useState(false);

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

  // Función para obtener la URL de la imagen de perfil
  const fetchProfileImage = async (username: string) => {
    try {
      const imageRef = ref(storage, `profile_photos/${username}.png`);
      return await getDownloadURL(imageRef);
    } catch {
      return 'https://via.placeholder.com/150';
    }
  };

  // Función para cambiar la foto de perfil
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

      setIsLoading(true);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setProfileImage(downloadURL);
      const updatedSnaps = snaps.map((snap) => ({
        ...snap,
        profileImage: downloadURL,
      }));
      setSnaps(updatedSnaps);
      setIsLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Hubo un error al subir tu foto de perfil. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username, isOwnProfile]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      // 1. Obtener el perfil (propio o de otro usuario)
      const profileResponse = isOwnProfile ? await getProfile() : await getUserProfile(username as string);

      if (profileResponse.success) {
        setProfile(profileResponse.profile);
        const profileImageUrl = await fetchProfileImage(profileResponse.profile.username);
        setProfileImage(profileImageUrl);
        setIsCertified(profileResponse.profile.isVerified);

        // 2. Preparar promesas para obtener estado de seguimiento, seguidores y seguidos
        let isFollowingPromise: Promise<boolean> = Promise.resolve(false);
        let isFollowedByProfileUserPromise: Promise<boolean> = Promise.resolve(false);

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

          // Check if profile's user is following the current user
          isFollowedByProfileUserPromise = (async () => {
            const followedByProfile = await getFollowed(profileResponse.profile.username);
            if (followedByProfile.success) {
              return (followedByProfile.followed ?? []).includes(currentUsername);
            }
            return false;
          })();
        }

        // 3. Obtener seguidores y seguidos del perfil actual
        const followersPromise = getFollowers(profileResponse.profile.username);
        const followingPromise = getFollowed(profileResponse.profile.username);

        // 4. Obtener Snaps y Compartidos
        const snapResponse = await getSnapsByUsername(profileResponse.profile.username);
        const sharedResponse = await getSharedSnaps(profileResponse.profile.username);
        const likesResponse = await getLikedSnaps();
        const favouriteResponse = await getFavouriteSnaps();

        const likedSnapsIds = likesResponse.snaps?.map((snap) => snap.id) || [];
        const favouriteSnapsIds = favouriteResponse.snaps?.map((snap) => snap.id) || [];

        // 5. Actualizar estado de seguimiento
        const [isFollowingResult, isFollowedByProfileUserResult] = await Promise.all([
          isFollowingPromise,
          isFollowedByProfileUserPromise,
        ]);

        if (!isOwnProfile) {
          setIsFollowing(isFollowingResult);
          setIsMutuallyFollowing(isFollowingResult && isFollowedByProfileUserResult);
        } else {
          setIsMutuallyFollowing(true); // Own profile implies mutual following
        }

        // 6. Actualizar contadores de seguidores y seguidos
        const followersResult = await followersPromise;
        if (followersResult.success) {
          setFollowersCount((followersResult.followers ?? []).length);
        } else {
          setFollowersCount(0); // Valor por defecto en caso de error
          if (!isMutuallyFollowing && !isOwnProfile) {
            // Only show privacy toast if not mutual and not own profile
            Toast.show({
              type: 'info',
              text1: 'Privacidad',
              text2: 'Este perfil es privado.',
              visibilityTime: 4000, // Tiempo de visualización (4 segundos)
            });
          }
        }

        const followingResult = await followingPromise;
        if (followingResult.success) {
          setFollowingCount((followingResult.followed ?? []).length);
        } else {
          setFollowingCount(0); // Valor por defecto en caso de error
        }

        // 7. Procesar snaps originales si existen
        let processedSnaps: Snap[] = [];
        if (snapResponse.success && snapResponse.snaps && snapResponse.snaps.length > 0) {
          processedSnaps = await Promise.all(
            snapResponse.snaps.map(async (snap: any) => ({
              id: snap._id ? `original-${snap._id}` : `original-${Math.random()}`, // Asegura un id único
              type: 'original',
              username: snap.username, // Autor original
              time: snap.time,
              message: snap.message,
              isPrivate: snap.is_private === 'true',
              likes: snap.likes || 0,
              likedByUser: likedSnapsIds.includes(snap._id),
              canViewLikes: true,
              favouritedByUser: favouriteSnapsIds.includes(snap._id),
              retweetUser: snap.retweet_user || '',
              profileImage: await fetchProfileImage(snap.username),
              originalUsername: snap.original_username || undefined,
            }))
          );
        }

        // 8. Procesar snaps compartidos si existen
        let sharedSnaps: Snap[] = [];
        if (sharedResponse.success && sharedResponse.snaps && sharedResponse.snaps.length > 0) {
          sharedSnaps = await Promise.all(
            sharedResponse.snaps.map(async (snap: any) => ({
              id: snap._id ? `shared-${snap._id}-${Date.now()}` : `shared-${Math.random()}`, // Asegura un id único
              type: 'shared',
              username: snap.username, // Autor original
              time: snap.time,
              message: snap.message,
              isPrivate: snap.is_private === 'true',
              likes: snap.likes || 0,
              likedByUser: likedSnapsIds.includes(snap._id),
              canViewLikes: true,
              favouritedByUser: favouriteSnapsIds.includes(snap._id),
              retweetUser: snap.retweet_user || '', // Usuario que compartió
              profileImage: await fetchProfileImage(snap.username),
              originalUsername: undefined, // Ya tiene retweetUser
            }))
          );
        }

        const allSnaps = [...sharedSnaps, ...processedSnaps];
        const uniqueSnaps = Array.from(new Map(allSnaps.map((snap) => [snap.id, snap])).values());
        // Actualiza el estado de snaps con elementos únicos
        setSnaps(uniqueSnaps);
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

  // Función para manejar la compartición de un snap desde SnapItem
  const handleShareSnap = useCallback(
    (sharedSnap: Snap) => {
      setSnaps((prevSnaps) => [sharedSnap, ...prevSnaps]);

      // Enviar notificación al autor original si es diferente al actual
      if (sharedSnap.username && sharedSnap.username !== currentUsername) {
        sendShareNotification(sharedSnap.username, currentUsername, sharedSnap.id);
      }

      Toast.show({
        type: 'success',
        text1: 'Snap compartido',
        text2: 'El snap ha sido compartido exitosamente.',
      });
    },
    [currentUsername]
  );

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

  // Función para manejar seguir al usuario
  const handleFollow = async () => {
    if (isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      const response = await followUser(profile.username);

      if (response.success) {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        Toast.show({ type: 'success', text1: 'Has seguido al usuario exitosamente.' });
        await fetchProfile(); // Recargar el perfil para actualizar el estado de seguimiento
        await followUserNotify(profile.username, user.username);
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

  // Función para manejar dejar de seguir al usuario
  const handleUnfollow = async () => {
    if (isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      const response = await unfollowUser(profile.username);

      if (response.success) {
        setIsFollowing(false);
        setFollowersCount((prev) => (prev > 0 ? prev - 1 : 0));
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

  // Función para enviar un mensaje
  const handleSendMessage = () => {
    // Navega a la pantalla de chat con el usuario actual
    router.push(`/chat?with=${encodeURIComponent(profile.username)}`);
  };

  // Función para cerrar sesión
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

  // Función para manejar la edición de un snap
  const handleEditSnap = (snap: Snap) => {
    setSelectedSnap(snap);
    setIsEditModalVisible(true);
  };

  // Función para manejar la actualización de un snap después de editarlo
  const handleUpdateSnap = async (snapId: string, message: string, isPrivate: boolean) => {
    try {
      const result = await updateSnap(snapId, message, isPrivate);

      if (result.success) {
        // Actualizar el snap en la lista usando una actualización funcional
        setSnaps((prevSnaps) =>
          prevSnaps.map((snap) => (snap.id === snapId ? { ...snap, message, isPrivate } : snap))
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

  // Función para manejar la eliminación de un snap
  const handleDeleteSnap = async (snapId: string) => {
    Alert.alert(
      'Eliminar Snap',
      '¿Estás seguro de que quieres eliminar este snap?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            console.log('Snap ID DELETE: ' + snapId);
            const result = await deleteSnap(snapId);

            if (result.success) {
              setSnaps((prevSnaps) => prevSnaps.filter((snap) => snap.id !== snapId));
              Alert.alert('Éxito', 'Snap eliminado exitosamente');
            } else {
              Alert.alert('Error', 'No se pudo eliminar el snap.');
            }
          },
        },
      ]
    );
  };

  // Función para manejar la eliminación de un snap de favoritos desde SnapItem
  const handleUnfavourite = useCallback((snapId: string) => {
    setSnaps((prevSnaps) => prevSnaps.filter((snap) => snap.id !== snapId));
    Toast.show({
      type: 'success',
      text1: 'Snap eliminado de favoritos',
    });
  }, []);

  // Función para manejar la navegación a las estadísticas de la cuenta
  const navigateToAccountStatistics = () => {
    setIsStatisticsMenuVisible(false);
    router.push('/accountStatistics');
  };

  // Función para manejar la navegación a las estadísticas de TwitSnaps
  const navigateToTwitSnapsStatistics = () => {
    setIsStatisticsMenuVisible(false);
    router.push('/twitSnapsStatistics');
  };

  const renderHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        <BackButton onPress={handleBackPress} />
        <View style={styles.rightSpace} />
        {/* Botón de Estadísticas en la esquina superior derecha */}
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.statisticsButton}
            onPress={() => setIsStatisticsMenuVisible(!isStatisticsMenuVisible)}
          >
            <Icon name="bar-chart" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Menú de Estadísticas */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isStatisticsMenuVisible}
        onRequestClose={() => setIsStatisticsMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsStatisticsMenuVisible(false)}
        >
          <View style={styles.modalContent}>
            <Pressable style={styles.menuButton} onPress={navigateToAccountStatistics}>
              <Icon name="account-circle" size={20} color="#fff" />
              <Text style={styles.menuButtonText}>Estadísticas de Cuenta</Text>
            </Pressable>
            <Pressable style={styles.menuButton} onPress={navigateToTwitSnapsStatistics}>
              <Icon name="insert-chart" size={20} color="#fff" />
              <Text style={styles.menuButtonText}>Estadísticas de TwitSnaps</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {profile.cover_photo ? (
        <Image source={{ uri: profile.cover_photo }} style={styles.coverPhoto} />
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


      <View style={styles.usernameContainer}>
        <Text style={styles.username}>@{profile.username}</Text>
        {isCertified && (
          <Icon name="verified" size={16} color="#1DA1F2" style={styles.verifiedIcon} />
        )}
      </View>

      {/* Descripción del usuario */}
      {profile.description && (
        <Text style={styles.description}>{profile.description}</Text>
      )}

      <View style={styles.followContainer}>
        <Pressable
          onPress={() => {
            if (isOwnProfile || isMutuallyFollowing) {
              router.push(`/followers?username=${encodeURIComponent(profile.username)}`);
            }
          }}
          style={styles.followSection}
          disabled={!(isOwnProfile || isMutuallyFollowing)}
        >
          <Text style={styles.followNumber}>
            {isOwnProfile || isMutuallyFollowing ? followersCount : 'X'}
          </Text>
          <Text style={styles.followLabel}>Seguidores</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            if (isOwnProfile || isMutuallyFollowing) {
              router.push(`/following?username=${encodeURIComponent(profile.username)}`);
            }
          }}
          style={styles.followSection}
          disabled={!(isOwnProfile || isMutuallyFollowing)}
        >
          <Text style={styles.followNumber}>
            {isOwnProfile || isMutuallyFollowing ? followingCount : 'X'}
          </Text>
          <Text style={styles.followLabel}>Seguidos</Text>
        </Pressable>
      </View>

      <View style={styles.actionsContainer}>
        {/* Botón de seguir/dejar de seguir */}
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
      </View>

      {!isCertified && (
            <Pressable
              style={styles.certificationButton}
              onPress={() => router.push('/profileCertificationRequest')}
            >
              <Icon name="verified-user" size={24} color="#fff" />
              <Text style={styles.certificationButtonText}>Solicitar Certificado</Text>
            </Pressable>
      )}

      {/* Opciones adicionales solo para el perfil propio */}
      {isOwnProfile && (
        <View style={styles.profileActionsContainer}>
          <Pressable
            style={styles.editProfileButton}
            onPress={() => router.push('/profileEdit')}
          >
            <Icon name="edit" size={24} color="#fff" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </Pressable>
          <Pressable
            style={styles.favouriteSnapsButton}
            onPress={() => router.push('/favouriteSnapsView')}
          >
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
    ({ item }: { item: Snap }) => {
      const isOwned = isOwnProfile && item.username === currentUsername;

      return (
        <SnapItem
          snap={item}
          isOwnProfile={isOwnProfile}
          onEdit={isOwned ? handleEditSnap : undefined} // Solo pasar onEdit si es propio
          onDelete={isOwned ? handleDeleteSnap : undefined} // Solo pasar onDelete si es propio
          onShare={(sharedSnap: Snap) => handleShareSnap(sharedSnap)} // Correcto: pasa el Snap compartido
          currentUsername={isOwnProfile ? currentUsername : ''}
          isOwned={isOwned}
        />
      );
    },
    [isOwnProfile, currentUsername, handleEditSnap, handleDeleteSnap, handleShareSnap]
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
          <Text style={styles.errorTextLarge}>
            Intenta nuevamente o revisa tu conexión.
          </Text>
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
        keyExtractor={(item) => item.id} // Now unique
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
