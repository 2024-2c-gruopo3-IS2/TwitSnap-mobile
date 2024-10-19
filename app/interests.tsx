import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import styles from '../styles/interests';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveRegistrationState, getRegistrationState } from '@/helper/registrationStorage';

export default function InteresesPage() {
  // Lista de intereses disponibles
  const { email, password, country } = useLocalSearchParams();
  const listaIntereses = ['Política', 'Deportes', 'Entretenimiento', 'Tecnología', 'Ciencia', 'Arte', 'Música', 'Viajes'];
  
  // Estado para almacenar los intereses seleccionados
  const [interesesSeleccionados, setInteresesSeleccionados] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
      const loadSavedState = async () => {
          const savedState = await getRegistrationState();
            if (savedState?.interests) {
                setInteresesSeleccionados(savedState.interests.split(','));
            }
        };
    loadSavedState();
    }, []);

  // Manejar selección de intereses
  const handleSeleccionInteres = (interes: string) => {
    // Si ya está seleccionado, lo removemos, si no, lo agregamos
    if (interesesSeleccionados.includes(interes)) {
      setInteresesSeleccionados(interesesSeleccionados.filter(i => i !== interes));
    } else {
      setInteresesSeleccionados([...interesesSeleccionados, interes]);
    }
  };

    const handleConfirmarIntereses = async () => {
      if (interesesSeleccionados.length < 2) {
        Alert.alert('Error', 'Por favor, selecciona al menos dos intereses.');
      } else {
        const registrationState = {
          email,
          password,
          country,
          interests: interesesSeleccionados,
          currentStep: 'userRegisterData',
        };
        await saveRegistrationState(registrationState);

        router.push({
          pathname: './userRegisterData',
          params: { email, password, country, interests: interesesSeleccionados.join(',') }
        });
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuáles son tus intereses?</Text>
      <Text style={styles.subtitle}>Selecciona al menos dos intereses:</Text>

      {/* Lista de intereses */}
      <View style={styles.interesesContainer}>
        {listaIntereses.map((interes) => (
          <Pressable
            key={interes}
            style={[
              styles.interesButton,
              interesesSeleccionados.includes(interes) && styles.interesButtonSelected, // Cambiar el estilo si está seleccionado
            ]}
            onPress={() => handleSeleccionInteres(interes)}
          >
            <Text style={styles.interesButtonText}>
              {interes}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Botón para confirmar intereses */}
      <Pressable style={styles.confirmButton} onPress={handleConfirmarIntereses}>
        <Text style={styles.confirmButtonText}>Siguiente</Text>
      </Pressable>
    </View>
  );
}
