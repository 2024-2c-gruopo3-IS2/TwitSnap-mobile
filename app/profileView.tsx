import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProfile, getUserProfile } from '@/handlers/profileHandler';
import BackButton from '@/components/backButton';
import Footer from '@/components/footer';
import styles from '../styles/profileView'; // Asegúrate de que la ruta sea correcta
import { createSnap, getAllSnaps } from '@/handlers/postHandler';

interface Snap {
    id: string; 
    username: string;
    time: string;
    message: string; 
    isPrivate: boolean;
}

export default function ProfileView() {
    const router = useRouter();
    const { username } = useLocalSearchParams(); 
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [snaps, setSnaps] = useState<Snap[]>([]);
    const isOwnProfile = !username;

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            let response;
            if (isOwnProfile) {
                response = await getProfile();
            } else {
                response = await getUserProfile(username as string);
            }

            if (response.success) {
                setProfile(response.profile);

                const snapResponse = await getAllSnaps();
                if (snapResponse.success && snapResponse.snaps && snapResponse.snaps.length > 0) {
                    const snaps: Snap[] = snapResponse.snaps.map((snap: any) => ({
                      id: snap._id,
                      username: snap.username, 
                      time: snap.time,
                      message: snap.message,
                      isPrivate: snap.isPrivate,
                    }));
                    setSnaps(snaps); 
                }
            } else {
                Alert.alert('Error', response.message || 'No se pudo obtener el perfil.');
            }
            setIsLoading(false);
        };

        fetchProfile();
    }, [username]);

    const renderItem = (item: Snap) => (
        <View key={item.id} style={styles.snapContainer}>
            <View style={styles.snapHeader}>
                <Text style={styles.username}>@{item.username}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.content}>{item.message}</Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#1DA1F2" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No se encontró el perfil.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header con BackButton */}
            <View style={styles.headerContainer}>
                <BackButton />
                <View style={styles.rightSpace} />
            </View>

            {/* Foto de Portada */}
            <Image 
                source={{ uri: profile.cover_photo || 'https://via.placeholder.com/800x200' }} 
                style={styles.coverPhoto}
            />

            {/* Foto de Perfil */}
            <View style={styles.profilePictureContainer}>
                <Image 
                    source={{ uri: profile.profile_picture || 'https://via.placeholder.com/150' }} 
                    style={styles.profilePicture}
                />
            </View>

            {/* Nombre, Apellido y Username */}
            <Text style={styles.name}>
                {profile.name} {profile.surname}
            </Text>
            <Text style={styles.username}>@{profile.username}</Text>

            {/* Seguidores y Seguidos */}
            <View style={styles.followContainer}>
                <View style={styles.followSection}>
                    <Text style={styles.followNumber}>{profile.following_count || 0}</Text>
                    <Text style={styles.followLabel}>Seguidos</Text>
                </View>
                <View style={styles.followSection}>
                    <Text style={styles.followNumber}>{profile.followers_count || 0}</Text>
                    <Text style={styles.followLabel}>Seguidores</Text>
                </View>
            </View>

            {/* Botón de Editar Perfil */}
            {isOwnProfile && (
                <Pressable style={styles.editButton} onPress={() => router.push('/profileEdit')}>
                    <Icon name="edit" size={24} color="#fff" />
                    <Text style={styles.editButtonText}>Editar Perfil</Text>
                </Pressable>
            )}

            {/* Título "Mis tweets" */}
            <Text style={styles.tweetsTitle}>Mis tweets</Text>

            {/* Lista de snaps */}
            {snaps.length > 0 ? (
                <View style={styles.snapsList}>
                    {snaps.map(renderItem)}
                </View>
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No se encontraron snaps</Text>
                </View>      
            )}
            
        </ScrollView>
    );
}
