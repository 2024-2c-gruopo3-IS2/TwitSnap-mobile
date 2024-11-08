import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthContext } from '@/context/authContext'; // Suponiendo que tienes un contexto de autenticación
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/chatScreen';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
}

const ChatScreen = () => {
  const router = useRouter();
  const { user1, user2 } = useLocalSearchParams(); // Recibe los usuarios desde los parámetros
  const { user } = useContext(AuthContext); // Para obtener los detalles del usuario logueado

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user1 || !user2) {
      Alert.alert('Error', 'Usuarios no disponibles.');
      return;
    }

    // Simulación de la carga de mensajes
    const fetchMessages = () => {
      setIsLoading(true);
      // Simulando mensajes
      setTimeout(() => {
        setMessages([
          { id: '2', text: '¡Hola! Estoy bien, ¿y tú?', sender: user2, timestamp: '2024-11-08 10:02:00' },
          { id: '1', text: 'Hola, ¿cómo estás?', sender: user1, timestamp: '2024-11-08 10:00:00' },
        ]);
        setIsLoading(false);
      }, 1000);
    };

    fetchMessages();
  }, [user1, user2]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    const newMsg: Message = {
      id: (messages.length + 1).toString(),
      text: newMessage,
      sender: user?.username || 'Anonymous',
      timestamp: new Date().toLocaleString(),
    };

    // Simulación de enviar el mensaje
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');
      setIsSending(false);
    }, 500);
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.sender === user1 ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={styles.messageSender}>{item.sender}</Text>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.chatTitle}> </Text>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-back" size={30} color="white" />
      </Pressable>

      <Text style={styles.chatTitle}>Chat with {user2}</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#006AFF" />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messageList}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          placeholderTextColor="#B0B0B0"
        />
        <Pressable style={styles.sendButton} onPress={handleSendMessage} disabled={isSending}>
          <Icon name="send" size={30} color={isSending ? 'gray' : '#006AFF'} />
        </Pressable>
      </View>
    </View>
  );
};

export default ChatScreen;
