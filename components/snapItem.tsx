// components/SnapItem.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/snapItem';
import { useRouter } from 'expo-router';
import {
  likeSnap,
  unlikeSnap,
  favouriteSnap,
  unfavouriteSnap,
  shareSnap
} from '@/handlers/postHandler';
import { sendShareNotification } from '@/handlers/notificationHandler';
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
  profileImage: string;
  retweetUser: string;
  isShared: boolean;
  originalUsername?: string;
  mentions?: string[];
}

interface SnapItemProps {
  snap: Snap;
  isOwnProfile?: boolean;
  onEdit?: (snap: Snap) => void; // Propiedad onEdit opcional
  onDelete?: (id: string) => void; // Propiedad onDelete opcional
  onShare?: () => void; // Propiedad onShare opcional
  currentUsername?: string; // Username del usuario actual
  isOwned?: boolean; // Indica si el snap es del usuario actual
}

const SnapItem: React.FC<SnapItemProps> = ({
  snap,
  isOwnProfile,
  onEdit,
  onDelete,
  onShare,
  currentUsername,
  isOwned = false,
}) => {
  const router = useRouter();
  const [snapData, setSnapData] = useState(snap);

  // Define colores para los íconos cuando están activos
  const activeLikeColor = 'red';
  const activeFavouriteColor = 'yellow';
  const activeShareColor = 'green';

  // Función para manejar "Me gusta"
  const handleLike = async () => {
    const updatedLikeStatus = !snapData.likedByUser;
    const updatedLikes = updatedLikeStatus ? snapData.likes + 1 : snapData.likes - 1;
    setSnapData({ ...snapData, likedByUser: updatedLikeStatus, likes: updatedLikes });

    const apiResponse = updatedLikeStatus ? await likeSnap(snapData.id) : await unlikeSnap(snapData.id);

    if (!apiResponse.success) {
      setSnapData({ ...snapData, likedByUser: !updatedLikeStatus, likes: snapData.likes });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Hubo un problema al procesar tu solicitud.',
      });
    }
  };

  // Función para manejar "Favorito"
  const handleFavourite = async () => {
    const updatedFavouriteStatus = !snapData.favouritedByUser;
    setSnapData({ ...snapData, favouritedByUser: updatedFavouriteStatus });

    const apiResponse = updatedFavouriteStatus
      ? await favouriteSnap(snapData.id)
      : await unfavouriteSnap(snapData.id);

    if (!apiResponse.success) {
      setSnapData({ ...snapData, favouritedByUser: !updatedFavouriteStatus });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Hubo un problema al procesar tu solicitud.',
      });
    } else {
      // Si se desmarca como favorito, notificar al padre
      if (!updatedFavouriteStatus && onDelete) {
        onDelete(snapData.id);
      }
    }
  };

  // Función para manejar el SnapShare y enviar la notificación
  const handleSnapShare = async () => {
    if (snapData.isShared) return; // Evita duplicar el compartido

    const result = await shareSnap(snapData.id);

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Snap compartido',
        text2: 'El snap ha sido compartido exitosamente.',
      });

      // Actualizar el Snap como compartido
      setSnapData({
        ...snapData,
        isShared: true,
        originalUsername: snapData.username,
        username: currentUsername || '',
      });

      // Notificar al padre que el snap ha sido compartido
      if (onShare) {
        onShare();
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error al compartir',
        text2: 'Hubo un problema al compartir el snap.',
      });
    }
  };

  // Función para renderizar el mensaje con menciones resaltadas
  const renderMessage = (message: string) => {
    const parts = message.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const username = part.slice(1);
        return (
          <Text
            key={index}
            style={styles.mentionText}
            onPress={() => router.push(`/profileView?username=${username}`)}
          >
            {part}
          </Text>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  // Función para renderizar el nombre de usuario del autor presionable
  const renderUsername = () => (
    <Pressable onPress={() => router.push(`/profileView?username=${snapData.username}`)}>
      <Text style={styles.username}>@{snapData.username}</Text>
    </Pressable>
  );

  // Función para renderizar el texto de compartición
  const renderSharedText = () => {
    if (!isOwned && snapData.isShared && snapData.originalUsername) {
      return (
        <Text style={styles.sharedText}>
          @{snapData.originalUsername} ha compartido
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.snapContainer}>
      {/* Mostrar texto de compartición si el Snap fue compartido y no es propio */}
      {renderSharedText()}

      {/* Cabecera del Snap */}
      <View style={styles.snapHeader}>
        <Image source={{ uri: snapData.profileImage }} style={styles.profileImageOnFeed} />
        {renderUsername()}
      </View>

      {/* Contenido del Snap con Menciones Resaltadas */}
      <Text style={styles.content}>{renderMessage(snapData.message)}</Text>

      {/* Botones de Acción: Editar y Eliminar (solo si es propio) */}
      {isOwned && (
        <View style={styles.actionButtonsTopRight}>
          <Pressable onPress={() => onEdit && onEdit(snapData)} style={styles.editButton}>
            <Icon name="edit" size={20} color="#fff" />
          </Pressable>
          <Pressable onPress={() => onDelete && onDelete(snapData.id)} style={styles.deleteButton}>
            <Icon name="delete" size={20} color="#fff" />
          </Pressable>
        </View>
      )}

      {/* Botones de "Favorito", "Me Gusta" y "Compartir" */}
      <View style={styles.actionContainer}>
        {/* Botón de "Favorito" */}
        <View style={styles.favouriteContainer}>
          <Pressable onPress={handleFavourite} style={styles.favouriteButton}>
            <Icon
              name={snapData.favouritedByUser ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={snapData.favouritedByUser ? activeFavouriteColor : 'gray'}
            />
          </Pressable>
        </View>

        {/* Botón de "Me Gusta" */}
        <View style={styles.likeContainer}>
          <Pressable onPress={handleLike} style={styles.likeButton}>
            <Icon
              name={snapData.likedByUser ? 'favorite' : 'favorite-border'}
              size={24}
              color={snapData.likedByUser ? activeLikeColor : 'gray'}
            />
          </Pressable>
          {snapData.canViewLikes && <Text style={styles.likeCount}>{snapData.likes}</Text>}
        </View>

        {/* Botón de "Compartir" */}
        <View style={styles.snapShareContainer}>
          <Pressable
            onPress={handleSnapShare}
            style={styles.snapShareButton}
            disabled={snapData.isShared}
          >
            <Icon name="repeat" size={24} color={snapData.isShared ? activeShareColor : 'gray'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SnapItem;
