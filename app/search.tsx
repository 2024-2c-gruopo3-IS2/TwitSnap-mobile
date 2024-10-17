// search.tsx

import styles from '../styles/search';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { getAllUsers } from '@/handlers/profileHandler';
import { getAllSnaps, likeSnap, favouriteSnap, unlikeSnap, unfavouriteSnap } from '@/handlers/postHandler'; // Asegúrate de tener estas funciones
import BackButton from '../components/backButton';
import { useRouter } from 'expo-router';

import debounce from 'lodash.debounce';
import Footer from '@/components/footer';
import { usePostContext } from '../context/postContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SnapItem from '../components/snapItem'; // Asegúrate de la ruta correcta

export default function SearchUsersAndTwitSnaps() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [twitSnaps, setTwitSnaps] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [filteredTwitSnaps, setFilteredTwitSnaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNewPost } = usePostContext();
  const router = useRouter();
  const [isUsersExpanded, setIsUsersExpanded] = useState(true);
  const [isTwitSnapsExpanded, setIsTwitSnapsExpanded] = useState(true);
  const [filteredHashtags, setFilteredHashtags] = useState<any[]>([]);
  const [isHashtagsExpanded, setIsHashtagsExpanded] = useState(true);


  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, twitSnapsResponse] = await Promise.all([
          getAllUsers(),
          getAllSnaps(),
        ]);

        if (usersResponse.success && usersResponse.users) {
          setUsers(usersResponse.users);
          setFilteredUsers(usersResponse.users);
        } else {
          console.error('Error al obtener los usuarios:', usersResponse.message);
        }

        if (twitSnapsResponse.success && twitSnapsResponse.snaps) {
          setTwitSnaps(twitSnapsResponse.snaps);
          setFilteredTwitSnaps(twitSnapsResponse.snaps);
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
  }, []);

  const performSearch = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();

    if (trimmedQuery.startsWith('#')) {
      // Búsqueda por hashtag
      const hashtag = trimmedQuery.slice(1); // Eliminar el '#'
      const filteredH = twitSnaps.filter((twitSnap) =>
        twitSnap.message.toLowerCase().includes(`#${hashtag}`)
      );
      setFilteredHashtags(filteredH);
    } else {
      setFilteredHashtags([]);
    }

    if (trimmedQuery === '') {
      setFilteredUsers(users);
      setFilteredTwitSnaps(twitSnaps);
    } else {
      // Filtrar usuarios
      const filteredU = users.filter((username) =>
        username.toLowerCase().includes(trimmedQuery)
      );
      setFilteredUsers(filteredU);

      // Filtrar TwitSnaps
      const filteredT = twitSnaps.filter((twitSnap) =>
        twitSnap.message.toLowerCase().includes(trimmedQuery)
      );
      setFilteredTwitSnaps(filteredT);
    }
  };

  // Debounce para búsquedas automáticas al escribir (opcional)
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query);
    }, 300),
    [users, twitSnaps]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    // Cancel the debounce on useEffect cleanup.
    return debouncedSearch.cancel;
  }, [searchQuery, debouncedSearch]);

  const handleSearchPress = () => {
    debouncedSearch.cancel(); // Cancel any pending debounce
    performSearch(searchQuery);
  };

  // Handlers para "Me Gusta" y "Favorito"
  const handleLike = async (id: string, likedByUser: boolean) => {
    try {
      let response;
      if (likedByUser) {
        // Realizar "unlike"
        response = await unlikeSnap(id);
      } else {
        // Realizar "like"
        response = await likeSnap(id);
      }

      if (response.success) {
        setTwitSnaps((prevSnaps) =>
          prevSnaps.map((snap) =>
            snap.id === id
              ? {
                ...snap,
                likes: likedByUser ? snap.likes - 1 : snap.likes + 1,
                likedByUser: !likedByUser,
              }
              : snap
          )
        );
        setFilteredTwitSnaps((prevSnaps) =>
          prevSnaps.map((snap) =>
            snap.id === id
              ? {
                ...snap,
                likes: likedByUser ? snap.likes - 1 : snap.likes + 1,
                likedByUser: !likedByUser,
              }
              : snap
          )
        );
      } else {
        console.error('Error al dar Me Gusta/Unlike:', response.message);
      }
    } catch (error) {
      console.error('Error al dar Me Gusta/Unlike:', error);
    }
  };

  const handleFavourite = async (id: string, favouritedByUser: boolean) => {
    try {
      let response;
      if (favouritedByUser) {
        // Realizar "unfavourite"
        response = await unfavouriteSnap(id);
      } else {
        // Realizar "favourite"
        response = await favouriteSnap(id);
      }

      if (response.success) {
        setTwitSnaps((prevSnaps) =>
          prevSnaps.map((snap) =>
            snap.id === id
              ? {
                ...snap,
                favouritedByUser: !favouritedByUser,
              }
              : snap
          )
        );
        setFilteredTwitSnaps((prevSnaps) =>
          prevSnaps.map((snap) =>
            snap.id === id
              ? {
                ...snap,
                favouritedByUser: !favouritedByUser,
              }
              : snap
          )
        );
      } else {
        console.error('Error al dar Favorito/Unfavourite:', response.message);
      }
    } catch (error) {
      console.error('Error al dar Favorito/Unfavourite:', error);
    }
  };

  const renderUserItem = ({ item }: { item: string }) => (
    <Pressable
      style={styles.userContainer}
      onPress={() =>
        router.push({
          pathname: '/profileView',
          params: { username: item },
        })
      }
    >
      <Text style={styles.username}>@{item}</Text>
    </Pressable>
  );

  const renderTwitSnapItem = ({ item }: { item: any }) => (
    <SnapItem
      snap={{
        id: item.id,
        username: item.username,
        time: item.time,
        message: item.message,
        isPrivate: item.isPrivate,
        likes: item.likes,
        likedByUser: item.likedByUser,
        canViewLikes: item.canViewLikes,
        favouritedByUser: item.favouritedByUser,
      }}
      onLike={() => handleLike(item.id, item.likedByUser)}
      onFavourite={() => handleFavourite(item.id, item.favouritedByUser)}
      isOwnProfile={false}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  const noResults = filteredUsers.length === 0 && filteredTwitSnaps.length === 0 && filteredHashtags.length === 0;

  // Funciones para alternar la expansión de las secciones
  const toggleUsersSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsUsersExpanded(!isUsersExpanded);
  };

  const toggleTwitSnapsSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsTwitSnapsExpanded(!isTwitSnapsExpanded);
  };

  const toggleHashtagsSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsHashtagsExpanded(!isHashtagsExpanded);
  };

  const renderHashtagItem = ({ item }: { item: any }) => (
    <SnapItem
      snap={{
        id: item.id,
        username: item.username,
        time: item.time,
        message: item.message,
        isPrivate: item.isPrivate,
        likes: item.likes,
        likedByUser: item.likedByUser,
        canViewLikes: item.canViewLikes,
        favouritedByUser: item.favouritedByUser,
      }}
      onLike={() => handleLike(item.id, item.likedByUser)}
      onFavourite={() => handleFavourite(item.id, item.favouritedByUser)}
      isOwnProfile={false}
    />
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <BackButton />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuarios, snaps o hashtags"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleSearchPress} // Permite buscar al presionar "Enter"
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
            {/* Sección de Usuarios */}
            {filteredUsers.length > 0 && (
              <View style={styles.section}>
                <Pressable
                  style={styles.sectionHeaderPressable}
                  onPress={toggleUsersSection}
                >
                  <View style={styles.sectionHeader}>
                    <Icon
                      name="person"
                      size={20}
                      color="#1DA1F2"
                      style={styles.sectionIcon}
                    />
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
                    keyExtractor={(item, index) => `user-${item}-${index}`}
                    renderItem={renderUserItem}
                    keyboardShouldPersistTaps="handled"
                  />
                )}
              </View>
            )}

            {/* Sección de TwitSnaps */}
            {filteredTwitSnaps.length > 0 && (
              <View style={styles.section}>
                <Pressable
                  style={styles.sectionHeaderPressable}
                  onPress={toggleTwitSnapsSection}
                >
                  <View style={styles.sectionHeader}>
                    <Icon
                      name="photo-camera"
                      size={20}
                      color="#1DA1F2"
                      style={styles.sectionIcon}
                    />
                    <Text style={styles.sectionTitle}>TwitSnaps</Text>
                  </View>
                  <Icon
                    name={isTwitSnapsExpanded ? 'expand-less' : 'expand-more'}
                    size={24}
                    color="#1DA1F2"
                  />
                </Pressable>
                {isTwitSnapsExpanded && (
                  <FlatList
                    data={filteredTwitSnaps}
                    keyExtractor={(item) => `twitSnap-${item.id}`}
                    renderItem={renderTwitSnapItem}
                    keyboardShouldPersistTaps="handled"
                  />
                )}
              </View>
            )}

            {/* Sección de Hashtags */}
            {filteredHashtags.length > 0 && (
              <View style={styles.section}>
                <Pressable
                  style={styles.sectionHeaderPressable}
                  onPress={toggleHashtagsSection}
                >
                  <View style={styles.sectionHeader}>
                    <Icon
                      name="local-offer" // Ícono adecuado para hashtags
                      size={20}
                      color="#1DA1F2"
                      style={styles.sectionIcon}
                    />
                    <Text style={styles.sectionTitle}>Hashtags</Text>
                  </View>
                  <Icon
                    name={isHashtagsExpanded ? 'expand-less' : 'expand-more'}
                    size={24}
                    color="#1DA1F2"
                  />
                </Pressable>
                {isHashtagsExpanded && (
                  <FlatList
                    data={filteredHashtags}
                    keyExtractor={(item) => `hashtag-${item.id}`}
                    renderItem={renderHashtagItem}
                    keyboardShouldPersistTaps="handled"
                  />
                )}
              </View>
            )}
          </>
        )}
      </View>

      <Footer />
    </View>
  );
}