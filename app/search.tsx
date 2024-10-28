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
  Image, // Add Image import
} from 'react-native';
import { getAllUsers } from '@/handlers/profileHandler';
import { getUnblockedSnaps, getFavouriteSnaps, likeSnap, favouriteSnap, unlikeSnap, unfavouriteSnap, getLikedSnaps } from '@/handlers/postHandler'; // Asegúrate de tener estas funciones
import BackButton from '../components/backButton';
import { useRouter } from 'expo-router';
import debounce from 'lodash.debounce';
import Footer from '@/components/footer';
import { usePostContext } from '../context/postContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SnapItem from '../components/snapItem';
import { AuthContext } from '@/context/authContext';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebaseConfig';

interface User{
  username: string;
  profileImage: string;
}

interface Snap {
  id: string;
  username: string;
  time: string;
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
  const { addNewPost } = usePostContext();
  const router = useRouter();
  const [isUsersExpanded, setIsUsersExpanded] = useState(true);
  const [isTwitSnapsExpanded, setIsTwitSnapsExpanded] = useState(true);
  const [filteredHashtags, setFilteredHashtags] = useState<any[]>([]);
  const [isHashtagsExpanded, setIsHashtagsExpanded] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useContext(AuthContext);

  console.log("[SEARCH]User", user);

