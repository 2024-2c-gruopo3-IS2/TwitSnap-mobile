import React, { useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import CreatePostModal from './createPostModal';
import styles from '../styles/footer';
import { usePostContext } from '../context/postContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { addNewPost } = usePostContext();
  const [currentUsername, setCurrentUsername] = useState('');

  return (
    <View style={styles.footer}>
      {/* Home Icon */}
      <Link href="/tabs" asChild>
        <Pressable>
          <MaterialIcons
            name="home"
            size={30}
            color={pathname === '/tabs' ? '#808080' : '#FFFFFF'}
          />
        </Pressable>
      </Link>

      {/* Search Icon */}
      <Link href="/search" asChild>
        <Pressable>
          <Ionicons
            name="search"
            size={30}
            color={pathname === '/search' ? '#808080' : '#FFFFFF'}
          />
        </Pressable>
      </Link>

      {/* Notifications Icon */}
      <Link href="/notifications" asChild>
        <Pressable>
          <Ionicons
            name="notifications"
            size={30}
            color={pathname === '/notifications' ? '#808080' : '#FFFFFF'}
          />
        </Pressable>
      </Link>

      {/* "+" Button to create a post */}
      <Pressable onPress={() => setIsModalVisible(true)}>
        <Entypo name="plus" size={30} color="#FFFFFF" />
      </Pressable>

      {/* Modal to create a post */}
      <CreatePostModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        addNewPost={addNewPost} // Llamar la función addNewPost desde el contexto
      />

      {/* Profile Icon */}
      <Link href="/profileView" asChild>
        <Pressable>
          <FontAwesome
            name="user"
            size={30}
            color={pathname.startsWith('/profile') ? '#808080' : '#FFFFFF'}
          />
        </Pressable>
      </Link>
    </View>
  );
};

export default Footer;
