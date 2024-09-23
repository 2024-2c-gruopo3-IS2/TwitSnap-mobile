// src/components/EditSnapModal.tsx
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
import { BlurView } from 'expo-blur';
import styles from '../styles/createPostModal'; // Reutiliza los estilos existentes

interface Post {
  id: string;  
  username: string;
  time: string;
  message: string;
  isPrivate: boolean;
}

interface EditSnapModalProps {
  isVisible: boolean;
  onClose: () => void;
  snap: Post | null;
  onSubmit: (snapId: string, message: string, isPrivate: boolean) => void;
}

const MAX_CHAR_COUNT = 280; // Máximo número de caracteres

const EditSnapModal: React.FC<EditSnapModalProps> = ({
  isVisible,
  onClose,
  snap,
  onSubmit,
}) => {
  const [postContent, setPostContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (snap) {
      setPostContent(snap.message);
      setIsPrivate(snap.isPrivate);
    }
  }, [snap]);

  const handleUpdate = () => {
    // Validación del contenido
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

    // Enviar el snap actualizado
    onSubmit(snap!.id, postContent, isPrivate);
  };

  if (!snap) return null; // Si no hay snap seleccionado, no renderizar nada

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Usar BlurView para el fondo blurreado */}
      <BlurView intensity={100} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Título */}
          <Text style={styles.modalTitle}>Editar TwitSnap</Text>

          {/* Input para el contenido del snap */}
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

          {/* Interruptor de privacidad */}
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

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default EditSnapModal;
