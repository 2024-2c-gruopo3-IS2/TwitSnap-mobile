import { StyleSheet } from 'react-native';

const profileStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#000', // Modo oscuro
      justifyContent: 'space-between',
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: 20,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    userInfo: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#888',
      marginBottom: 5,
    },
    text: {
      fontSize: 16,
      color: '#fff',
      marginBottom: 5,
    },
    errorText: {
      fontSize: 18,
      color: '#f00',
      textAlign: 'center',
      marginTop: 20,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footer: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333', // Línea divisoria superior del footer para darle un poco de separación visual
    },
    footerText: {
      fontSize: 14,
      color: '#888',
    },
    logoutButton: {
      backgroundColor: '#FF3B30', // Color de fondo del botón
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginTop: 20,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
export default profileStyles;
  