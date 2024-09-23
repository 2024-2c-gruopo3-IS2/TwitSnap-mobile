// EditPostModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { BlurView } from 'expo-blur'; // Import BlurView
import styles from '../styles/createPostModal'; // Asegúrate de que tus estilos se importen correctamente

interface Snap {
  id: string;  
  username: string;
  time: string;
  message: string;
  isPrivate: boolean;
}

interface EditPostModalProps {
  isVisible: boolean;
  onClose: () => void;
  editPost: (updatedPost: Snap) => void;
  post: Snap; // El post a editar
}

const MAX_CHAR_COUNT = 280; // Longitud máxima de caracteres

const EditPostModal: React.FC<EditPostModalProps> = ({
  isVisible,
  onClose,
  editPost,
  post,
}) => {
  const [postContent, setPostContent] = useState(post.message);
  const [isPrivate, setIsPrivate] = useState(post.isPrivate);

  const handleEdit = () => {
    // Validación de contenido
    if (postContent.trim() === '') {
      Alert.alert('Error', 'El contenido no puede estar vacío');
      return;
    }
    if (postContent.length > MAX_CHAR_COUNT) {
      Alert.alert(
        'Error',
        `El contenido no puede exceder ${MAX_CHAR_COUNT} caracteres`
      );
      return;
    }

    // Crear el post actualizado
    const updatedPost: Snap = {
      ...post,
      message: postContent,
      isPrivate,
    };

    // Editar el post
    editPost(updatedPost);

    // Restablecer estados y cerrar modal
    setPostContent('');
    setIsPrivate(false);
    onClose();
  };

  useEffect(() => {
    setPostContent(post.message);
    setIsPrivate(post.isPrivate);
  }, [post]);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <BlurView intensity={100} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar TwitSnap</Text>

          <TextInput
            style={styles.textInput}
            placeholder="¿Qué está pasando?"
            placeholderTextColor="#888"
            multiline
            maxLength={MAX_CHAR_COUNT}
            value={postContent}
            onChangeText={setPostContent}
          />
          <Text style={styles.charCount}>
            {postContent.length}/{MAX_CHAR_COUNT}
          </Text>

          <View style={styles.privacyContainer}>
            <Text style={styles.privacyLabel}>
              {isPrivate ? 'Privado' : 'Público'}
            </Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: '#767577', true: '#1DA1F2' }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton} onPress={handleEdit}>
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default EditPostModal;
