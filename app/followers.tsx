// followers.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/backButton';
import styles from '../styles/followList';
import { getFollowers } from '@/handlers/followHandler';
import UserList from '@/components/userList'; // Asegúrate de que la ruta sea correcta
import {AuthContext} from '@/context/authContext';
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

    useEffect(() => {
        const fetchFollowers = async () => {
            setIsLoading(true);
            try {
                const response = await getFollowers(username as string);
                console.log('Response follow:', response);
                if (response.success) {
                    const followersUsers = (response.followers || []).map((user: any) => ({
                        id: '',
                        username: user,
                        name: '',
                        surname: '',
                        profile_picture: '',
                    }));
                    console.log('Followers:', followersUsers);
                    setFollowers(followersUsers);
                } else {
                    console.log('Error al obtener seguidores:', response.error);
                }
            } catch (error) {
                console.log('Error al obtener seguidores:', error);
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
