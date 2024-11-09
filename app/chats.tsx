// app/chats.tsx

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import Footer from '@/components/footer';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatsScreen: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const mockChats = [
    {
      chatId: '1',
      otherUser: {
        uid: 'uid1',
        username: 'usuario1',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      lastMessage: {
        text: 'Hola, ¿cómo estás?',
        timestamp: 1625152800000,
      },
    },
    {
      chatId: '2',
      otherUser: {
        uid: 'uid2',
        username: 'usuario2',
        profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      lastMessage: {
        text: '¿Quieres salir esta noche?',
        timestamp: 1625239200000,
      },
    },
    {
      chatId: '3',
      otherUser: {
        uid: 'uid3',
        username: 'usuario3',
        profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      lastMessage: {
        text: '¡Claro! A las 8 en el café.',
        timestamp: 1625325600000,
      },
    },
  ];

  const filteredChats = mockChats.filter(chat =>
    chat.otherUser.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chat?uid=uid1`)} // Fijo en uid1 para pruebas
    >
      {item.otherUser.profilePicture ? (
        <Image source={{ uri: item.otherUser.profilePicture }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>
            {item.otherUser.username.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.chatInfo}>
        <Text style={styles.username}>{item.otherUser.username}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(item.lastMessage.timestamp).toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuario..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.chatId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
      />

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 50,
  },
  backButton: {
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  list: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  timestamp: {
    color: '#ccc',
    fontSize: 12,
  },
});

export default ChatsScreen;
