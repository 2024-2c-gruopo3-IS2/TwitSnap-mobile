// SnapItem.tsx

import React from 'react';
import { View, Text, Pressable, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/snapItem';
import { useRouter } from 'expo-router';

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

interface SnapItemProps {
  snap: Snap;
  onLike: () => void;
  onFavourite: () => void;
  onEdit?: (snap: Snap) => void;
  onDelete?: (id: string) => void;
  onSnapShare: () => void;
  isOwnProfile?: boolean;
  likeIconColor: string;
  favouriteIconColor: string;
}

const SnapItem: React.FC<SnapItemProps> = ({
  snap,
  onLike,
  onFavourite,
  onEdit,
  onDelete,
  onSnapShare,
  isOwnProfile,
  likeIconColor,
  favouriteIconColor,
}) => {
  const router = useRouter();

  // Función para renderizar el mensaje con menciones resaltadas y presionables
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
    <Pressable onPress={() => router.push(`/profileView?username=${snap.username}`)}>
      <Text style={styles.username}>@{snap.username}</Text>
    </Pressable>
  );

  return (
    <View style={styles.snapContainer}>
      {/* Mostrar "retweet" si el Snap fue compartido */}
      {snap.retweetUser && (
        <Text style={styles.retweetText}>
          @{snap.retweetUser} ha compartido
        </Text>
      )}
      {/* Cabecera del Snap */}
      <View style={styles.snapHeader}>
        <Image
          source={{ uri: snap.profileImage }}
          style={styles.profileImageOnFeed}
        />
        {renderUsername()}
      </View>

      {/* Contenido del Snap con Menciones Resaltadas */}
      <Text style={styles.content}>{renderMessage(snap.message)}</Text>

      {/* Botones de Acción: Editar y Eliminar en la parte superior derecha */}
      {isOwnProfile && (
        <View style={styles.actionButtonsTopRight}>
          <Pressable onPress={() => onEdit && onEdit(snap)} style={styles.editButton}>
            <Icon name="edit" size={20} color="#fff" />
          </Pressable>
          <Pressable onPress={() => onDelete && onDelete(snap.id)} style={styles.deleteButton}>
            <Icon name="delete" size={20} color="#fff" />
          </Pressable>
        </View>
      )}

      {/* Botones de "Favorito", "Me Gusta" y "Compartir" */}
      <View style={styles.actionContainer}>
        {/* Botón de "Favorito" */}
        <View style={styles.favouriteContainer}>
          <Pressable onPress={onFavourite} style={styles.favouriteButton}>
            <Icon
              name={snap.favouritedByUser ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={favouriteIconColor}
            />
          </Pressable>
        </View>

        {/* Botón de "Me Gusta" */}
        <View style={styles.likeContainer}>
          <Pressable onPress={onLike} style={styles.likeButton}>
            <Icon
              name={snap.likedByUser ? 'favorite' : 'favorite-border'}
              size={24}
              color={likeIconColor}
            />
          </Pressable>
          {snap.canViewLikes && <Text style={styles.likeCount}>{snap.likes}</Text>}
        </View>

        {/* Botón de "Compartir" */}
        <View style={styles.snapShareContainer}>
          <Pressable onPress={onSnapShare} style={styles.snapShareButton}>
            <Icon name="repeat" size={24} color={snap.isShared ? 'green' : 'gray'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SnapItem;
