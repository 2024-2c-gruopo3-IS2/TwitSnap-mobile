// SnapItem.tsx
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
import Toast from 'react-native-toast-message';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

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
  mentions?: string[];
  sharedByUser?: string;
}

interface SnapItemProps {
  snap: Snap;
  isOwnProfile?: boolean;
  onEdit?: (snap: Snap) => void;
  onDelete?: (id: string) => void;
  onShare?: (sharedSnap: Snap) => void; // Actualizado para recibir sharedSnap
  currentUsername?: string;
  isOwned?: boolean;
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
  const [snapData, setSnapData] = useState<Snap>(snap);

  const activeLikeColor = 'red';
  const activeFavouriteColor = 'yellow';
  const activeShareColor = 'green';

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
      if (!updatedFavouriteStatus && onDelete) {
        onDelete(snapData.id);
      }
    }
  };

  const handleSnapShare = async () => {
    if (snapData.sharedByUser) return; // Evita duplicar el compartido

    const updatedSharedStauts = !snapData.sharedByUser;
    setSnapData({ ...snapData, sharedByUser: updatedSharedStauts });

    const result = await shareSnap(snapData.id);
    if (result.success && result.sharedSnap) {
      Toast.show({
        type: 'success',
        text1: 'Snap compartido',
        text2: 'El snap ha sido compartido exitosamente.',
      });

      const sharedSnap: Snap = {
        ...result.sharedSnap,
        id:  snapData.id, // Crear un ID único para el compartido
        retweetUser: currentUsername || '',
        originalUsername: snapData.username, // Autor original
        profileImage: snapData.profileImage, // Mantener la misma imagen de perfil
      };

        if (onShare) {
                onShare(sharedSnap);
         }

      setSnapData({
        ...snapData,
        retweetUser: currentUsername || '',
        originalUsername: snapData.username,
      });
    } else {
        console.log('Error al compartir el snap:', result.message);
    }
  };

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

  const renderUsername = () => (
    <Pressable
      onPress={() => {
        if (snapData.username !== currentUsername) {
          router.push(`/profileView?username=${snapData.username}`);
        } else {
          console.log("Este es tu propio perfil. No se realiza ninguna acción.");
        }
      }}
    >
      <View style={styles.usernameContainer}>
        <Text style={styles.username}>@{snapData.username}</Text>
        <Text style={styles.timeAgo}>
          {moment(snapData.created_at).fromNow()} {/* Formato como "hace 6h" */}
        </Text>
      </View>
    </Pressable>
  );



  const renderSharedText = () => {
    if (snapData.retweetUser) {
      return (
        <Text style={styles.sharedText}>
          @{snapData.retweetUser} ha compartido el snap
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.snapContainer}>
      {renderSharedText()}

      <View style={styles.snapHeader}>
        <Image source={{ uri: snapData.profileImage }} style={styles.profileImageOnFeed} />
        {renderUsername()}
      </View>

      <Text style={styles.content}>{renderMessage(snapData.message)}</Text>

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

      <View style={styles.actionContainer}>
        <View style={styles.favouriteContainer}>
          <Pressable onPress={handleFavourite} style={styles.favouriteButton}>
            <Icon
              name={snapData.favouritedByUser ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={snapData.favouritedByUser ? activeFavouriteColor : 'gray'}
            />
          </Pressable>
        </View>

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

        <View style={styles.snapShareContainer}>
          <Pressable
            onPress={handleSnapShare}
            style={styles.snapShareButton}
            disabled={!!snapData.retweetUser}
          >
            <Icon name="repeat" size={24} color={snapData.sharedByUser ? activeShareColor : 'gray'} />
          </Pressable>
        </View>
      </View>

      {/* Agrega la fecha de creación aquí */}
      <Text style={styles.snapCreationDate}>
        {moment(snapData.created_at).format('DD MMM YYYY, HH:mm')}
      </Text>
    </View>
  );
};

export default SnapItem;
