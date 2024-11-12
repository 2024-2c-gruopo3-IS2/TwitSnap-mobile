import React, { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, View, FlatList, Pressable, RefreshControl, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { query, orderByChild, equalTo, get, ref } from 'firebase/database';
import { useRouter } from 'expo-router';
import ChatItem from './chatItem';
import { db } from '../firebaseConfig';
import { AuthContext } from '../context/authContext';

interface Chat {
  chatId: string;
  user1Email: string;
  user2Email: string;
  [key: string]: any;
}

const Chats: React.FC = () => {
  const { loggedInUser } = useContext(AuthContext);
  const router = useRouter();

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshingChats, setRefreshingChats] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setRefreshingChats(true);
    }, [])
  );

  useEffect(() => {
    if (refreshingChats) {
      handleRefresh();
    }
  }, [refreshingChats]);

  const handlePressPlus = () => {
    router.push('/newChat');
  };

  const handleRefresh = async () => {
    if (loading) return;

    setLoading(true);
    const chatsRef = ref(db, 'chats');
    const email = loggedInUser?.email;

    if (!email) {
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching chats...");
      const user1Query = query(chatsRef, orderByChild('user1Email'), equalTo(email));
      const user2Query = query(chatsRef, orderByChild('user2Email'), equalTo(email));

      const user1Chats = await get(user1Query);
      const user2Chats = await get(user2Query);

      const user1ChatsData = user1Chats.exists() ? user1Chats.val() : {};
      const user2ChatsData = user2Chats.exists() ? user2Chats.val() : {};

      const chatData = { ...user1ChatsData, ...user2ChatsData };

      const chatList: Chat[] = Object.keys(chatData).map((chatId) => ({
        chatId,
        ...chatData[chatId],
      }));

      setChats(chatList);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
      setRefreshingChats(false);
    }
  };

  return (
    <View style={styles.container}>
      {chats.length === 0 && !loading ? (
        <View style={styles.noChatsContainer}>
          <Text style={styles.noChatsText}>No chats available</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          renderItem={({ item }) => <ChatItem item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshingChats}
              onRefresh={handleRefresh}
              colors={['#6B5A8E']}
            />
          }
        />
      )}
      <Pressable style={styles.floatingButton} onPress={handlePressPlus}>
        <Entypo name="plus" size={24} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  floatingButton: {
    backgroundColor: '#2D58A0',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Chats;