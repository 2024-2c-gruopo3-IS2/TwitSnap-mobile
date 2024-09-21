// app/profile/edit.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getProfile, updateProfile } from '@/handlers/profileHandler';
import BackButton from '@/components/backButton'; // Asegúrate de que la ruta sea correcta
import styles from '../styles/profileEdit';

export default function ProfileEditPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        location: '',
        description: '',
        date_of_birth: '',
        interests: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            const response = await getProfile();

            if (response.success) {
                setProfile(response.profile);
                setFormData({
                    name: response.profile.name || '',
                    surname: response.profile.surname || '',
                    username: response.profile.username || '',
                    location: response.profile.location || '',
                    description: response.profile.description || '',
                    date_of_birth: response.profile.date_of_birth || '',
                    interests: response.profile.interests ? response.profile.interests.join(', ') : '',
                });
            } else {
                Alert.alert('Error', response.message || 'No se pudo obtener el perfil.');
            }
            setIsLoading(false);
        };

        fetchProfile();
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        // Validaciones básicas
        if (!formData.name || !formData.surname || !formData.username || !formData.date_of_birth) {
            Alert.alert('Error', 'Por favor, completa todos los campos requeridos.');
            return;
        }

        // Validar formato de fecha
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(formData.date_of_birth)) {
            Alert.alert('Error', 'La fecha de nacimiento debe estar en el formato YYYY-MM-DD.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Convertir intereses a array
            const interestsArray = formData.interests.split(',').map((interest: string) => interest.trim());

            const updatedProfile = {
                name: formData.name,
                surname: formData.surname,
                username: formData.username,
                location: formData.location,
                description: formData.description,
                date_of_birth: formData.date_of_birth,
                interests: interestsArray,
            };

            const response = await updateProfile(updatedProfile);

            if (response.success) {
                Alert.alert('Éxito', 'Perfil actualizado correctamente.');
                router.back(); // Regresar a la página de visualización
            } else {
                Alert.alert('Error', response.message || 'Error al actualizar el perfil.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar el perfil.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
            {/* Header con BackButton y Título */}
            <View style={styles.headerContainer}>
                <BackButton />
                <Text style={styles.title}>Editar Perfil</Text> 
            </View>

            {/* Campos de perfil */}
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                placeholder="Nombre"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
            />

            <Text style={styles.label}>Apellido</Text>
            <TextInput
                placeholder="Apellido"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={formData.surname}
                onChangeText={(value) => handleChange('surname', value)}
            />

            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
                placeholder="Nombre de usuario"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={formData.username}
                onChangeText={(value) => handleChange('username', value)}
            />

            <Text style={styles.label}>Ubicación</Text>
            <TextInput
                placeholder="Ubicación"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={formData.location}
                onChangeText={(value) => handleChange('location', value)}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                placeholder="Descripción"
                placeholderTextColor="#aaa"
                style={[styles.input, styles.multilineInput]}
                value={formData.description}
                onChangeText={(value) => handleChange('description', value)}
                multiline={true}
                numberOfLines={4}
            />

            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput
                placeholder="Fecha de nacimiento (YYYY-MM-DD)"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={formData.date_of_birth}
                onChangeText={(value) => handleChange('date_of_birth', value)}
            />

            <Text style={styles.label}>Intereses</Text>
            <TextInput
                placeholder="Intereses (separados por comas)"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={formData.interests}
                onChangeText={(value) => handleChange('interests', value)}
            />

            {/* Botón para guardar cambios */}
            <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Guardar Cambios</Text>
                )}
            </Pressable>
        </ScrollView>
    );
}
