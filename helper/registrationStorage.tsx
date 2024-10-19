import AsyncStorage from '@react-native-async-storage/async-storage';

// Define una interfaz para el estado del registro
interface RegistrationState {
  email: string;
  password: string;
  country?: string;
  interests?: string[];
  currentStep: 'location' | 'interests' | 'userRegisterData';
}

// Guardar el estado del registro
export const saveRegistrationState = async (state: RegistrationState): Promise<void> => {
  try {
    await AsyncStorage.setItem('registrationState', JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado del registro:', error);
  }
};

// Obtener el estado del registro
export const getRegistrationState = async (): Promise<RegistrationState | null> => {
  try {
    const state = await AsyncStorage.getItem('registrationState');
    return state ? JSON.parse(state) as RegistrationState : null;
  } catch (error) {
    console.error('Error al obtener el estado del registro:', error);
    return null;
  }
};

// Limpiar el estado del registro
export const clearRegistrationState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('registrationState');
  } catch (error) {
    console.error('Error al eliminar el estado del registro:', error);
  }
};
