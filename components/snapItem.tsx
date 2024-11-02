// snapItem.tsx

import React from 'react';
import { View, Text, Pressable } from 'react-native';
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
}

interface SnapItemProps {
  snap: Snap;
  onLike: (id: string) => void;
  onFavourite: (id: string) => void;
  onSnapShare: (snap: Snap) => void; // Nueva función para SnapShare
  isOwnProfile?: boolean;
  likeIconColor: string;
  favouriteIconColor: string;
}

const SnapItem: React.FC<SnapItemProps> = ({
  snap,
  onLike,
  onFavourite,
  onSnapShare,
  isOwnProfile,
}) => {
  const router = useRouter();

  return (
    <View style={styles.snapContainer}>
      <View style={styles.snapHeader}>
        <Text style={styles.username}>@{snap.username}</Text>
        <Text style={styles.time}>{snap.time}</Text>
      </View>

      <Text style={styles.content}>{snap.message}</Text>

      <View style={styles.actionContainer}>
        <View style={styles.favouriteContainer}>
          <Pressable onPress={() => onFavourite(snap.id)} style={styles.favouriteButton}>
            <Icon
              name={snap.favouritedByUser ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={snap.favouritedByUser ? 'gold' : 'gray'}
            />
          </Pressable>
        </View>

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

        {/* Nuevo botón de SnapShare */}
        <View style={styles.shareContainer}>
          <Pressable onPress={() => onSnapShare(snap)} style={styles.shareButton}>
            <Icon name="share" size={24} color="gray" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SnapItem;
