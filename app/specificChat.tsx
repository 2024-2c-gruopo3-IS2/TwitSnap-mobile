import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Image } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { AuthContext } from '../context/authContext';
import { ref, get, push, serverTimestamp, onChildAdded, off } from 'firebase/database';
import { db } from '../firebaseConfig';
import ChatMessage from './chatMessage';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SpecificChat = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { chatID, email_sender, email_receiver, fromNotification, otherUserProfileImage, otherUserName } = useLocalSearchParams();

  if (!chatID || !email_sender || !email_receiver) {
    console.error('Missing required route parameters');
    return null;
  }

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    const messageRef = ref(db, `chats/${chatID}/messages`);
    const handleNewMessage = (snapshot) => {
      if (snapshot.exists()) {
        setMessages((prevMessages) => [...prevMessages, snapshot.val()]);
      }
    };

    onChildAdded(messageRef, handleNewMessage);

    return () => {
      off(messageRef, 'child_added', handleNewMessage);
    };
  }, [chatID]);

  const sendMessage = async () => {
    if (newMessage.trim().length > 0) {
      const message = {
        sender: user.username,
        text: newMessage,
        timestamp: serverTimestamp(),
      };

      await push(ref(db, `chats/${chatID}/messages`), message);
      setNewMessage('');
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Barra superior con foto de perfil, nombre y botón de retroceso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Entypo name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Image source={{ uri: otherUserProfileImage }} style={styles.profileImage} />
        <Text style={styles.userName}>{email_receiver}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => `${item.timestamp}_${index}`} // Clave única usando timestamp e índice
        renderItem={({ item }) => <ChatMessage item={item} user={user} />}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          placeholderTextColor="#888888"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#1DA1F2" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    marginTop:50,
  },
  backButton: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1DA1F2',
  },
  userName: {
    marginLeft: 10,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#1E1E1E', // Fondo oscuro
    borderTopColor: '#333', // Borde oscuro
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2C2C2C', // Fondo más oscuro para el input
    borderRadius: 25,
    marginRight: 10,
    paddingHorizontal: 15,
    color: '#FFFFFF', // Texto claro
  },
});

export default SpecificChat;
