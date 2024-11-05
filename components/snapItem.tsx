// snapItem.tsx

import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import {useState} from 'react';
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
}

interface SnapItemProps {
  snap: Snap;
  onLike: (id: string) => void;
  onFavourite: (id: string) => void;
  onEdit?: (snap: Snap) => void;
  onDelete?: (id: string) => void;
   onSnapShare: (snap: Snap) => void;
  isOwnProfile?: boolean;
  likeIconColor: string;
  favouriteIconColor: string;
}

const SnapItem: React.FC<SnapItemProps> = ({ snap, onLike, onFavourite, onEdit, onDelete, onSnapShare, isOwnProfile }) => {
  const router = useRouter();
  const [isShared, setIsShared] = useState(!!snap.retweetUser);

  const handleSnapShare = (snap: Snap) => {
      onSnapShare(snap);
        setIsShared(true);
    };



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
        <Text style={styles.username}>@{snap.username}</Text>
      </View>

      {/* Contenido del Snap */}
      <Text style={styles.content}>{snap.message}</Text>

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

      {/* Botones de "Favorito" y "Me Gusta" */}
      <View style={styles.actionContainer}>
        {/* Botón de "Favorito" centrado */}
        <View style={styles.favouriteContainer}>
          <Pressable onPress={() => onFavourite(snap.id)} style={styles.favouriteButton}>
            <Icon
              name={snap.favouritedByUser ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={snap.favouritedByUser ? 'gold' : 'gray'}  // Dorado para favoritos
            />
          </Pressable>
        </View>

        {/* Botón de "Me Gusta" alineado a la derecha */}
        <View style={styles.likeContainer}>
          <Pressable onPress={() => onLike(snap.id)} style={styles.likeButton}>
            <Icon
              name={snap.likedByUser ? 'favorite' : 'favorite-border'}
              size={24}
              color={snap.likedByUser ? 'red' : 'gray'}
            />
          </Pressable>
          {snap.canViewLikes && <Text style={styles.likeCount}>{snap.likes}</Text>}
        </View>

        {/* Botón de SnapShare */}
        <View style={styles.snapShareContainer}>
          <Pressable onPress={handleSnapShare} style={styles.snapShareButton}>
            <Icon name="repeat" size={24} color={isShared ? 'green' : 'gray'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SnapItem;