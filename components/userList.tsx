// UserList.tsx
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/followList';

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

    const renderUser = (user: User) => (
        <Pressable
            key={user.id}
            style={styles.userContainer}
            onPress={() => router.push(`/profileView?username=${user.username}`)}
        >
            <Image
                source={{ uri: user.profile_picture || 'https://via.placeholder.com/100' }}
                style={styles.profilePicture}
            />
            <View style={styles.userInfo}>
                <Text style={styles.name}>
                    {user.name} {user.surname}
                </Text>
                <Text style={styles.username}>@{user.username}</Text>
            </View>
        </Pressable>
    );

    return <View>{users.map(renderUser)}</View>;
};

export default UserList;
