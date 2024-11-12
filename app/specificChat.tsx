import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Keyboard, Text, ListRenderItem, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ref, get, set, serverTimestamp, query, orderByChild, limitToLast } from 'firebase/database';
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
  const { loggedInUser } = useContext(AuthContext);

  const [usernameSearched, setUsernameSearched] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileImage = async (username: string) => {
    try {
      const imageRef = ref(storage, `profile_photos/${username}.png`);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      return 'https://via.placeholder.com/150';
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('YOUR_API_ENDPOINT');
        if (!response.ok) {
          throw new Error('Error connecting to the server.');
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response.');
        }
        const usersResponse = await response.json();
        if (usersResponse.success && usersResponse.users) {
          const usersExcludingSelf = usersResponse.users.filter(
            (user: User) => user.username !== loggedInUser.username
          );

          const users = await Promise.all(
            usersExcludingSelf.map(async (user: User) => ({
              ...user,
              profileImage: await fetchProfileImage(user.username),
            }))
          );

          setUsers(users);
          setFilteredUsers(users);
        } else {
          console.error('Error fetching users:', usersResponse.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

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
    const chatID = generateChatID(loggedInUser.email, item.username);
    const chat = ref(db, `chats/${chatID}`);

    get(chat).then((snapshot) => {
      if (snapshot.exists()) {
        const chatRef = ref(db, `chats/${chatID}/messages`);
        const messageQuery = query(chatRef, orderByChild('timestamp'), limitToLast(20));

        get(messageQuery).then((snapshot) => {
          const userSender = loggedInUser.email;
          const userReceiver = item.username;
          const messages = snapshot.exists() ? Object.values(snapshot.val()) : [];
          router.push({
            pathname: 'specificChat',
            params: {
              chatID,
              userSender,
              userReceiver,
              messages,
            },
          });
        }).catch(console.error);
      } else {
        const currentTimestamp = serverTimestamp();
        set(chat, {
          chatID,
          user1Email: loggedInUser.email,
          user2Email: item.username,
          user1Username: loggedInUser.name,
          user2Username: item.username,
          timestamp: currentTimestamp,
          messages: [],
        }).then(() => {
          router.push({
            pathname: 'specificChat',
            params: {
              chatID,
              userSender: loggedInUser.email,
              userReceiver: item.username,
              messages: [],
            },
          });
        }).catch(console.error);
      }
    }).catch(console.error);
  };

  const handleSearchButtonFunction = async (): Promise<void> => {
    Keyboard.dismiss();
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
      <SearchBar
        searchText={usernameSearched}
        setSearchText={setUsernameSearched}
        handleSearchButton={handleSearchButtonFunction}
      />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.username}
          renderItem={renderUser}
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
    backgroundColor: '#f0f0f0',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
  noUsersContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  noUsersText: {
    fontSize: 16,
    color: '#888',
  },
});

export default NewChat;