  // Habilitar LayoutAnimation en Android
  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const fetchProfileImage = async (username: string) => {
    try {
      console.log("\n\nfetching", `profile_photos/${username}.png`)
      const imageRef = ref(storage, `profile_photos/${username}.png`);
      console.log("imageRef", imageRef)
      const url = await getDownloadURL(imageRef);
      console.log("url", url)

      return url;
    } catch (error) {
      return 'https://via.placeholder.com/150';
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realizar llamadas a la API en paralelo
        const [usersResponse, twitSnapsResponse, likedResponse, favouritedResponse] = await Promise.all([
          getAllUsers(),
          getUnblockedSnaps(),
          getLikedSnaps(),
          getFavouriteSnaps(),
        ]);

        if (usersResponse.success && usersResponse.users) {
          // Excluir al usuario autenticado de los resultados
          const usersExcludingSelf = usersResponse.users.filter(
            (username: string) => username !== user?.username
          );

          const users = await Promise.all(usersExcludingSelf.map(async (username: string) => ({
            username,
            profileImage: await fetchProfileImage(username),
          })));

          setUsers(users);
          setFilteredUsers(users);
        } else {
          console.error('Error al obtener los usuarios:', usersResponse.message);
        }

        if (twitSnapsResponse.success && twitSnapsResponse.snaps) {
          const likedSnapIds = likedResponse.success
            ? new Set((likedResponse.snaps ?? []).map((snap: any) => snap.id))
            : new Set();

          const favouritedSnapIds = favouritedResponse.success
               ? new Set(favouritedResponse.snaps?.map((snap: any) => snap.id) ?? [])
               : new Set();

          // Mapear Snaps y establecer los campos necesarios
          const mappedTwitSnaps: Snap[] = await Promise.all(twitSnapsResponse.snaps.map(async (snap: any) => ({
            id: snap._id, // Mapea _id a id
            username: snap.username,
            time: snap.time,
            message: snap.message,
            isPrivate: snap.isPrivate === 'true',
            likes: snap.likes || 0,
            likedByUser: likedSnapIds.has(snap._id),
            canViewLikes: true,
            favouritedByUser: favouritedSnapIds.has(snap._id),
            profileImage: await fetchProfileImage(snap.username), // Add profileImage
          })));

          setTwitSnaps(mappedTwitSnaps);
          setFilteredTwitSnaps(mappedTwitSnaps);
        }
        else {
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
      // Búsqueda por hashtag
      const hashtag = trimmedQuery.slice(1); // Eliminar el '#'
      const filteredT = twitSnaps.filter((twitSnap) =>
        twitSnap.message.toLowerCase().includes(`#${hashtag}`)
      );
      setFilteredTwitSnaps(filteredT);

      // LOG: Verificar los TwitSnaps filtrados por hashtag
      console.log('Filtered TwitSnaps by Hashtag:', filteredT);
    } else {
      // Búsqueda sin hashtag: ignorar los TwitSnaps que contienen hashtags
      const filteredT = twitSnaps.filter((twitSnap) => {
        const messageWithoutHashtags = twitSnap.message.replace(/#[\w]+/g, '').toLowerCase();
        return messageWithoutHashtags.includes(trimmedQuery);
      });

      const filteredU = users
        .filter((user) => user.username.toLowerCase().includes(trimmedQuery))
        .filter((user2) => user2.username !== user?.username);
      setFilteredUsers(filteredU);
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
    console.log(`Handling Like for snap ID: ${id}, currently liked: ${likedByUser}`);

    // Actualización optimista
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

    try {
      let response;
      if (likedByUser) {
        // Realizar "unlike"
        response = await unlikeSnap(id);
      } else {
        // Realizar "like"
        response = await likeSnap(id);
      }

      if (!response.success) {
        // Revertir la actualización optimista en caso de fallo
        setTwitSnaps((prevSnaps) =>
          prevSnaps.map((snap) =>
            snap.id === id
              ? {
                  ...snap,
                  likes: likedByUser ? snap.likes + 1 : snap.likes - 1,
                  likedByUser: likedByUser, // Revertir al estado original
                }
              : snap
          )
        );
        setFilteredTwitSnaps((prevSnaps) =>
          prevSnaps.map((snap) =>
            snap.id === id
              ? {
                  ...snap,
                  likes: likedByUser ? snap.likes + 1 : snap.likes - 1,
                  likedByUser: likedByUser,
                }
              : snap
          )
        );
        console.error('Error al dar Me Gusta/Unlike:', response.message);
        // Opcional: Mostrar una notificación al usuario
      }
    } catch (error) {
      // Revertir la actualización optimista en caso de error
      setTwitSnaps((prevSnaps) =>
        prevSnaps.map((snap) =>
          snap.id === id
            ? {
                ...snap,
                likes: likedByUser ? snap.likes + 1 : snap.likes - 1,
                likedByUser: likedByUser,
              }
            : snap
        )
      );
      setFilteredTwitSnaps((prevSnaps) =>
        prevSnaps.map((snap) =>
          snap.id === id
            ? {
                ...snap,
                likes: likedByUser ? snap.likes + 1 : snap.likes - 1,
                likedByUser: likedByUser,
              }
            : snap
        )
      );
      console.error('Error al dar Me Gusta/Unlike:', error);
      // Opcional: Mostrar una notificación al usuario
    }
  };

const handleFavourite = async (id: string, favouritedByUser: boolean) => {
  console.log(`Handling Favourite for snap ID: ${id}, currently favourited: ${favouritedByUser}`);

  // Actualización optimista
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

  try {
    let response;
    if (favouritedByUser) {
      // Realizar "unfavourite"
      response = await unfavouriteSnap(id);
    } else {
      // Realizar "favourite"
      response = await favouriteSnap(id);
    }

    if (!response.success) {
      // Revertir la actualización optimista en caso de fallo
      setTwitSnaps((prevSnaps) =>
        prevSnaps.map((snap) =>
          snap.id === id
            ? {
                ...snap,
                favouritedByUser: favouritedByUser,
              }
            : snap
        )
      );
      setFilteredTwitSnaps((prevSnaps) =>
        prevSnaps.map((snap) =>
          snap.id === id
            ? {
                ...snap,
                favouritedByUser: favouritedByUser,
              }
            : snap
        )
      );
      console.error('Error al dar Favorito/Unfavourite:', response.message);
      // Opcional: Mostrar una notificación al usuario
    }
  } catch (error) {
    // Revertir la actualización optimista en caso de error
    setTwitSnaps((prevSnaps) =>
      prevSnaps.map((snap) =>
        snap.id === id
          ? {
              ...snap,
              favouritedByUser: favouritedByUser,
            }
          : snap
      )
    );
    setFilteredTwitSnaps((prevSnaps) =>
      prevSnaps.map((snap) =>
        snap.id === id
          ? {
              ...snap,
              favouritedByUser: favouritedByUser,
            }
          : snap
      )
    );
    console.error('Error al dar Favorito/Unfavourite:', error);
    // Opcional: Mostrar una notificación al usuario
  }
};


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
          <Image
          source={{ uri: item.profileImage }}
          style={styles.profileImageOnFeed}
          />
          <Text style={styles.username}>@{item.username}</Text>
      </View>
    </Pressable>
  );

  const renderTwitSnapItem = ({ item }: { item: Snap }) => {
    console.log("Rendering TwitSnap with ID:", item.id); // Verificar el ID
    return (
      <SnapItem
        snap={item}
        onLike={() => handleLike(item.id, item.likedByUser)}
        onFavourite={() => handleFavourite(item.id, item.favouritedByUser)}
        isOwnProfile={false}
        likeIconColor={item.likedByUser ? 'red' : 'gray'}
        favouriteIconColor={item.favouritedByUser ? 'yellow' : 'gray'}
      />
    );
  };

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
            <View style={styles.section}>
              {/* El encabezado de TwitSnaps siempre se mostrará */}
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

              {/* Mostrar la lista de TwitSnaps o el mensaje "No hay snaps disponibles" */}
              {isTwitSnapsExpanded && (
                <View>
                  {filteredTwitSnaps.length > 0 ? (
                    <FlatList
                      data={filteredTwitSnaps}
                      keyExtractor={(item) => `twitSnap-${item.id}`}
                      renderItem={renderTwitSnapItem}
                      keyboardShouldPersistTaps="handled"
                      // Opcional: optimizar la renderización
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
