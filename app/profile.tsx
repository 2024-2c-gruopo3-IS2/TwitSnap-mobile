import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, Pressable } from 'react-native';
import styles from '../styles/profile'; // Ajusta la ruta según sea necesario
import Footer from '../components/footer'; // Importamos el Footer
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importamos AsyncStorage
import { useRouter } from 'expo-router'; // Importamos el router para manejar la navegación

// Simulación de la obtención de los datos del perfil del usuario
const fetchUserProfile = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true; // Simular éxito o fallo de la API
      if (success) {
        resolve({
          username: 'Tincho',
          email: 'tincho@example.com',
          location: 'Argentina',
          bio: 'Desarrollador de software y entusiasta de la tecnología',
          profilePicture: 'https://tn.com.ar/resizer/v2/el-topo-gigio-que-juan-roman-riquelme-le-dedico-a-mauricio-macri-en-plena-bombonera-telam-QLNSCUL7PZIBGS27B4XQPOQ4EU.jpg?auth=37146e2df3e18468cfc46fb149722cff2a5ec4d5253a642e253ab63d7a143d30&width=767', // Imagen de perfil
        });
      } else {
        reject('No se pudo cargar el perfil del usuario.');
      }
    }, 0); // Simular un retraso en la respuesta del servidor
  });
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null); // Estado para almacenar el perfil del usuario
  const [loading, setLoading] = useState<boolean>(true); // Estado para manejar el indicador de carga
  const router = useRouter(); // Para manejar la navegación

  useEffect(() => {
    // Simular la carga de datos del perfil al cargar la página
    fetchUserProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Error', error);
      });
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      // Eliminar el token de AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('expiration');
      // Redirigir al usuario a la página de login
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar la sesión.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al cargar el perfil del usuario.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Imagen de perfil */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: profile.profilePicture }} style={styles.profileImage} />
        <Text style={styles.username}>{profile.username}</Text>
      </View>

      {/* Información del usuario */}
      <View style={styles.userInfo}>
        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.text}>{profile.email}</Text>

        <Text style={styles.label}>Ubicación:</Text>
        <Text style={styles.text}>{profile.location}</Text>

        <Text style={styles.label}>Biografía:</Text>
        <Text style={styles.text}>{profile.bio}</Text>
      </View>

      {/* Botón para cerrar sesión */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </Pressable>

      {/* Footer global */}
      <Footer />
    </View>
  );
}
