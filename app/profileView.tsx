// ProfileView.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProfile, getUserProfile } from '@/handlers/profileHandler';
import { followUser, unfollowUser, getFollowers, getFollowed } from '@/handlers/followHandler';
import BackButton from '@/components/backButton';
import styles from '../styles/profileView';
import { getAllSnaps, deleteSnap, updateSnap, getSnaps, getSnapsByUsername } from '@/handlers/postHandler';
import { removeToken } from '@/handlers/authTokenHandler';
import EditSnapModal from '@/components/editSnapModal'; // Asegúrate de que la ruta sea correcta
import SnapItem from '@/components/snapItem'; // Asegúrate de que la ruta sea correcta
import Footer from '../components/footer';
import { useSegments } from 'expo-router'; // Importa `useSegments`

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

export default function ProfileView() {
  const router = useRouter();
  const segments = useSegments();
  const { username } = useLocalSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const isOwnProfile = !username;

  // Estados para el modal de edición
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSnap, setSelectedSnap] = useState<Snap | null>(null);

  // Estados relacionados con el seguimiento
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isFollowedBy, setIsFollowedBy] = useState(false); // Seguimiento mutuo

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


  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      let response;
      if (isOwnProfile) {
        response = await getProfile();
      } else {
        response = await getUserProfile(username as string);
      }

      if (response.success) {
        setProfile(response.profile);

        // Si no es nuestro propio perfil, verificamos si seguimos al usuario
        if (!isOwnProfile) {
          // Obtener el nombre de usuario actual
          const currentUserResponse = await getProfile();
          if (currentUserResponse.success) {
            const currentUsername = currentUserResponse.profile.username;

            // Obtener la lista de usuarios que seguimos
            const followedResponse = await getFollowed(currentUsername);
            if (followedResponse.success) {
              const followedUsernames = followedResponse.followed || []; // Lista de nombres de usuario que seguimos

              // Verificar si seguimos al usuario del perfil
              setIsFollowing(followedUsernames.includes(response.profile.username));
            } else {
              console.error('Error al obtener los usuarios que sigues:', followedResponse.message);
            }
          } else {
            console.error('Error al obtener el perfil del usuario actual:', currentUserResponse.message);
          }
        }

        const snapResponse = await getSnapsByUsername(response.profile.username);

        if (snapResponse.success && snapResponse.snaps && snapResponse.snaps.length > 0) {
          const snaps: Snap[] = snapResponse.snaps.map((snap: any) => ({
            id: snap._id,
            username: snap.email,
            time: snap.time,
            message: snap.message,
            isPrivate: snap.isPrivate === 'true',
            likes: snap.likes || 0,
            likedByUser: snap.likedByUser || false,
            canViewLikes: isFollowedBy || !snap.isPrivate,
          }));
          setSnaps(snaps);
        }
      } else {
        Alert.alert('Error', response.message || 'No se pudo obtener el perfil.');
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [username, isOwnProfile, isFollowedBy]);

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
        Alert.alert('Éxito', 'Has seguido al usuario exitosamente.');

        // Volver a cargar el perfil para obtener los seguidores actualizados
        await reloadProfile();
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
        Alert.alert('Éxito', 'Has dejado de seguir al usuario.');

        // Volver a cargar el perfil para obtener los seguidores actualizados
        await reloadProfile();
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
              await removeToken();
              router.replace('/login');
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
            const result = await deleteSnap(snapId as unknown as number);
            if (result.success) {
              // Actualizar la lista de snaps
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

  // Función para renderizar el encabezado de la lista
  const renderHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        <BackButton onPress={handleBackPress} />
        <View style={styles.rightSpace} />
      </View>

      <Image
        source={{ uri: profile.cover_photo || 'https://via.placeholder.com/800x200' }}
        style={styles.coverPhoto}
      />

      <View style={styles.profilePictureContainer}>
        <Image
          source={{ uri: profile.profile_picture || 'https://via.placeholder.com/150' }}
          style={styles.profilePicture}
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
          <Text style={styles.followNumber}>{profile.followers_count || 0}</Text>
          <Text style={styles.followLabel}>Seguidores</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push(`/following?username=${encodeURIComponent(profile.username)}`)
          }
          style={styles.followSection}
        >
          <Text style={styles.followNumber}>{profile.following_count || 0}</Text>
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
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
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
        onLike={handleLike}
        onEdit={isOwnProfile ? handleEditSnap : undefined}
        onDelete={isOwnProfile ? handleDeleteSnap : undefined}
        isOwnProfile={isOwnProfile}
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
