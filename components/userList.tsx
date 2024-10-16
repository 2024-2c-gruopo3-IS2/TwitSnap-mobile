// UserList.tsx
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/userList';

interface User {
    id: string;
    username: string;
    name: string;
    surname: string;
    profile_picture: string;
}

interface UserListProps {
    users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
    const router = useRouter();

    const handlePress = (username: string) => {
        router.push(`/profileView?username=${encodeURIComponent(username)}`);
    };

    return (
        <View style={styles.listContainer}>
            {users.map((user) => (
                <Pressable
                    key={user.id} // Asignar una clave única aquí
                    style={styles.userItem}
                    onPress={() => handlePress(user.username)}
                >
                    <Image source={{ uri: user.profile_picture }} style={styles.avatar} />
                    <View style={styles.userInfo}>
                        <Text style={styles.name}>{user.name} {user.surname}</Text>
                        <Text style={styles.username}>@{user.username}</Text>
                    </View>
                </Pressable>
            ))}
        </View>
    );
};
export default UserList;
