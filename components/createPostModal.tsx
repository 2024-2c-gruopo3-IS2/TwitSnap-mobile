import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  FlatList,
} from 'react-native';
import { BlurView } from 'expo-blur';
import styles from '../styles/createPostModal';
import { getFollowers } from '@/handlers/followHandler'; // Importa el endpoint de seguidores
import { AuthContext } from '@/context/authContext';

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

const MAX_CHAR_COUNT = 280;

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isVisible,
  onClose,
  addNewPost,
}) => {
  const [postContent, setPostContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (isVisible && user) {
      const fetchFollowers = async () => {
        try {
          const response = await getFollowers(user.username);
          if (response.success && response.followers) {
            const formattedFollowers = response.followers.map(f => ({
              id: f.id || f.username || Math.random().toString(), // Valor seguro para `id`
              username: f.username || f,
            }));
            setFollowers(formattedFollowers);
          } else {
            console.error('Error al obtener los seguidores:', response.message);
          }
        } catch (error) {
          console.error('Error en la llamada a getFollowers:', error);
        }
      };

      fetchFollowers();
    }
  }, [isVisible, user]);

  const handlePostContentChange = (text: string) => {
    setPostContent(text);

    const mentionTriggerIndex = text.lastIndexOf('@');
    if (mentionTriggerIndex >= 0) {
      const mentionText = text.slice(mentionTriggerIndex + 1).toLowerCase();

      const filtered = followers.filter(follower =>
        follower.username && follower.username.toLowerCase().includes(mentionText)
      );

      setFilteredFollowers(filtered);
      setShowMentions(filtered.length > 0);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (username: string) => {
    const mentionTriggerIndex = postContent.lastIndexOf('@');
    const beforeMention = postContent.slice(0, mentionTriggerIndex);
    const updatedContent = `${beforeMention}@${username} `;
    setPostContent(updatedContent);
    setShowMentions(false);
  };

  const handlePost = () => {
    if (postContent.trim() === '') {
      Alert.alert('Error', 'El contenido no puede estar vacío');
      return;
    }
    if (postContent.length > MAX_CHAR_COUNT) {
      Alert.alert('Error', `El contenido no puede exceder ${MAX_CHAR_COUNT} caracteres`);
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      username: 'User', // Reemplaza con el nombre de usuario real
      time: 'Just now',
      message: postContent,
      isPrivate: isPrivate,
    };

    addNewPost(newPost);
    setPostContent('');
    setIsPrivate(false);
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={onClose}>
      <BlurView intensity={100} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Crear TwitSnap</Text>

          <TextInput
            style={styles.textInput}
            placeholder="¿Qué está pasando?"
            placeholderTextColor="#888"
            multiline
            maxLength={MAX_CHAR_COUNT}
            value={postContent}
            onChangeText={handlePostContentChange}
          />
          <Text style={styles.charCount}>{postContent.length}/{MAX_CHAR_COUNT}</Text>

          {/* Sugerencias de menciones */}
          {showMentions && (
            <View style={styles.mentionContainer}>
              {filteredFollowers.length > 0 ? (
                <FlatList
                  data={filteredFollowers}
                  keyExtractor={(item) => item.id.toString()} // Usa el id seguro
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.mentionItem}
                      onPress={() => handleMentionSelect(item.username)}
                    >
                      <Text style={styles.mentionText}>@{item.username}</Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={styles.noMentionText}>No se encontraron seguidores</Text>
              )}
            </View>
          )}

          <View style={styles.privacyContainer}>
            <Text style={styles.privacyLabel}>{isPrivate ? 'Privado' : 'Público'}</Text>
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
