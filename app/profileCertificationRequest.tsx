// ProfileCertificationRequest.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/authContext';
import { storage, firestore } from '../firebaseConfig'; // Asegúrate de que la ruta es correcta
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileCertificationRequest() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState(user?.username || '');
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Función para seleccionar una foto del documento
  const handleChoosePhoto = async () => {
    try {
      // Solicitar permisos si aún no se han otorgado
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setDocumentImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar la foto:', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la foto. Inténtalo de nuevo.');
    }
  };

  // Función para subir la foto a Firebase Storage
  const uploadDocument = async (username: string, localUri: string): Promise<string> => {
    try {
      const response = await fetch(localUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `documents/${username}_certification_${Date.now()}.png`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir el documento de certificación:', error);
      throw error;
    }
  };

  // Función para enviar la solicitud de certificación a Firestore
  const submitCertificationRequest = async (request: {
    name: string;
    surname: string;
    username: string;
    documentURL: string;
    submittedAt: string;
  }): Promise<void> => {
    try {
      const requestsCollection = collection(firestore, 'certificationRequests');
      await addDoc(requestsCollection, request);
    } catch (error) {
      console.error('Error al enviar la solicitud de certificación:', error);
      throw error;
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    if (!name || !surname || !username || !documentImage) {
      Alert.alert('Error', 'Por favor completa todos los campos y selecciona una imagen.');
      return;
    }

    setIsSubmitting(true);
    setUploading(true);

    try {
      // Subir la foto a Firebase Storage
      const documentURL = await uploadDocument(username, documentImage);

      // Enviar la solicitud de certificación a Firestore
      await submitCertificationRequest({
        name,
        surname,
        username,
        documentURL,
        submittedAt: Timestamp.now().toDate().toISOString(),
      });

      Alert.alert('Solicitud Enviada', 'Tu solicitud de certificación ha sido enviada exitosamente. Pronto recibirás una confirmación.');

      // Regresar al perfil
      router.replace('/ProfileView');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al enviar tu solicitud. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/twitsnap_logo.png')}
              style={styles.logo}
            />
       </View>
      <Text style={styles.title}>Solicitud de Certificación de Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        placeholderTextColor="#ccc"
        value={surname}
        onChangeText={setSurname}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
        editable={false} // Username no editable si se asume que es el del usuario actual
      />

      <TouchableOpacity style={styles.photoButton} onPress={handleChoosePhoto}>
        <Text style={styles.photoButtonText}>Seleccionar Foto de Documento</Text>
      </TouchableOpacity>

      {documentImage && <Image source={{ uri: documentImage }} style={styles.previewImage} />}

      {uploading && <ActivityIndicator size="large" color="#1DA1F2" style={styles.uploadingIndicator} />}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitting || uploading}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black', // Modo oscuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 15,
  },
  logoContainer: {
      alignItems: 'center',
      paddingVertical: 10,
      marginTop:20,
    },
    logo: {
        width: 50, // Ajusta el tamaño del logo según sea necesario
        height: 50,
        resizeMode: 'contain',
     },
  photoButton: {
    backgroundColor: '#1DA1F2',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 15,
  },
  submitButton: {
    backgroundColor: '#1DA1F2',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  uploadingIndicator: {
    marginVertical: 10,
  },
});
