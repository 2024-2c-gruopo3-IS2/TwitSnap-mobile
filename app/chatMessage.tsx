import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatMessage = ({ item, user }) => {
  const isUserMessage = item.sender === user.username;

  return (
    <View style={[styles.messageContainer, isUserMessage ? styles.userMessageContainer : styles.receivedMessageContainer]}>
      <View style={[styles.messageBubble, isUserMessage ? styles.userMessageBubble : styles.receivedMessageBubble]}>
        <Text style={[styles.messageText, isUserMessage ? styles.userMessageText : styles.receivedMessageText]}>
          {item.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  receivedMessageContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 15,
  },
  userMessageBubble: {
    backgroundColor: '#1DA1F2', // Fondo azul para los mensajes del usuario
    borderTopRightRadius: 0,
  },
  receivedMessageBubble: {
    backgroundColor: '#333', // Fondo gris para los mensajes recibidos
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#FFFFFF', // Texto blanco para los mensajes del usuario
  },
  receivedMessageText: {
    color: '#BBBBBB', // Texto gris claro para los mensajes recibidos
  },
});

export default ChatMessage;
