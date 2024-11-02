import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    // Remove any backgroundColor here
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1c1c1c',
    borderRadius: 15,
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
    borderRadius: 15,
    padding: 10,
    verticalAlign: 'top',
  },
  charCount: {
    color: '#888',
    textAlign: 'right',
    marginTop: 5,
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  privacyLabel: {
    color: '#FFFFFF',
    fontSize: 16,
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
    borderRadius: 15,
  },
  postButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
    mentionContainer: {
      backgroundColor: '#333',
      borderRadius: 8,
      padding: 5,
      maxHeight: 120,
      marginTop: 10,
    },
    mentionItem: {
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    mentionText: {
      color: '#1DA1F2',
      fontSize: 16,
    },
});

export default styles;
