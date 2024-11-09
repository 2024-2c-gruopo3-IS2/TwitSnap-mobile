// chat.tsx

import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ref, onValue, push, set, query as dbQuery, orderByChild, get } from 'firebase/database';
import { db } from '../firebaseConfig'; // Asegúrate de que la ruta es correcta
import { AuthContext } from '@/context/authContext';
import styles from '../styles/chat'; // Actualizaremos este archivo más adelante
import Toast from 'react-native-toast-message';
import BackButton from '@/components/backButton';

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
  const { with: withUsername } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<User | null>(null);

  const currentUsername = user?.username;

  useEffect(() => {
    if (!withUsername) {
      Alert.alert('Error', 'No se especificó con quién chatear.');
      router.back();
      return;
    }

    if (!currentUsername) {
      Alert.alert('Error', 'Usuario actual no está disponible.');
      router.back();
      return;
    }

    const chatId = getChatId(currentUsername, withUsername);

    if (!chatId) {
      Alert.alert('Error', 'ID de chat inválido.');
      router.back();
      return;
    }

    console.log('Chat ID:', chatId);

    // Obtener la información del otro usuario
    const otherUserRef = ref(db, `users/${withUsername}`);
    get(otherUserRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setOtherUser({
            username: data.username,
            profilePicture: data.profilePicture,
          });
        } else {
          console.log('No se encontró al usuario con el username:', withUsername);
        }
      })
      .catch((error) => {
        console.error('Error al obtener datos del usuario:', error);
      });

    // Referencia a los mensajes del chat
    const messagesRef = ref(db, `chats/${chatId}/messages`);
    const orderedMessagesRef = dbQuery(messagesRef, orderByChild('timestamp'));

    const unsubscribe = onValue(
      orderedMessagesRef,
      (snapshot) => {
        const msgs: Message[] = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data) {
            msgs.push({
              id: childSnapshot.key || '',
              sender: data.sender || '',
              receiver: data.receiver || '',
              text: data.text || '',
              timestamp: data.timestamp || 0,
            });
          }
        });
        setMessages(msgs);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error al obtener mensajes:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Hubo un problema al cargar los mensajes.',
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [withUsername, currentUsername, router]);

  const getChatId = (user1: string | undefined, user2: string | undefined) => {
    if (!user1 || !user2) return '';
    return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    if (!currentUsername || !withUsername) {
      Alert.alert('Error', 'Datos de usuario faltantes.');
      return;
    }

    const chatId = getChatId(currentUsername, withUsername);

    if (!chatId) {
      Alert.alert('Error', 'ID de chat inválido.');
      return;
    }

    const messagesRef = ref(db, `chats/${chatId}/messages`);
    const newMessageRef = push(messagesRef); // Genera un nuevo ID único para el mensaje

    try {
      await set(newMessageRef, {
        sender: currentUsername,
        receiver: withUsername,
        text: inputText,
        timestamp: Date.now(), // Usar serverTimestamp() si gestionas un backend
      });
      setInputText('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo enviar el mensaje.',
      });
    }
  };

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

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Barra Superior con Botón de Retroceso, Nombre y Foto */}
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        {otherUser?.profilePicture ? (
          <Image source={{ uri: otherUser.profilePicture }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {otherUser?.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.headerTitle}>{otherUser?.username}</Text>
      </View>

      {/* Lista de Mensajes */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        inverted={false} // Puedes ajustar esto según tus necesidades
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
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={24} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}