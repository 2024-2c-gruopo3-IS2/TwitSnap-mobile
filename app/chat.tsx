// app/chat.tsx
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { AuthContext } from '@/context/authContext';
import styles from '../styles/chat';
import Toast from 'react-native-toast-message';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  text: string;
  timestamp: any;
}

export default function ChatScreen() {
  const router = useRouter();
  const { with: withUsername } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const currentUsername = user?.username;

  useEffect(() => {
    if (!withUsername) {
      Alert.alert('Error', 'No se especificó con quién chatear.');
      router.back();
      return;
    }

    const chatId = getChatId(currentUsername, withUsername);
    const messagesRef = collection(firestore, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      setIsLoading(false);
    }, (error) => {
      console.error('Error al obtener mensajes:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Hubo un problema al cargar los mensajes.',
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [withUsername, currentUsername, router]);

  const getChatId = (user1: string | undefined, user2: string | undefined) => {
    if (!user1 || !user2) return '';
    return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const chatId = getChatId(currentUsername, withUsername);
    const messagesRef = collection(firestore, 'chats', chatId, 'messages');

    try {
      await addDoc(messagesRef, {
        sender: currentUsername,
        receiver: withUsername,
        text: inputText,
        timestamp: serverTimestamp(),
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

  const renderItem = useCallback(({ item }: { item: Message }) => {
    const isCurrentUser = item.sender === currentUsername;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUser : styles.otherUser,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  }, [currentUsername]);

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
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
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
