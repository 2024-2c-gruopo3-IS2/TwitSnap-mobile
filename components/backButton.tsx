// components/BackButton.tsx
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BackButton = () => {
    const router = useRouter();

    return (
        <Pressable style={styles.button} onPress={() => router.back()}>
            <View style={styles.circle}>
                <Icon name="arrow-back" size={24} color="#fff" />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 20, // Ajusta según tus necesidades
        left: 20, // Ajusta según tus necesidades
        zIndex: 2, // Asegura que el botón esté por encima de otros elementos
    },
    circle: {
        backgroundColor: 'gray', // Fondo gris del botón
        borderRadius: 25, // Hace que el botón sea redondo
        width: 40, // Anchura y altura iguales para crear un círculo
        height: 40,
        justifyContent: 'center', // Centra el ícono dentro del círculo
        alignItems: 'center',
    }
});

export default BackButton;
