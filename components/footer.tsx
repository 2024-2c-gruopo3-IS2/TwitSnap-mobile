import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import CreatePostModal from './createPostModal';
import styles from '../styles/footer';

interface Post {
  id: number;
  username: string;
  time: string;
  content: string;
  isPrivate: boolean;
}

interface FooterProps {
  addNewPost?: (newPost: Post) => void; 
}

const Footer: React.FC<FooterProps> = ({ addNewPost }) => {
  const pathname = usePathname();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.footer}>
      {/* Home Icon */}
      <Link href="/feed" asChild>
        <Pressable>
          <MaterialIcons
            name="home"
            size={30}
            color={pathname === '/feed' ? '#808080' : '#FFFFFF'}
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

      {/* Conditionally render "+" button and modal */}
      {addNewPost && (
        <>
          {/* "+" Button to create a post */}
          <Pressable onPress={() => setIsModalVisible(true)}>
            <Entypo name="plus" size={30} color="#FFFFFF" />
          </Pressable>

          {/* Modal to create a post */}
          <CreatePostModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            addNewPost={addNewPost}
          />
        </>
      )}

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
