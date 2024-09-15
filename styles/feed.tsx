import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  newPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  newPostInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
  },
  postButton: {
    backgroundColor: '#1c1c1c',
    padding: 8,
    borderRadius: 8,
  },
  postButtonText: {
    color: '#fff',
  },
  feed: {
    flex: 1,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 8,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: '#888',
  },
  cardContent: {
    marginBottom: 8,
  },
  contentText: {
    color: '#fff',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    color: '#1e90ff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#222',
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
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
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    color: '#1e90ff',
    marginLeft: 10,
  },
});

export default styles;
