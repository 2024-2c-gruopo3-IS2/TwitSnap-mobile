// app/_layout.tsx

import React from 'react';
import { AuthProvider } from '@/context/authContext';
import { PostProvider } from '@/context/postContext';
import { NotificationProvider } from '@/context/notificationContext';
import { Slot } from 'expo-router';

const Layout = () => {
  return (
    <AuthProvider>
        <NotificationProvider>
          <PostProvider>
            <Slot />
          </PostProvider>
        </NotificationProvider>
    </AuthProvider>
  );
};

export default Layout;
