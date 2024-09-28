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
import BackButton from '@/components/backButton';
import styles from '../styles/profileView';
import { getAllSnaps, deleteSnap, updateSnap } from '@/handlers/postHandler';
import { removeToken } from '@/handlers/authTokenHandler';
import EditSnapModal from '@/components/editSnapModal'; // Asegúrate de que la ruta sea correcta
import SnapItem from '@/components/snapItem'; // Asegúrate de que la ruta sea correcta

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
  const { username } = useLocalSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const isOwnProfile = !username;

  // Estados para el modal de edición
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSnap, setSelectedSnap] = useState<Snap | null>(null);

  // Otros estados relacionados con el seguimiento
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isFollowedBy, setIsFollowedBy] = useState(false); // Seguimiento mutuo

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

        if (!isOwnProfile) {
          // Aquí puedes agregar lógica real para verificar si estás siguiendo al usuario
          setIsFollowing(false); // Simulación
          setIsFollowedBy(true); // Simulación de seguimiento mutuo
        }

        const snapResponse = await getAllSnaps();

        if (snapResponse.success && snapResponse.snaps && snapResponse.snaps.length > 0) {
          const snaps: Snap[] = snapResponse.snaps.map((snap: any) => ({
            id: snap._id,
            username: snap.username,
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

  const handleFollow = async () => {
    if (isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      // Simulación de la acción de seguir
      const response = { success: true }; // Simular éxito

      if (response.success) {
        setIsFollowing(true);
        Alert.alert('Éxito', 'Has seguido al usuario exitosamente.');
        // Actualizar el conteo de seguidores
        setProfile((prev: any) => ({
          ...prev,
          followers_count: prev.followers_count + 1,
        }));
      } else {
        Alert.alert('Error', 'No se pudo seguir al usuario.');
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
      // Simulación de la acción de dejar de seguir
      const response = { success: true }; // Simular éxito

      if (response.success) {
        setIsFollowing(false);
        Alert.alert('Éxito', 'Has dejado de seguir al usuario.');
        // Actualizar el conteo de seguidores
        setProfile((prev: any) => ({
          ...prev,
          followers_count: prev.followers_count - 1,
        }));
      } else {
        Alert.alert('Error', 'No se pudo dejar de seguir al usuario.');
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
      const result = await updateSnap(
        snapId, 
        message,
        isPrivate.toString()
      );

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
        <BackButton />
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
        <Pressable onPress={() => router.push('./followers')} style={styles.followSection}>
          <Text style={styles.followNumber}>{profile.followers_count || 0}</Text>
          <Text style={styles.followLabel}>Seguidores</Text>
        </Pressable>
        <Pressable onPress={() => router.push('./following')} style={styles.followSection}>
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
        <Text style={styles.errorText}>No se encontró el perfil.</Text>
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
