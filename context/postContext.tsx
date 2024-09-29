import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createSnap } from '@/handlers/postHandler'; 
interface Post {
  id?: string;
  username: string;
  time: string;
  message: string;
  isPrivate: boolean;
}

interface Snap {
  id: string;
  username: string;
  time: string;
  message: string;
  isPrivate: boolean;
  likes: number;
  likedByUser: boolean;
  canViewLikes: boolean;
}

interface PostContextType {
  addNewPost: (newPost: Post) => Promise<void>;
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

  const addNewPost = async (newPost: Post): Promise<void> => {
    const { message, isPrivate } = newPost;
    const response = await createSnap(message, isPrivate);

    if (response.success && response.snap) {
      const newSnap: Snap = {
        id: response.snap.id.toString(),
        username: response.snap.username,
        time: response.snap.time,
        message: response.snap.content,
        isPrivate: response.snap.isPrivate,
        likes: response.snap.likes,
        likedByUser: response.snap.likedByUser,
        canViewLikes: response.snap.canViewLikes,
      };
      setSnaps((prevSnaps) => [newSnap, ...prevSnaps]);
    }
  };

  return (
    <PostContext.Provider value={{ addNewPost, snaps }}>
      {children}
    </PostContext.Provider>
  );
};
