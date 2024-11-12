import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, getDownloadURL } from 'firebase/storage';
import defaultProfileImage from '../assets/images/placeholder_user.jpg';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { storage } from '../firebaseConfig';
import countUnreadMessages from '../functions/countUnreadMessage';
import {AuthContext} from '../context/authContext';
import { useRouter } from 'expo-router';

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
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [avatarUser1, setAvatarUser1] = useState<{ uri: string } | null>(null);
  const [avatarUser2, setAvatarUser2] = useState<{ uri: string } | null>(null);
  const [loadingUser1, setLoadingUser1] = useState<boolean>(true);
  const [loadingUser2, setLoadingUser2] = useState<boolean>(true);
  const [lastMessage, setLastMessage] = useState<string>('No messages yet');

  const fetchAvatarImage = async (): Promise<void> => {
    try {
      const imageRef1 = ref(storage, `profile_photos/${item.user1Email}.png`);
      const url1 = await getDownloadURL(imageRef1);
      setAvatarUser1({ uri: url1 });
      setLoadingUser1(false);

      const imageRef2 = ref(storage, `profile_photos/${item.user2Email}.png`);
      const url2 = await getDownloadURL(imageRef2);
      setAvatarUser2({ uri: url2 });
      setLoadingUser2(false);
    } catch (error) {
      setAvatarUser1({uri: "https://via.placeholder.com/150"});
      setAvatarUser2({uri: "https://via.placeholder.com/150"});
      setLoadingUser1(false);
      setLoadingUser2(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAvatarImage();
    };
    fetchData();
  }, []);

  const handleChatPress = async (): void => {
    const chatID = item.chatID;
    console.log("[specific ITEM] Chat ID: ", chatID);
    const email_sender = user.username === item.user1Email ? user.username : item.user2Email;
    console.log("[specific ITEM] email_sender: ", email_sender);
    const email_receiver = user.username === item.user1Email ? item.user2Email : item.user1Email;
    console.log("[specific ITEM] email_receiver: ", email_receiver);
    const fromNotification = false;

    router.push({
        pathname:'./specificChat',
        params: { chatID, email_sender, email_receiver, fromNotification}
        });
  };

  useEffect(() => {
    const lastMsg = item.messages && Object.values(item.messages).slice(-1)[0]?.text || 'No messages yet';
    setLastMessage(lastMsg);
  }, [item.messages]);

  return (
    <TouchableOpacity onPress={handleChatPress} style={styles.chatItem}>
      <View style={styles.row}>
        <View style={styles.avatarContainer}>
          {(loadingUser1 && item.user1Email === user.username) || (loadingUser2 && item.user2Email === user.username) ? (
            <ShimmerPlaceholder
              style={styles.pic}
              shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
            />
          ) : (
            <Image
              source={item.user1Email === user.username ? (avatarUser2 || defaultProfileImage) : (avatarUser1 || defaultProfileImage)}
              style={styles.pic}
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
            {item.user1Email === user.username ? item.user2Username : item.user1Username}
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
    backgroundColor: '#1E1E1E', // Fondo oscuro
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
    borderWidth: 1,
    borderColor: '#1DA1F2', // Borde para resaltar la imagen
  },
  badge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#1DA1F2', // Color más claro para visibilidad
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E1E1E', // Bordes oscuros para contraste
  },
  badgeText: {
    color: '#000000', // Texto oscuro para mejor contraste
    fontWeight: 'bold',
    fontSize: 12,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  nameTxt: {
    fontWeight: '600',
    color: '#FFFFFF', // Texto claro
    fontSize: 16,
  },
  lastMsgTxt: {
    fontWeight: '400',
    color: '#BBBBBB', // Texto más claro
    fontSize: 14,
    marginTop: 2,
  },
});

export default ChatItem;
