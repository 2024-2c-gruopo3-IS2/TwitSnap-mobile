import { getDatabase, ref, set, push, get, child } from 'firebase/database';

const db = getDatabase();

export const sendMessage = async (user1: string, user2: string, message: string) => {
  const messageRef = ref(db, `messages/${user1}_${user2}`);
  const newMessageRef = push(messageRef);
  await set(newMessageRef, {
    sender: user1,
    receiver: user2,
    text: message,
    timestamp: Date.now(),
  });
};

export const getMessages = async (user1: string, user2: string) => {
  const messagesRef = ref(db, `messages/${user1}_${user2}`);
  const snapshot = await get(messagesRef);
  const messagesData = snapshot.val();
  const messages: any[] = [];

  if (messagesData) {
    Object.keys(messagesData).forEach((key) => {
      messages.push({ id: key, ...messagesData[key] });
    });
  }

  return messages.sort((a, b) => a.timestamp - b.timestamp); // Ordenar mensajes por tiempo
};
