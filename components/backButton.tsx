// components/BackButton.tsx
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BackButtonProps {
    onPress?: () => void; // Prop opcional para manejar el evento onPress
}

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
    const router = useRouter();

    // Usar la función onPress pasada como prop o router.back() por defecto
    const handlePress = onPress || (() => router.back());

    return (
        <Pressable style={styles.button} onPress={handlePress}>
            <View style={styles.circle}>
                <Icon name="arrow-back" size={24} color="#fff" />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 2,
    },
    circle: {
        backgroundColor: 'black',
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BackButton;
