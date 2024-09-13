import React, { useState } from 'react';
import { View, Text, TextInput, Image, Pressable, ScrollView, Alert } from 'react-native';
import styles from '../styles/feed';

// Feed data
const feedData = [
  {
    username: 'Acme Inc',
    time: '1h ago',
    content: 'Introducing our latest product, the Acme Prism T-Shirt! Crafted with a blend of 60% combed ringspun cotton and 40% polyester...',
  },
  {
    username: 'Acme Inc',
    time: '2h ago',
    content: 'We are excited to announce the launch of our new Acme Prism T-Shirt!',
  },
  {
    username: 'Acme Inc',
    time: '3h ago',
    content: 'Get yours now and be the first to rock the latest Acme fashion!',
  },
];

export default function Feed() {
  const [newPost, setNewPost] = useState(''); // Handle new post content
  const [posts, setPosts] = useState(feedData); // Handle the posts' state

  const handlePost = () => {
    if (newPost.trim() === '') {
      Alert.alert('Error', 'El contenido no puede estar vacío');
      return;
    }

    const newPostData = {
      username: 'User', // Here you can add dynamic username
      time: 'Just now',
      content: newPost,
    };

    setPosts([newPostData, ...posts]); // Add new post to the top
    setNewPost(''); // Clear the text field
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.avatarContainer}>
          <Image source={require('../assets/images/placeholder-user.jpg')} style={styles.avatar} />
          <Text style={styles.srOnly}>Toggle user menu</Text>
        </Pressable>
      </View>

      {/* Input for new post */}
      <View style={styles.newPostContainer}>
        <TextInput
          style={styles.newPostInput}
          placeholder="Escribe algo..."
          placeholderTextColor="#888"
          value={newPost}
          onChangeText={setNewPost} // Update the new post state
        />
        <Pressable style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Postear</Text>
        </Pressable>
      </View>

      {/* Main Content */}
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

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable>
          <Image 
            source={{ uri: 'https://img.icons8.com/?size=100&id=O4uwtuMQi925&format=png&color=FFFFFF' }} 
            style={styles.footerIcon}
          />
        </Pressable>
        <Pressable>
          <Image 
            source={{ uri: 'https://img.icons8.com/?size=100&id=2sWrwEXiaegS&format=png&color=FFFFFF' }} 
            style={styles.footerIcon}
          />
        </Pressable>
        <Pressable>
          <Image 
            source={{ uri: 'https://img.icons8.com/?size=100&id=nY7Q73ERmlBS&format=png&color=FFFFFF' }} 
            style={styles.footerIcon}
          />
        </Pressable>
        <Pressable>
          <Image 
            source={{ uri: 'https://img.icons8.com/?size=100&id=87019&format=png&color=FFFFFF' }} 
            style={styles.footerIcon}
          />
        </Pressable>
      </View>
    </View>
  );
}
