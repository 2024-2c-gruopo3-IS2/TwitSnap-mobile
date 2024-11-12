import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text, KeyboardAvoidingView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ref, get, push, serverTimestamp, onChildAdded, off } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/authContext';
import { db } from '../firebaseConfig';
import ChatMessage from './chatMessage';
import { useSearchParams } from 'expo-router';
import {useRouter} from 'expo-router';
import {useLocalSearchParams} from 'expo-router';

const SpecificChat = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  //const { chatID, email_sender, email_receiver, fromNotification } = route.params || {};
  const { chatID, email_sender, email_receiver, fromNotification } = useLocalSearchParams();


  console.log('chatID: ', chatID);
    console.log('email_sender: ', email_sender);
    console.log('email_receiver: ', email_receiver);
    console.log('fromNotification: ', fromNotification);

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
        sender: user.email,
        text: newMessage,
        timestamp: serverTimestamp(),
      };

      await push(ref(db, `chats/${chatID}/messages`), message);
      setNewMessage('');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.timestamp.toString()}

        renderItem={({ item }) => <ChatMessage item={item} user={user} />}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderTopColor: '#ccc',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    marginRight: 10,
    paddingHorizontal: 10,
  },
});

export default SpecificChat;