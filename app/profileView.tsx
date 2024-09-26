import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
// import { getProfile, getUserProfile } from '@/handlers/profileHandler';
import BackButton from '@/components/backButton';
import styles from '../styles/profileView';
// import { getAllSnaps, deleteSnap, updateSnap } from '@/handlers/postHandler';
// import { removeToken } from '@/handlers/authTokenHandler';
// import { followUser, unfollowUser, checkIfFollowing } from '@/handlers/followHandler';
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

    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [isFollowedBy, setIsFollowedBy] = useState(false); // Nuevo estado para seguimiento mutuo

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            // Simulación de datos del perfil
            let response;
            if (isOwnProfile) {
                // response = await getProfile();
                response = {
                    success: true,
                    profile: {
                        id: '1',
                        username: 'mi_usuario',
                        name: 'Mi',
                        surname: 'Usuario',
                        cover_photo: '',
                        profile_picture: '',
                        followers_count: 100,
                        following_count: 150,
                    },
                };
            } else {
                // response = await getUserProfile(username as string);
                response = {
                    success: true,
                    profile: {
                        id: '2',
                        username: username as string,
                        name: 'Usuario',
                        surname: 'Ejemplo',
                        cover_photo: '',
                        profile_picture: '',
                        followers_count: 80,
                        following_count: 120,
                    },
                };
            }

            if (response.success) {
                setProfile(response.profile);

                if (!isOwnProfile) {
                    // Simulación de estado de seguimiento
                    // const followingStatus = await checkIfFollowing(response.profile.id);
                    // setIsFollowing(followingStatus.isFollowing);
                    // Simular si el usuario ya está siguiendo al perfil
                    setIsFollowing(false); // Cambia a 'true' si deseas simular que ya lo sigues
                }

                // Simulación de datos de snaps
                // const snapResponse = await getAllSnaps();
                const snapResponse = {
                    success: true,
                    snaps: [
                        {
                            _id: 'snap1',
                            username: isOwnProfile ? 'mi_usuario' : username,
                            time: 'Hace 2 horas',
                            message: 'Este es mi primer snap!',
                            isPrivate: 'false',
                        },
                        {
                            _id: 'snap2',
                            username: isOwnProfile ? 'mi_usuario' : username,
                            time: 'Ayer',
                            message: 'Otro día, otro snap.',
                            isPrivate: 'true',
                        },
                    ],
                };

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
                Alert.alert('Error', 'No se pudo obtener el perfil.');
            }
            setIsLoading(false);
        };

        fetchProfile();
    }, [username]);

    const handleFollow = async () => {
        if (isFollowLoading) return;

        setIsFollowLoading(true);
        try {
            // Simulación de la acción de seguir
            // const response = await followUser(profile.id);
            const response = { success: true }; // Simular éxito

            if (response.success) {
                setIsFollowing(true);
                Alert.alert('Éxito', 'Has seguido al usuario exitosamente.');
                // Actualizar el conteo de seguidores
                setProfile((prev: any) => ({
                    ...prev,
                    followers_count: prev.followers_count + 1,
                }));
            } else {
                Alert.alert('Error', 'No se pudo seguir al usuario.');
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al seguir al usuario.');
            console.error('Error al seguir al usuario:', error);
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleUnfollow = async () => {
        if (isFollowLoading) return;

        setIsFollowLoading(true);
        try {
            // Simulación de la acción de dejar de seguir
            // const response = await unfollowUser(profile.id);
            const response = { success: true }; // Simular éxito

            if (response.success) {
                setIsFollowing(false);
                Alert.alert('Éxito', 'Has dejado de seguir al usuario.');
                // Actualizar el conteo de seguidores
                setProfile((prev: any) => ({
                    ...prev,
                    followers_count: prev.followers_count - 1,
                }));
            } else {
                Alert.alert('Error', 'No se pudo dejar de seguir al usuario.');
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al dejar de seguir al usuario.');
            console.error('Error al dejar de seguir al usuario:', error);
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleEditSnap = (snap: Snap) => {
        setSelectedSnap(snap);
        setIsEditModalVisible(true);
    };

    const handleUpdateSnap = async (snapId: string, message: string, isPrivate: boolean) => {
        try {
            // Simulación de actualización de snap
            // const result = await updateSnap(snapId, message, isPrivate.toString());
            const result = { success: true }; // Simular éxito

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
                Alert.alert('Error', 'No se pudo actualizar el snap.');
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al actualizar el snap.');
            console.error('Error al actualizar el snap:', error);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // await removeToken();
                            router.replace('/login');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo cerrar sesión. Inténtalo nuevamente.');
                            console.error('Error al cerrar sesión:', error);
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteSnap = (snapId: string) => {
        Alert.alert(
            'Eliminar Snap',
            '¿Estás seguro de que quieres eliminar este snap?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        // const result = await deleteSnap(snapId as unknown as number);
                        const result = { success: true }; // Simular éxito
                        if (result.success) {
                            // Actualizar la lista de snaps
                            setSnaps(snaps.filter(snap => snap.id !== snapId));
                            Alert.alert('Éxito', 'Snap eliminado exitosamente');
                        } else {
                            Alert.alert('Error', 'No se pudo eliminar el snap.');
                        }
                    },
                },
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
                <Pressable onPress={() => router.push('./followers')} style={styles.followSection}>
                    <Text style={styles.followNumber}>{profile.followers_count || 0}</Text>
                    <Text style={styles.followLabel}>Seguidores</Text>
                </Pressable>
                <Pressable onPress={() => router.push('./following')} style={styles.followSection}>
                    <Text style={styles.followNumber}>{profile.following_count || 0}</Text>
                    <Text style={styles.followLabel}>Seguidos</Text>
                </Pressable>
            </View>

            {!isOwnProfile && (
                <Pressable
                    style={[
                        styles.followButton,
                        isFollowing ? styles.unfollowButton : styles.followButtonStyle,
                    ]}
                    onPress={isFollowing ? handleUnfollow : handleFollow}
                    disabled={isFollowLoading}
                >
                    {isFollowLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.followButtonText}>
                            {isFollowing ? 'Dejar de Seguir' : 'Seguir'}
                        </Text>
                    )}
                </Pressable>
            )}

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

            {/* <Text style={styles.tweetsTitle}>Mis snaps</Text> */}

            {snaps.length > 0 ? (
                <View style={styles.snapsList}>{snaps.map(renderItem)}</View>
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
                snap={
                    selectedSnap
                        ? {
                              id: selectedSnap.id,
                              username: selectedSnap.username,
                              time: selectedSnap.time,
                              message: selectedSnap.message,
                              isPrivate: selectedSnap.isPrivate,
                          }
                        : null
                }
                onSubmit={handleUpdateSnap}
            />
        </ScrollView>
    );
}
