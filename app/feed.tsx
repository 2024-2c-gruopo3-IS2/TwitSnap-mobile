import React, { useState } from 'react';
import { View, Text, TextInput, Image, Pressable, ScrollView, Alert } from 'react-native';
import styles from '../styles/feed';
import Footer from '../components/footer'; 

// Datos simulados para el feed
const feedData = [
  {
    username: 'Tincho',
    time: '1h ago',
    content: 'Introducing our latest product, the Acme Prism T-Shirt! Crafted with a blend of 60% combed ringspun cotton and 40% polyester...',
  },
  {
    username: 'Valen',
    time: '2h ago',
    content: 'We are excited to announce the launch of our new Acme Prism T-Shirt!',
  },
  {
    username: 'Brandon',
    time: '3h ago',
    content: 'Get yours now and be the first to rock the latest Acme fashion!',
  },
];

export default function Feed() {
  const [newPost, setNewPost] = useState(''); // Maneja el contenido del nuevo post
  const [posts, setPosts] = useState(feedData); // Maneja el estado de los posts

  const handlePost = () => {
    if (newPost.trim() === '') {
      Alert.alert('Error', 'El contenido no puede estar vacío');
      return;
    }

    const newPostData = {
      username: 'User', // Aquí puedes agregar el nombre de usuario dinámico
      time: 'Just now',
      content: newPost,
    };

    setPosts([newPostData, ...posts]); // Agregar el nuevo post al inicio del array
    setNewPost(''); // Limpiar el campo de texto
  };

  return (
    <View style={styles.container}>
      {/* Sección para publicar un nuevo mensaje */}
      <View style={styles.newPostContainer}>
        <TextInput
          style={styles.newPostInput}
          placeholder="Escribe algo..."
          placeholderTextColor="#888"
          value={newPost}
          onChangeText={setNewPost} // Actualiza el estado del nuevo post
        />
        <Pressable style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Postear</Text>
        </Pressable>
      </View>

      {/* Sección de los posts */}
      <ScrollView style={styles.feed}>
        {posts.map((post, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={require('../assets/images/placeholder-user.jpg')} style={styles.cardAvatar} />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{post.username}</Text>
                <Text style={styles.time}>{post.time}</Text>
              </View>
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

      {/* Footer global con navegación */}
      <Footer />
    </View>
  );
}
