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
});

export default styles;
