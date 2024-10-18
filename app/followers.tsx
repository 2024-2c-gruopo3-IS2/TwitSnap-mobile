// followers.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/backButton';
import styles from '../styles/followList';
import { getFollowers } from '@/handlers/followHandler';
import UserList from '@/components/userList'; // Asegúrate de que la ruta sea correcta

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

    useEffect(() => {
        const fetchFollowers = async () => {
            setIsLoading(true);
            try {
                const response = await getFollowers(username as string);
                if (response.success) {
                    const followersUsers = (response.followers || []).map((user: any) => ({
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        surname: user.surname,
                        profile_picture: user.profile_picture,
                    }));
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
                <Text style={styles.headerTitle}>Seguidores</Text>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#1DA1F2" />
            ) : followers.length > 0 ? (
                <UserList users={followers} onUserPress={handleUserPress} />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No tienes seguidores.</Text>
                </View>
            )}
        </ScrollView>
    );
}
