// search.tsx

import styles from '../styles/search';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
  Image,
} from 'react-native';
import { getAllUsers } from '@/handlers/profileHandler';
import {
  getUnblockedSnaps,
  getFavouriteSnaps,
  getLikedSnaps,
} from '@/handlers/postHandler';
import BackButton from '../components/backButton';
import { useRouter } from 'expo-router';
import debounce from 'lodash.debounce';
import Footer from '@/components/footer';
import SnapItem from '../components/snapItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '@/context/authContext';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebaseConfig';

interface User {
  username: string;
  profileImage: string;
}

interface Snap {
  id: string;
  username: string;
  created_at: string;
  message: string;
  isPrivate: boolean;
  likes: number;
  likedByUser: boolean;
  canViewLikes: boolean;
  favouritedByUser: boolean;
  profileImage: string;
}

export default function SearchUsersAndTwitSnaps() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [twitSnaps, setTwitSnaps] = useState<Snap[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredTwitSnaps, setFilteredTwitSnaps] = useState<Snap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isUsersExpanded, setIsUsersExpanded] = useState(true);
  const [isTwitSnapsExpanded, setIsTwitSnapsExpanded] = useState(true);
  const { user } = useContext(AuthContext);
  const currentUsername = user?.username || '';

  // Habilitar LayoutAnimation en Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const handleSearchPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    performSearch(searchQuery);
  }


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
    const fetchData = async () => {
      try {
        const [usersResponse, twitSnapsResponse, likedResponse, favouritedResponse] = await Promise.all([
          getAllUsers(),
          getUnblockedSnaps(),
          getLikedSnaps(),
          getFavouriteSnaps(),
        ]);

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

          setUsers(users);
          setFilteredUsers(users);
        } else {
          console.error('Error al obtener los usuarios:', usersResponse.message);
        }

        if (twitSnapsResponse.success && twitSnapsResponse.snaps) {
          const likedSnapIds = new Set((likedResponse.snaps ?? []).map((snap: any) => snap.id));
          const favouritedSnapIds = new Set((favouritedResponse.snaps ?? []).map((snap: any) => snap.id));

          const mappedTwitSnaps: Snap[] = await Promise.all(
            twitSnapsResponse.snaps.map(async (snap: any) => ({
              id: snap._id,
              username: snap.username,
              created_at: snap.created_at,
              message: snap.message,
              isPrivate: snap.isPrivate === 'true',
              likes: snap.likes || 0,
              likedByUser: likedSnapIds.has(snap._id),
              canViewLikes: true,
              favouritedByUser: favouritedSnapIds.has(snap._id),
              profileImage: await fetchProfileImage(snap.username),
            }))
          );

          setTwitSnaps(mappedTwitSnaps);
          setFilteredTwitSnaps(mappedTwitSnaps);
        } else {
          console.error('Error al obtener los TwitSnaps:', twitSnapsResponse.message);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const performSearch = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();

    if (trimmedQuery.startsWith('#')) {
      const hashtag = trimmedQuery.slice(1);
      setFilteredTwitSnaps(
        twitSnaps.filter((twitSnap) =>
          twitSnap.message.toLowerCase().includes(`#${hashtag}`)
        )
      );
    } else {
      const filteredT = twitSnaps.filter((twitSnap) => {
        const messageWithoutHashtags = twitSnap.message.replace(/#[\w]+/g, '').toLowerCase();
        return messageWithoutHashtags.includes(trimmedQuery);
      });

      const filteredU = users.filter((user) =>
        user.username.toLowerCase().includes(trimmedQuery)
      );
      setFilteredUsers(filteredU);
      setFilteredTwitSnaps(filteredT);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query);
    }, 300),
    [users, twitSnaps]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return debouncedSearch.cancel;
  }, [searchQuery, debouncedSearch]);

  const renderUserItem = ({ item }: { item: User }) => (
    <Pressable
      style={styles.userContainer}
      onPress={() =>
        router.push({
          pathname: '/profileView',
          params: { username: item.username },
        })
      }
    >
      <View style={styles.userInfo}>
        <Image source={{ uri: item.profileImage }} style={styles.profileImageOnFeed} />
        <Text style={styles.username}>@{item.username}</Text>
      </View>
    </Pressable>
  );

  const renderTwitSnapItem = ({ item }: { item: Snap }) => (
    <SnapItem
      snap={item}
      isOwnProfile={false}
      likeIconColor={item.likedByUser ? 'red' : 'gray'}
      favouriteIconColor={item.favouritedByUser ? 'yellow' : 'gray'}
      shareIconColor={item.isShared ? 'green' : 'gray'}
      currentUsername={currentUsername}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  const noResults = filteredUsers.length === 0 && filteredTwitSnaps.length === 0;

  const toggleUsersSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsUsersExpanded(!isUsersExpanded);
  };

  const toggleTwitSnapsSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsTwitSnapsExpanded(!isTwitSnapsExpanded);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <BackButton />
          <TextInput
            style={styles.searchInput}
            placeholder="Ingrese un texto a buscar"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleSearchPress}
            returnKeyType="search"
          />
          <Pressable onPress={handleSearchPress} style={styles.searchButton}>
            <Icon name="search" size={24} color="#1DA1F2" />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        {noResults ? (
          <Text style={styles.noResultsText}>
            No se encontraron resultados para tu búsqueda.
          </Text>
        ) : (
          <>
            {filteredUsers.length > 0 && (
              <View style={styles.section}>
                <Pressable
                  style={styles.sectionHeaderPressable}
                  onPress={toggleUsersSection}
                >
                  <View style={styles.sectionHeader}>
                    <Icon name="person" size={20} color="#1DA1F2" style={styles.sectionIcon} />
                    <Text style={styles.sectionTitle}>Usuarios</Text>
                  </View>
                  <Icon
                    name={isUsersExpanded ? 'expand-less' : 'expand-more'}
                    size={24}
                    color="#1DA1F2"
                  />
                </Pressable>
                {isUsersExpanded && (
                  <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.username}
                    renderItem={renderUserItem}
                    keyboardShouldPersistTaps="handled"
                  />
                )}
              </View>
            )}

            <View style={styles.section}>
              <Pressable style={styles.sectionHeaderPressable} onPress={toggleTwitSnapsSection}>
                <View style={styles.sectionHeader}>
                  <Icon name="photo-camera" size={20} color="#1DA1F2" style={styles.sectionIcon} />
                  <Text style={styles.sectionTitle}>TwitSnaps</Text>
                </View>
                <Icon name={isTwitSnapsExpanded ? 'expand-less' : 'expand-more'} size={24} color="#1DA1F2" />
              </Pressable>

              {isTwitSnapsExpanded && (
                <View>
                  {filteredTwitSnaps.length > 0 ? (
                    <FlatList
                      data={filteredTwitSnaps}
                      keyExtractor={(item) => item.id}
                      renderItem={renderTwitSnapItem}
                      keyboardShouldPersistTaps="handled"
                      initialNumToRender={10}
                      maxToRenderPerBatch={10}
                      windowSize={21}
                    />
                  ) : (
                    <View style={styles.noSnapsContainer}>
                      <Text style={styles.noSnapsText}>No hay snaps disponibles</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </>
        )}
      </View>

      <Footer />
    </View>
  );
}
