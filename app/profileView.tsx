import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProfile, getUserProfile } from '@/handlers/profileHandler';
import BackButton from '@/components/backButton';
import styles from '../styles/profileView';
import { getAllSnaps, deleteSnap, updateSnap } from '@/handlers/postHandler';
import { removeToken } from '@/handlers/authTokenHandler';
import EditSnapModal from '@/components/editSnapModal'; // Asegúrate de que la ruta sea correcta

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
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedSnap, setSelectedSnap] = useState<Snap | null>(null);


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
                        isPrivate: snap.isPrivate === 'true',
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

    const handleEditSnap = (snap: Snap) => {
        setSelectedSnap(snap);
        setIsEditModalVisible(true);
    };

    const handleUpdateSnap = async (snapId: string, message: string, isPrivate: boolean) => {
        try {
            const result = await updateSnap(
                snapId, // Asegúrate de que snapId sea un número
                message,
                isPrivate.toString()
            );

            if (result.success) {
                // Actualizar el snap en la lista
                setSnaps(prevSnaps =>
                    prevSnaps.map(snap =>
                        snap.id === snapId ? { ...snap, message, isPrivate } : snap
                    )
                );
                setIsEditModalVisible(false);
                setSelectedSnap(null);
            } else {
                Alert.alert('Error', result.message || 'No se pudo actualizar el snap.');
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al actualizar el snap.');
            console.error('Error al actualizar el snap:', error);
        }
    };


    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que deseas cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar Sesión",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeToken();
                            router.replace('/login');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo cerrar sesión. Inténtalo nuevamente.');
                            console.error('Error al cerrar sesión:', error);
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteSnap = (snapId: string) => {
        Alert.alert(
            "Eliminar Snap",
            "¿Estás seguro de que quieres eliminar este snap?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        const result = await deleteSnap(snapId as unknown as number);
                        if (result.success) {
                            // Actualizar la lista de snaps
                            setSnaps(snaps.filter(snap => snap.id !== snapId));
                            Alert.alert('Éxito', 'Snap eliminado exitosamente');
                        } else {
                            Alert.alert('Error', result.message);
                        }
                    }
                }
            ]
        );
    };


    const renderItem = (item: Snap) => (
        <View key={item.id} style={styles.snapContainer}>
            <View style={styles.snapContent}>
                <View style={styles.snapHeader}>
                    <Text style={styles.username}>@{item.username}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.content}>{item.message}</Text>
            </View>
            {isOwnProfile && (
                <View style={styles.actionButtons}>
                    <Pressable
                        onPress={() => handleEditSnap(item)} // Abrir el modal de edición
                        style={styles.editButton}
                    >
                        <Icon name="edit" size={24} color="#fff" style={styles.icon} />
                    </Pressable>
                    <Pressable
                        onPress={() => handleDeleteSnap(item.id)}
                        style={styles.deleteButton}
                    >
                        <Icon name="delete" size={24} color="#fff" style={styles.icon} />
                    </Pressable>
                </View>
            )}
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
            <View style={styles.headerContainer}>
                <BackButton />
                <View style={styles.rightSpace} />
            </View>

            <Image
                source={{ uri: profile.cover_photo || 'https://via.placeholder.com/800x200' }}
                style={styles.coverPhoto}
            />

            <View style={styles.profilePictureContainer}>
                <Image
                    source={{ uri: profile.profile_picture || 'https://via.placeholder.com/150' }}
                    style={styles.profilePicture}
                />
            </View>

            <Text style={styles.name}>
                {profile.name} {profile.surname}
            </Text>
            <Text style={styles.username}>@{profile.username}</Text>

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

            {isOwnProfile && (
                <View style={styles.profileActionsContainer}>
                    <Pressable style={styles.editButton} onPress={() => router.push('/profileEdit')}>
                        <Icon name="edit" size={24} color="#fff" />
                        <Text style={styles.editButtonText}>Editar Perfil</Text>
                    </Pressable>
                    <Pressable style={styles.logoutButton} onPress={handleLogout}>
                        <Icon name="logout" size={24} color="#fff" />
                        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                    </Pressable>
                </View>
            )}

            <Text style={styles.tweetsTitle}>Mis snaps</Text>

            {snaps.length > 0 ? (
                <View style={styles.snapsList}>
                    {snaps.map(renderItem)}
                </View>
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No se encontraron snaps</Text>
                </View>
            )}

            {/* Modal de Edición de Snap */}
            <EditSnapModal
                isVisible={isEditModalVisible}
                onClose={() => {
                    setIsEditModalVisible(false);
                    setSelectedSnap(null);
                }}
                snap={selectedSnap ? {
                    id: selectedSnap.id,
                    username: selectedSnap.username,
                    time: selectedSnap.time,
                    message: selectedSnap.message,
                    isPrivate: selectedSnap.isPrivate,
                } : null}
                onSubmit={handleUpdateSnap}
            />
        </ScrollView>
    );
}
