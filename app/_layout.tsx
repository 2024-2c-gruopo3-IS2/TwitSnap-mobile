// app/_layout.tsx

import React from 'react';
import { AuthProvider } from '@/context/authContext';
import { PostProvider } from '@/context/postContext';
import { Slot } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
        <PostProvider>
          <Slot />
        </PostProvider>
    </AuthProvider>
  );
};

export default Layout;
