import { StyleSheet } from 'react-native';

const modalStyles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '90%',
      backgroundColor: '#1c1c1c',
      borderRadius: 10,
      padding: 20,
    },
    modalTitle: {
      fontSize: 20,
      color: '#FFFFFF',
      marginBottom: 15,
      textAlign: 'center',
    },
    textInput: {
      height: 100,
      color: '#FFFFFF',
      borderColor: '#333',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    cancelButton: {
      backgroundColor: '#888',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    saveButton: {
      backgroundColor: '#1DA1F2',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
  });

export default modalStyles;