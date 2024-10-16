// following.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/backButton';
import styles from '../styles/followList';
import { getFollowed } from '@/handlers/followHandler';
import UserList from '@/components/userList'; // Asegúrate de que la ruta sea correcta

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

    useEffect(() => {
        const fetchFollowing = async () => {
            setIsLoading(true);
            try {
                const response = await getFollowed(username as string);
                if (response.success) {
                    setFollowing(response.followed || []);
                } else {
                    Alert.alert('Error', response.message || 'No se pudieron obtener los seguidos.');
                }
            } catch (error) {
                Alert.alert('Error', 'Ocurrió un error al obtener los seguidos.');
                console.error('Error al obtener seguidos:', error);
            }
            setIsLoading(false);
        };

        if (username) {
            fetchFollowing();
        }
    }, [username]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <BackButton />
                <Text style={styles.headerTitle}>Siguiendo</Text>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#1DA1F2" />
            ) : following.length > 0 ? (
                <UserList users={following} />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No sigues a nadie.</Text>
                </View>
            )}
        </ScrollView>
    );
}
