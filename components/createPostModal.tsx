import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  StyleSheet,
} from 'react-native';
import { BlurView } from 'expo-blur'; // Import BlurView
import styles from '../styles/createPostModal'; // Ensure your styles are correctly imported

interface Post {
  id?: string;  
  username: string;
  time: string;
  message: string;
  isPrivate: boolean;
}

interface CreatePostModalProps {
  isVisible: boolean;
  onClose: () => void;
  addNewPost: (newPost: Post) => void;
}

const MAX_CHAR_COUNT = 280; // Maximum character length

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isVisible,
  onClose,
  addNewPost,
}) => {
  const [postContent, setPostContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false); // State for post privacy

  const handlePost = () => {
    // Content validation
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

    // Create the new post
    const newPost: Post = {
      id: Date.now().toString(), // Use timestamp as a simple unique ID
      username: 'User', // Replace with actual logged-in user's username
      time: 'Just now',
      message: postContent,
      isPrivate: isPrivate,
    };

    // Add the new post to the feed
    addNewPost(newPost);

    // Reset states and close modal
    setPostContent('');
    setIsPrivate(false);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Use BlurView instead of View for the overlay */}
      <BlurView intensity={100} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Title */}
          <Text style={styles.modalTitle}>Crear TwitSnap</Text>

          {/* Post content input */}
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

          {/* Privacy switch */}
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

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Text style={styles.buttonText}>Publicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default CreatePostModal;
