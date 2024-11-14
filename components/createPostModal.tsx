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
import { getAllUsers } from '@/handlers/profileHandler'; // Importa el endpoint de seguidores
import { AuthContext } from '@/context/authContext';
import {usePostContext} from '@/context/postContext';
import { getTrendingTopics } from '@/handlers/postHandler';
import { sendTrendingNotification } from '@/handlers/notificationHandler';

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
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (isVisible && user) {
      const fetchUsers = async () => {
        try {
          const response = await getAllUsers();
          if (response.success && response.users) {
            const formattedUsers = response.users.map(f => ({
              id: f.id || f.username || Math.random().toString(), // Valor seguro para `id`
              username: f.username || f,
            }));
            setUsers(formattedUsers);
          } else {
            console.error('Error al obtener los users:', response.message);
          }
        } catch (error) {
          console.error('Error en la llamada a getAllUsers:', error);
        }
      };

      fetchUsers();
    }
  }, [isVisible, user]);

  const handlePostContentChange = (text: string) => {
    setPostContent(text);

    const mentionTriggerIndex = text.lastIndexOf('@');
    if (mentionTriggerIndex >= 0) {
      const mentionText = text.slice(mentionTriggerIndex + 1).toLowerCase();

      const filtered = users.filter(user =>
        user.username && user.username.toLowerCase().includes(mentionText)
      );

      setFilteredUsers(filtered);
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

  const sendNotificationsForTrendingTopics = async (newTopics: string[]) => {
    if (!user.username) {
      console.log('Usuario no autenticado. No se enviarán notificaciones.');
      return;
    }

    try {
      for (const topic of newTopics) {
        await sendTrendingNotification(topic);
      }
    } catch (error) {
      console.error('Error al enviar notificaciones de TT', error);
    }
  };

  const handlePost = async () => {
      if (postContent.trim() === '') {
        Alert.alert('Error', 'El contenido no puede estar vacío');
        return;
      }
      if (postContent.length > MAX_CHAR_COUNT) {
        Alert.alert('Error', `El contenido no puede exceder ${MAX_CHAR_COUNT} caracteres`);
        return;
      }

      // Cierra el modal visualmente antes de iniciar las llamadas a la API
      onClose();

      const newPost = {
        username: user.username,
        time: new Date().toLocaleString(),
        message: postContent,
        isPrivate: isPrivate,
        hashtags: hashtags, // Add the extracted hashtags to the post
      };

      const trendingTopics = await getTrendingTopics();
      console.log("[TRENDING TOPICS]", trendingTopics);

      await addNewPost(newPost);

      // Define a regex to match hashtags (words starting with #)
      const hashtagRegex = /#\w+/g;

      // Extract hashtags from postContent using the regex
      const hashtags = postContent.match(hashtagRegex) || [];
      console.log("[HASHTAGS]", hashtags);

      // Iterate over hashtags and check if they are in trendingTopics
      const newTopics = hashtags.filter(hashtag => trendingTopics.topics.includes(hashtag));
      console.log("[NEW TOPICS]", newTopics);

      // Send notifications if any hashtags match trending topics
      if (newTopics.length > 0) {
          sendNotificationsForTrendingTopics(newTopics);
      }

      // Clear post content and reset privacy
      setPostContent('');
      setIsPrivate(false);
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
              {filteredUsers.length > 0 ? (
                <FlatList
                  data={filteredUsers}
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
