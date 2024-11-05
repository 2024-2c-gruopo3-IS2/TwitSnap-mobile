import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  snapContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  snapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImageOnFeed: {
    width: 35,
    height: 35,
    borderRadius: 22.5,
    marginRight: 10,
  },
  snapHeaderText: {
    flex: 1,
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#1DA1F2',
  },
  time: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  content: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
    marginBottom: 10,
  },
  actionButtonsTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#127fa4',
    padding: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    marginRight: 4,
  },
  likeCount: {
    fontSize: 14,
    color: '#aaa',
  },
  favouriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 15,
  },
  favouriteButton: {
    marginRight: 4,
  },
  snapShareContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  snapShareButton: {
      marginLeft:10,
  },
  icon: {
    color: '#1DA1F2',
  },
retweetText: {
  fontSize: 14,
  color: 'white',
  marginBottom: 4,
},
});
