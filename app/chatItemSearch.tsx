import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import defaultProfileImage from '../assets/images/placeholder_user.jpg';
import {AuthContext} from '../../contexts/AuthContext';

const ChatItemSearch = ({ item, handleChatPress }) => {
  const [avatar, setAvatar] = useState(defaultProfileImage);
  const { isCandidate } = useUser();

  const fetchAvatarImage = async () => {
    try {
      const imageRef = ref(storage, `profile/images/${item.email}`);
      const url = await getDownloadURL(imageRef);
      setAvatar({ uri: url });
    } catch (error) {
      setAvatar(defaultProfileImage);
    }
  };

  useEffect(() => {
    fetchAvatarImage();
  }, []);

  return (
    <TouchableOpacity onPress={() => handleChatPress(item)} style={styles.itemContainer}>
      <View style={styles.row}>
        <Image source={avatar} style={styles.pic} />
        <View style={styles.infoContainer}>
          { isCandidate ? (
            <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
          ) : (
            <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
              {item.first_name} {item.last_name}
            </Text>
          )}
          <Text style={styles.titleTxt}>{item.title}</Text>
          <Text style={styles.descTxt} numberOfLines={1} ellipsizeMode="tail">
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 15,
    flex: 1,
  },
  nameTxt: {
    fontWeight: '700',
    color: '#333',
    fontSize: 16,
  },
  titleTxt: {
    fontWeight: '500',
    color: '#666',
    fontSize: 14,
  },
  descTxt: {
    fontWeight: '300',
    color: '#999',
    fontSize: 12,
  },
});

export default ChatItemSearch;

