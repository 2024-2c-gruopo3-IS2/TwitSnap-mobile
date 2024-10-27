// followers.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/backButton';
import styles from '../styles/followList';
import { getFollowers } from '@/handlers/followHandler';
import UserList from '@/components/userList'; // Asegúrate de que la ruta sea correcta
import {AuthContext} from '@/context/authContext';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebaseConfig';
interface User {
    id: string;
    username: string;
    name: string;
    surname: string;
    profile_picture: string;
}

export default function Followers() {
    const router = useRouter();
    const { username } = useLocalSearchParams();
    const [followers, setFollowers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const displayUsername = user?.username === username ? user.username : username;

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
        const fetchFollowers = async () => {
            setIsLoading(true);
            try {
                const response = await getFollowers(username as string);
                console.log('Response follow:', response);
                if (response.success) {
                    const followersUsers = await Promise.all(
                        (response.followers || []).map(async (user: any) => ({
                            id: '',
                            username: user,
                            name: '',
                            surname: '',
                            profile_picture: await fetchProfileImage(user),
                        }))
                    );
                    console.log('Followers:', followersUsers);
                    setFollowers(followersUsers);
                } else {
                    Alert.alert('Error', response.message || 'No se pudieron obtener los seguidores.');
                }
            } catch (error) {
                Alert.alert('Error', 'Ocurrió un error al obtener los seguidores.');
                console.error('Error al obtener seguidores:', error);
            }
            setIsLoading(false);
        };

        if (username) {
            fetchFollowers();
        }
    }, [username]);

    const handleUserPress = (username: string) => {
        router.push(`/profileView?username=${encodeURIComponent(username)}`);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <BackButton />
                <Text style={styles.headerTitle}>
                   <Text style={styles.subtitle}>Seguidores de</Text> @{displayUsername}
                </Text>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#1DA1F2" />
            ) : followers.length > 0 ? (
                <UserList users={followers} onUserPress={handleUserPress} />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No existen seguidores.</Text>
                </View>
            )}
        </ScrollView>
    );
}
