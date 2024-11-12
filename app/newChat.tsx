import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Keyboard, Text, ListRenderItem, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { get, set, serverTimestamp, query, orderByChild, limitToLast } from 'firebase/database';
import { ref } from 'firebase/storage';
import { Entypo } from '@expo/vector-icons'; // Importa el icono de retroceso
import { AuthContext } from '../context/authContext';
import { db, storage } from '../firebaseConfig';
import SearchBar from './searchBar';
import ChatItemSearch from './chatItemSearch';
import { getAllUsers } from '../handlers/profileHandler';
import { getDownloadURL } from 'firebase/storage';
import debounce from 'lodash.debounce';

interface User {
  username: string;
  profileImage: string;
}

const NewChat: React.FC = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [usernameSearched, setUsernameSearched] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileImage = async (username: string) => {
    try {
      console.log('[NEW CHAT] Username: ', username);
      const imageRef = ref(storage, `profile_photos/${username}.png`);
      console.log('[NEW CHAT] Image ref:', imageRef);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      return 'https://via.placeholder.com/150';
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await getAllUsers();
        if (usersResponse.success && usersResponse.users) {
          const usersExcludingSelf = usersResponse.users.filter(
            (username: string) => username !== user?.username
          );

          const users = await Promise.all(
            usersExcludingSelf.map(async (username: string) => ({
              username,
              profileImage: await fetchProfileImage(username),
            }))
          );
          console.log('[NEW CHAT] Users:', users);

          setUsers(users);
          setFilteredUsers(users);
        } else {
          console.error('Error fetching users:', usersResponse.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const performSearch = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(trimmedQuery)
    );
    setFilteredUsers(filtered);
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query);
    }, 300),
    [users]
  );

  useEffect(() => {
    debouncedSearch(usernameSearched);
    return debouncedSearch.cancel;
  }, [usernameSearched, debouncedSearch]);

  const generateChatID = (user1: string, user2: string): string => {
    const sortedUserIDs = [user1, user2].sort();
    return `${sortedUserIDs[0].replace(/[\.\#\$\/\[\]]/g, '_')}_${sortedUserIDs[1].replace(/[\.\#\$\/\[\]]/g, '_')}`;
  };

  const handleChatPress = (item: User): void => {
    const chatID = generateChatID(user.username, item.username);
    const chat = ref(db, `chats/${chatID}`);

    get(chat).then((snapshot) => {
      if (snapshot.exists()) {
        const chatRef = ref(db, `chats/${chatID}/messages`);
        const messageQuery = query(chatRef, orderByChild('timestamp'), limitToLast(20));

        get(messageQuery).then((snapshot) => {
          const userSender = user.username;
          const userReceiver = item.username;
          const messages = snapshot.exists() ? Object.values(snapshot.val()) : [];
          router.push({
            pathname: 'specificChat',
            params: {
              chatID,
              email_sender: userSender,
              email_receiver: userReceiver,
              fromNotification: false,
            },
          });
        }).catch(console.error);
      } else {
        const currentTimestamp = serverTimestamp();
        set(chat, {
          chatID,
          user1Email: user.username,
          user2Email: item.username,
          user1Username: user.username,
          user2Username: item.username,
          timestamp: currentTimestamp,
          messages: [],
        }).then(() => {
          router.push({
            pathname: 'specificChat',
            params: {
              chatID,
              email_sender: user.username,
              email_receiver: item.username,
              fromNotification: false,
            },
          });
        }).catch(console.error);
      }
    }).catch(console.error);
  };

  const handleSearchButtonFunction = async (): Promise<void> => {
    Keyboard.dismiss();
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderUser: ListRenderItem<User> = ({ item }) => (
    <Pressable onPress={() => handleChatPress(item)}>
      <View style={styles.userContainer}>
        <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        <Text style={styles.username}>@{item.username}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Crear un nuevo Chat</Text>

      {/* Contenedor de encabezado con el botón de retroceso y la barra de búsqueda */}
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Entypo name="chevron-left" size={24} color="#FFFFFF" />
        </Pressable>
        <SearchBar
          searchText={usernameSearched}
          setSearchText={setUsernameSearched}
          handleSearchButton={handleSearchButtonFunction}
          containerStyle={styles.searchBar}
        />
      </View>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.username}
          renderItem={renderUser}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noUsersContainer}>
          <Text style={styles.noUsersText}>No users found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1, // Permite que la barra de búsqueda ocupe el espacio restante
  },
  listContent: {
    paddingTop: 10,
    marginTop: -10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#1DA1F2',
  },
  username: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  noUsersContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  noUsersText: {
    fontSize: 16,
    color: '#BBBBBB',
  },
  loadingText: {
    fontSize: 16,
    color: '#BBBBBB',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NewChat;
