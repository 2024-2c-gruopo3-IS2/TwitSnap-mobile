import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/authContext';
import { storage, db } from '../firebaseConfig'; // Importa Storage y Database de Firebase
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Para subir a Storage
import { ref as databaseRef, push } from 'firebase/database'; // Para guardar en Realtime Database
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

      // Cambiar el nombre del archivo para seguir el formato id_${username}.png
      const storagePath = storageRef(storage, `documents/id_${username}.png`);
      await uploadBytes(storagePath, blob);
      const downloadURL = await getDownloadURL(storagePath); // Obtén la URL de descarga
      return downloadURL;
    } catch (error) {
      console.error('Error al subir el documento de certificación:', error);
      throw error;
    }
  };

  // Función para enviar la solicitud de certificación a Realtime Database
  const submitCertificationRequest = async (request: {
    name: string;
    surname: string;
    username: string;
    documentURL: string;
    submittedAt: string;
  }): Promise<void> => {
    try {
      // Crea una nueva entrada en la referencia "certificationRequests"
      const requestsRef = databaseRef(db, 'certificationRequests');
      await push(requestsRef, request); // Agrega un nuevo nodo con datos
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

      // Enviar la solicitud de certificación a Realtime Database
      await submitCertificationRequest({
        name,
        surname,
        username,
        documentURL,
        submittedAt: new Date().toISOString(),
      });

      Alert.alert('Solicitud Enviada', 'Tu solicitud de certificación ha sido enviada exitosamente. Pronto recibirás una confirmación.');

      // Regresar al perfil
      router.replace('/profileView'); // Cambiar a la vista del perfil
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
        <Image source={require('@/assets/images/twitsnap_logo.png')} style={styles.logo} />
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
        editable={false} // Username no editable
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
    backgroundColor: 'black',
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
    marginTop: 20,
  },
  logo: {
    width: 50,
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
