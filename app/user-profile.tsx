// UserProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router'; // Para manejar parámetros de la URL
import styles from '../styles/profile'; // Ajusta la ruta según sea necesario
import Footer from '../components/footer'; // Importamos el Footer

// Simulación de la obtención de los datos del perfil del usuario
const fetchUserProfile = async (userId: number) => {
  // Simulamos la llamada a una API con datos dinámicos según el ID del usuario
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usersData = [
        {
          id: 1,
          username: 'Brandn912',
          email: 'brandon@example.com',
          location: 'Argentina',
          bio: 'Lover of tech and coding',
          profilePicture: 'https://www.infobae.com/new-resizer/QEF33h7JGIsHiMRxe-j1PtwiIrw=/1200x900/filters:format(webp):quality(85)/s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/12/09200640/Boca-River-Madrid-Final-Copa-Libertadores-festejos-102.jpg',
        },
        {
          id: 2,
          username: 'MartinJRR',
          email: 'martin@example.com',
          location: 'Argentina',
          bio: 'Lover of tech and coding',
          profilePicture: 'https://tn.com.ar/resizer/v2/el-topo-gigio-que-juan-roman-riquelme-le-dedico-a-mauricio-macri-en-plena-bombonera-telam-QLNSCUL7PZIBGS27B4XQPOQ4EU.jpg?auth=37146e2df3e18468cfc46fb149722cff2a5ec4d5253a642e253ab63d7a143d30&width=767',
        },
        {
          id: 3,
          username: 'FR4N',
          email: 'francisco@example.com',
          location: 'Argentina',
          bio: 'Designer & Creative Enthusiast',
          profilePicture: 'https://www.canal12misiones.com/wp-content/uploads/2023/12/La-Bombonera-2112023.webp',
        },
        {
          id: 4,
          username: 'VAL3N',
          email: 'valentin@example.com',
          location: 'Argentina',
          bio: 'Designer & Creative Enthusiast',
          profilePicture: 'https://www.fcbarcelona.com/photo-resources/2022/08/02/ae5252d1-b79b-4950-9e34-6e67fac09bb0/LeoMessi20092010_pic_fcb-arsenal62.jpg?width=1200&height=750',
        },
      ];

      const userProfile = usersData.find((user) => user.id === userId);
      if (userProfile) {
        resolve(userProfile);
      } else {
        reject('Perfil de usuario no encontrado.');
      }
    }, 1000); // Simulamos un retraso en la respuesta del servidor
  });
};

export default function UserProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useLocalSearchParams(); // Obtiene el ID del usuario de los parámetros de la URL

  useEffect(() => {
    if (id) {
      fetchUserProfile(Number(id))
        .then((data) => {
          setProfile(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert('Error', error);
        });
    }
  }, [id]);

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

      {/* Footer global */}
      <Footer />
    </View>
  );
}
