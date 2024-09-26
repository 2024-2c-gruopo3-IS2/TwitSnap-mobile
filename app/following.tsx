// following.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/backButton';
import styles from '../styles/followList';
// import { getFollowing } from '@/handlers/followHandler';
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
    const [canViewList, setCanViewList] = useState(false); // Estado para simular la verificación de privacidad

    useEffect(() => {
        const fetchFollowing = async () => {
            setIsLoading(true);

            // Simulación de verificación de privacidad
            const checkPrivacy = () => {
                // Puedes cambiar este valor para probar diferentes escenarios
                setCanViewList(true); // Cambia a 'false' para simular que no tienes acceso
            };

            checkPrivacy();

            if (canViewList) {
                // Simulación de datos de usuarios que sigues
                // const response = await getFollowing(username as string);
                const response = {
                    success: true,
                    following: [
                        {
                            id: '3',
                            username: 'usuario3',
                            name: 'Nombre3',
                            surname: 'Apellido3',
                            profile_picture: 'https://via.placeholder.com/100',
                        },
                        {
                            id: '4',
                            username: 'usuario4',
                            name: 'Nombre4',
                            surname: 'Apellido4',
                            profile_picture: 'https://via.placeholder.com/100',
                        },
                        // Agrega más usuarios simulados si es necesario
                    ],
                };

                if (response.success) {
                    setFollowing(response.following);
                } else {
                    Alert.alert('Error', 'No se pudieron obtener los seguidos.');
                }
            }

            setIsLoading(false);
        };

        if (username) {
            fetchFollowing();
        }
    }, [username, canViewList]);

    if (!canViewList) {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <BackButton />
                    <Text style={styles.headerTitle}>Siguiendo</Text>
                </View>
                <View style={styles.noPermissionContainer}>
                    <Text style={styles.noPermissionText}>
                        No tienes permiso para ver esta lista.
                    </Text>
                </View>
            </View>
        );
    }

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
