import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createSnap, likeSnap, unlikeSnap, favouriteSnap, unfavouriteSnap } from '@/handlers/postHandler';
import { sendMentionNotification } from '@/handlers/notificationHandler';
import { AuthContext } from '@/context/authContext';

interface Post {
  id?: string;
  username: string;
  created_at: string;
  message: string;
  isPrivate: boolean;
}

interface Snap {
  id: string;
  username: string;
    created_at: string;
  time: string;
  message: string;
  isPrivate: boolean;
  likes: number;
  likedByUser: boolean;
  canViewLikes: boolean;
  favouritedByUser: boolean;
}

interface PostContextType {
  addNewPost: (newPost: Post) => Promise<void>;
  toggleLike: (snapId: string, likedByUser: boolean) => Promise<void>;
  toggleFavourite: (snapId: string, favouritedByUser: boolean) => Promise<void>;
  resetSnaps: () => void;
  snaps: Snap[];
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const { user } = useContext(AuthContext);

  const addNewPost = async (newPost: Post): Promise<void> => {
    const { message, isPrivate } = newPost;
    const response = await createSnap(message, isPrivate);

    if (response.success && response.snap) {
      const newSnap: Snap = {
        id: response.snap.id.toString(),
        username: response.snap.username || 'Anon',
        created_at: response.snap.created_at,
        time: response.snap.time,
        message: response.snap.message,
        isPrivate: response.snap.isPrivate,
        likes: response.snap.likes,
        likedByUser: response.snap.likedByUser,
        canViewLikes: response.snap.canViewLikes,
        favouritedByUser: response.snap.favouritedByUser,
      };
      setSnaps((prevSnaps) => [newSnap, ...prevSnaps]);

      // Detectar menciones
      const mentions = [...message.matchAll(/@(\w+)/g)].map(match => match[1]);

      // Enviar notificación para cada usuario mencionado
      for (const mentionedUser of mentions) {
              await sendMentionNotification(mentionedUser, user.username, newSnap.id);
      }
    }
  };

  const toggleLike = async (snapId: string, likedByUser: boolean): Promise<void> => {
    const response = likedByUser ? await unlikeSnap(snapId) : await likeSnap(snapId);

    if (response.success) {
      setSnaps((prevSnaps) =>
        prevSnaps.map((snap) =>
          snap.id === snapId
            ? { ...snap, likedByUser: !likedByUser, likes: likedByUser ? snap.likes - 1 : snap.likes + 1 }
            : snap
        )
      );
    }
  };

  const toggleFavourite = async (snapId: string, favouritedByUser: boolean): Promise<void> => {
    const response = favouritedByUser ? await unfavouriteSnap(snapId) : await favouriteSnap(snapId);

    if (response.success) {
      setSnaps((prevSnaps) =>
        prevSnaps.map((snap) =>
          snap.id === snapId
            ? { ...snap, favouritedByUser: !favouritedByUser }
            : snap
        )
      );
    }
  };

  const resetSnaps = () => {
    setSnaps([]);
  };

  return (
    <PostContext.Provider value={{ addNewPost, toggleLike, toggleFavourite, resetSnaps, snaps }}>
      {children}
    </PostContext.Provider>
  );
};
