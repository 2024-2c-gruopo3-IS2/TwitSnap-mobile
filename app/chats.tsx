import React, { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, View, FlatList, Pressable, RefreshControl, Text, SafeAreaView } from 'react-native';
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

const COLORS = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  subText: '#BBBBBB',
  primary: '#1DA1F2',  // Cambiado a color azul
  border: '#1DA1F2',
};

const Chats: React.FC = () => {
  const { user } = useContext(AuthContext);
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

  const handleBackPress = () => {
    router.back();
  };

  const handleRefresh = async () => {
    if (loading) return;

    setLoading(true);
    const chatsRef = ref(db, 'chats');
    const username = user?.username;
    try {
      const user1Query = query(chatsRef, orderByChild('user1Email'), equalTo(username));
      const user2Query = query(chatsRef, orderByChild('user2Email'), equalTo(username));
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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <Entypo name="chevron-left" size={30} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Chats</Text>
       </View>

      <View style={styles.listContainer}>
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
                colors={[COLORS.primary]}
              />
            }
          />
        )}
      </View>

      <Pressable style={styles.floatingButton} onPress={handlePressPlus}>
        <Entypo name="plus" size={24} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    zIndex: 1,
    marginTop: 70,
  },
  headerTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop:70,
    marginLeft: 170
  },
  listContainer: {
    flex: 1,
    paddingTop: 60,
    marginTop: -20,
  },
  floatingButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    fontSize: 16,
    color: COLORS.subText,
  },
});

export default Chats;
