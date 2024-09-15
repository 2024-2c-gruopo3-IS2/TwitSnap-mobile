import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import styles from '../styles/feed';
import Footer from '../components/footer';

interface Post {
  id: number;
  username: string;
  time: string;
  content: string;
  isPrivate: boolean;
}

const feedData: Post[] = [
  {
    id: 1,
    username: 'Tincho',
    time: '1h ago',
    content:
      'Introducing our latest product, the Acme Prism T-Shirt! Crafted with a blend of 60% combed ringspun cotton and 40% polyester...',
    isPrivate: false,
  },
  {
    id: 2,
    username: 'Valen',
    time: '2h ago',
    content: 'We are excited to announce the launch of our new Acme Prism T-Shirt!',
    isPrivate: true,
  },
  {
    id: 3,
    username: 'Brandon',
    time: '3h ago',
    content: 'Get yours now and be the first to rock the latest Acme fashion!',
    isPrivate: false,
  },
];

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(feedData); // Maneja el estado de los posts
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // Para manejar la edición de publicaciones
  const [editedContent, setEditedContent] = useState(''); // Contenido editado
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Control de visibilidad de la modal de edición

  // Función para agregar una nueva publicación desde la modal
  const addNewPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  // Función para editar una publicación
  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setEditedContent(post.content);
    setIsEditModalVisible(true);
  };

  const saveEditedPost = () => {
    if (editedContent.trim() === '') {
      Alert.alert('Error', 'El contenido no puede estar vacío');
      return;
    }
    if (!selectedPost) {
      Alert.alert('Error', 'No hay ninguna publicación seleccionada para editar');
      return;
    }
    setPosts(
      posts.map((post) =>
        post.id === selectedPost.id ? { ...post, content: editedContent } : post
      )
    );
    setIsEditModalVisible(false);
    setSelectedPost(null);
    setEditedContent('');
  };

  // Función para eliminar una publicación
  const handleDeletePost = (postId: number) => {
    Alert.alert(
      'Eliminar publicación',
      '¿Estás seguro de que deseas eliminar esta publicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setPosts(posts.filter((post) => post.id !== postId));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Sección de los posts */}
      <ScrollView style={styles.feed}>
        {posts.map((post) => (
          <View key={post.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image
                source={require('../assets/images/placeholder-user.jpg')}
                style={styles.cardAvatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{post.username}</Text>
                <Text style={styles.time}>{post.time}</Text>
              </View>
              {/* Botones de editar y eliminar si es tu publicación */}
              {post.username === 'User' && (
                <View style={styles.postActions}>
                  <Pressable onPress={() => handleEditPost(post)}>
                    <Text style={styles.actionButton}>Editar</Text>
                  </Pressable>
                  <Pressable onPress={() => handleDeletePost(post.id)}>
                    <Text style={styles.actionButton}>Eliminar</Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.contentText}>{post.content}</Text>
            </View>

            <View style={styles.cardFooter}>
              <Pressable>
                <Text style={styles.footerButton}>Like</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.footerButton}>Comment</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.footerButton}>Share</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para editar publicación */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Publicación</Text>
            <TextInput
              style={styles.textInput}
              multiline
              value={editedContent}
              onChangeText={setEditedContent}
            />
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={saveEditedPost}>
                <Text style={styles.buttonText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer global con navegación */}
      <Footer addNewPost={addNewPost} />
    </View>
  );
}
