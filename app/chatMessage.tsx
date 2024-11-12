import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import defaultProfileImage from '../assets/images/placeholder_user.jpg';

const ChatMessage = ({ item, user, avatarUser1, avatarUser2 }) => {
  const defaultImageUri = "https://firebasestorage.googleapis.com/v0/b/jobinterviewme.appspot.com/o/profile%2Fimages%2Fdefault-profile.png?alt=media&token=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b";

  const renderRightMessage = () => (
    <View style={styles.rightMsg}>
      <View style={styles.rightBlock}>
        <Text style={styles.rightTxt}>{item.text}</Text>
      </View>
      <Image
        source={{ uri: item.user1Email === user.email ? avatarUser2?.uri || defaultImageUri : avatarUser1?.uri || defaultImageUri }}
        style={styles.userPic}
      />
    </View>
  );

  const renderLeftMessage = () => (
    <View style={styles.eachMsg}>
      <Image
        source={{ uri: item.user1Email === user.email ? avatarUser1?.uri || defaultImageUri : avatarUser2?.uri || defaultImageUri }}
        style={styles.userPic}
      />
      <View style={styles.leftBlock}>
        <Text style={styles.leftTxt}>{item.text}</Text>
      </View>
    </View>
  );

  return item.sender === user.email ? renderRightMessage() : renderLeftMessage();
};

const styles = StyleSheet.create({
  eachMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  rightMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
    alignSelf: 'flex-end',
  },
  userPic: {
    height: 40,
    width: 40,
    margin: 5,
    borderRadius: 20,
  },
  leftBlock: {
    maxWidth: '75%',
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 15,
    shadowColor: '#000',
    shadowRadius: 2,
    shadowOpacity: 0.2,
    shadowOffset: { height: 1 },
  },
  rightBlock: {
    maxWidth: '75%',
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 15,
    shadowColor: '#000',
    shadowRadius: 2,
    shadowOpacity: 0.2,
    shadowOffset: { height: 1 },
  },
  leftTxt: {
    fontSize: 16,
    color: 'white',
  },
  rightTxt: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ChatMessage;