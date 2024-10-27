import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import styles from '../styles/userList';

interface SimpleUser {
    id: string;
    username: string;
    profile_picture: string;
}

interface UserListProps {
    users: SimpleUser[];
    onUserPress: (username: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUserPress }) => {
    return (
        <View style={styles.listContainer}>
            {users.map((user) => (
                <Pressable
                    key={user.username} // Usar `id` como clave única
                    style={styles.userItem}
                    onPress={() => onUserPress(user.username)}
                >
                    <View style={styles.userInfo}>
                        <Image
                        source={{ uri: user.profile_picture }}
                        style={styles.profileImageOnFeed}
                        />
                        <Text style={styles.username}>@{user.username}</Text>
                    </View>
                </Pressable>
            ))}
        </View>
    );
};

export default UserList;
