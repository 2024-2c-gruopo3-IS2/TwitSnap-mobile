import React from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
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
}

interface SnapItemProps {
  snap: Snap;
  onLike: (id: string) => void;
  onEdit?: (snap: Snap) => void;    // Función opcional para editar
  onDelete?: (id: string) => void;  // Función opcional para eliminar
  isOwnProfile?: boolean;           // Bandera para indicar si es el perfil propio
}

const SnapItem: React.FC<SnapItemProps> = ({ snap, onLike, onEdit, onDelete, isOwnProfile }) => {
  const router = useRouter();

  return (
    <View style={styles.snapContainer}>
      {/* Cabecera del Snap */}
      <View style={styles.snapHeader}>
        <Text style={styles.username}>@{snap.username}</Text>
        <Text style={styles.time}>{snap.time}</Text>
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

      {/* Botón de "Me Gusta" y contador en la parte inferior derecha */}
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
    </View>
  );
};

export default SnapItem;
