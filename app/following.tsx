import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/backButton';
import styles from '../styles/followList';
import { getFollowed } from '@/handlers/followHandler';
import UserList from '@/components/userList';
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

export default function Following() {
    const router = useRouter();
    const { username } = useLocalSearchParams();
    const [following, setFollowing] = useState<User[]>([]);
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
        const fetchFollowing = async () => {
            setIsLoading(true);
            try {
                const response = await getFollowed(username as string);
                if (response.success) {
                    const followedUsers = await Promise.all((response.followed || []).map(async (user: any) => ({
                        id: user.id,
                        username: user,
                        name: user.name,
                        surname: user.surname,
                        profile_picture: await fetchProfileImage(user.username),
                    })));
                    setFollowing(followedUsers);
                } else {
                    console.log('Error al obtener seguidos:', response.error);
                }
            } catch (error) {
                    console.log('Error al obtener seguidos:', response.error);
            }
            setIsLoading(false);
        };

        if (username) {
            fetchFollowing();
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
                    @{displayUsername} <Text style={styles.subtitle}>Siguiendo a</Text>

                </Text>
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#1DA1F2" />
            ) : following.length > 0 ? (
                <UserList users={following} onUserPress={handleUserPress} />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No existen usuarios seguidos.</Text>
                </View>
            )}
        </ScrollView>
    );
}
