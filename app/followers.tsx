// followers.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/backButton';
import styles from '../styles/followList';
// import { getFollowers } from '@/handlers/followHandler';
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
    const [canViewList, setCanViewList] = useState(false); // Estado para simular la verificación de privacidad

    useEffect(() => {
        const fetchFollowers = async () => {
            setIsLoading(true);

            // Simulación de verificación de privacidad
            const checkPrivacy = () => {
                // Puedes cambiar este valor para probar diferentes escenarios
                setCanViewList(true); // Cambia a 'false' para simular que no tienes acceso
            };

            checkPrivacy();

            if (canViewList) {
                // Simulación de datos de seguidores
                // const response = await getFollowers(username as string);
                const response = {
                    success: true,
                    followers: [
                        {
                            id: '1',
                            username: 'usuario1',
                            name: 'Nombre1',
                            surname: 'Apellido1',
                            profile_picture: 'https://via.placeholder.com/100',
                        },
                        {
                            id: '2',
                            username: 'usuario2',
                            name: 'Nombre2',
                            surname: 'Apellido2',
                            profile_picture: 'https://via.placeholder.com/100',
                        },
                        // Agrega más usuarios simulados si es necesario
                    ],
                };

                if (response.success) {
                    setFollowers(response.followers);
                } else {
                    Alert.alert('Error', 'No se pudieron obtener los seguidores.');
                }
            }

            setIsLoading(false);
        };

        if (username) {
            fetchFollowers();
        }
    }, [username, canViewList]);

    if (!canViewList) {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <BackButton />
                    <Text style={styles.headerTitle}>Seguidores</Text>
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
                <Text style={styles.headerTitle}>Seguidores</Text>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#1DA1F2" />
            ) : followers.length > 0 ? (
                <UserList users={followers} />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No tienes seguidores.</Text>
                </View>
            )}
        </ScrollView>
    );
}
