// app/chat.tsx

import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/authContext';
import BackButton from '@/components/backButton';
import { StyleSheet } from 'react-native';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  text: string;
  timestamp: number;
}

interface User {
  username: string;
  profilePicture: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const otherUser: User = {
    username: 'usuario1',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
  };

  const currentUsername = user?.username || 'currentUser';

  useEffect(() => {
    // Datos de mensajes hardcodeados para pruebas de frontend
    setMessages([
      {
        id: '1',
        sender: currentUsername,
        receiver: otherUser.username,
        text: 'Hola, ¿cómo estás?',
        timestamp: 1625152800000,
      },
      {
        id: '2',
        sender: otherUser.username,
        receiver: currentUsername,
        text: '¡Hola! Estoy bien, gracias. ¿Y tú?',
        timestamp: 1625156400000,
      },
      {
        id: '3',
        sender: currentUsername,
        receiver: otherUser.username,
        text: 'Todo bien, gracias por preguntar.',
        timestamp: 1625160000000,
      },
    ]);
  }, [currentUsername, otherUser.username]);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => {
      const isCurrentUser = item.sender === currentUsername;
      return (
        <View
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUser : styles.otherUser,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTimestamp}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      );
    },
    [currentUsername]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Encabezado con Botón de Retroceso, Nombre y Foto */}
      <View style={styles.header}>
        <View style={styles.backButton}>
          <BackButton onPress={() => router.back()} />
        </View>
        <View style={styles.userInfo}>
          {otherUser.profilePicture ? (
            <Image source={{ uri: otherUser.profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>
                {otherUser.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.headerTitle}>{otherUser.username}</Text>
        </View>
      </View>

      {/* Lista de Mensajes */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      {/* Campo de Entrada y Botón de Envío */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <Pressable style={styles.sendButton} onPress={() => setInputText('')}>
          <Icon name="send" size={24} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderColor: '#333',
    marginTop: 50,
  },
  backButton: {
    paddingRight: 10,
    marginTop: -70,
  },
  userInfo: {
    flex: 1, // Take up remaining space
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center contents horizontally within userInfo
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  currentUser: {
    backgroundColor: '#1DA1F2',
    alignSelf: 'flex-end',
  },
  otherUser: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  messageTimestamp: {
    color: '#bbb',
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#1DA1F2',
    padding: 10,
    borderRadius: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});