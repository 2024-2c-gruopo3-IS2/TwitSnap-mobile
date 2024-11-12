import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, getDownloadURL } from 'firebase/storage';
import defaultProfileImage from '../assets/images/placeholder_user.jpg';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { storage } from '../firebaseConfig';
import countUnreadMessages from '../functions/countUnreadMessage';
import {AuthContext} from '../context/authContext';


// Define the type for each chat item
interface ChatItemProps {
  item: {
    chatID: string;
    user1Email: string;
    user2Email: string;
    user1Username: string;
    user2Username: string;
    messages?: { [key: string]: { text: string } };
  };
}

const ChatItem: React.FC<ChatItemProps> = ({ item }) => {
  const navigation = useNavigation();
  const { loggedInUser, refreshingChats, setRefreshingChats } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [avatarUser1, setAvatarUser1] = useState<{ uri: string } | null>(null);
  const [avatarUser2, setAvatarUser2] = useState<{ uri: string } | null>(null);
  const [loadingUser1, setLoadingUser1] = useState<boolean>(true);
  const [loadingUser2, setLoadingUser2] = useState<boolean>(true);
  const [lastMessage, setLastMessage] = useState<string>('No messages yet');

  const fetchAvatarImage = async (): Promise<void> => {
    try {
      const imageRef1 = ref(storage, `profile/images/${item.user1Email}`);
      const url1 = await getDownloadURL(imageRef1);
      setAvatarUser1({ uri: url1 });
      setLoadingUser1(false);

      const imageRef2 = ref(storage, `profile/images/${item.user2Email}`);
      const url2 = await getDownloadURL(imageRef2);
      setAvatarUser2({ uri: url2 });
      setLoadingUser2(false);
    } catch (error) {
      setAvatarUser1('https://via.placeholder.com/150');
      setAvatarUser2('https://via.placeholder.com/150');
      setLoadingUser1(false);
      setLoadingUser2(false);
    }
  };

  useEffect(() => {
    fetchAvatarImage();
  }, [refreshingChats]);

  useEffect(() => {
    const fetchUnreadMessages = async (): Promise<void> => {
      try {
        const amount = await countUnreadMessages(item.chatID, loggedInUser.email);
        setUnreadCount(amount);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };
    setRefreshingChats(false);
    fetchUnreadMessages();
  }, [item.chatID, loggedInUser.email, refreshingChats]);

  const handleChatPress = (): void => {
    const chatID = item.chatID;
    const email_sender = loggedInUser.email === item.user1Email ? loggedInUser.email : item.user2Email;
    const email_receiver = loggedInUser.email === item.user1Email ? item.user2Email : item.user1Email;
    const fromNotification = false;
    navigation.push('SpecificChat', { chatID, email_sender, email_receiver, fromNotification });
  };

  useEffect(() => {
    const lastMsg = item.messages && Object.values(item.messages).slice(-1)[0]?.text || 'No messages yet';
    setLastMessage(lastMsg);
  }, [item.messages, refreshingChats]);

  return (
    <TouchableOpacity onPress={handleChatPress} style={styles.chatItem}>
      <View style={styles.row}>
        <View style={styles.avatarContainer}>
          {(loadingUser1 && item.user1Email === loggedInUser.email) || (loadingUser2 && item.user2Email === loggedInUser.email) ? (
            <ShimmerPlaceholder
              style={styles.pic}
              shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
            />
          ) : (
            <Image
              source={item.user1Email === loggedInUser.email ? avatarUser2 || 'https://via.placeholder.com/150' : avatarUser1 || 'https://via.placeholder.com/150'}
              style={styles.pic}
            />
          )}
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
            {item.user1Email === loggedInUser.email ? item.user2Username : item.user1Username}
          </Text>
          <Text style={styles.lastMsgTxt} numberOfLines={1} ellipsizeMode="tail">
            {lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatarContainer: {
    position: 'relative',
  },
  pic: {
    borderRadius: 30,
    width: 50,
    height: 50,
  },
  badge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#2D58A0',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  nameTxt: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  lastMsgTxt: {
    fontWeight: '400',
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
});

export default ChatItem;
