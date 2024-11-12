import { ref, query, get, orderByChild } from 'firebase/database';
import { db } from '../firebaseConfig';
import generateUserEmailID from './generateUserEmailId';

const countUnreadMessages = async (chatID, currentUserEmail) => {
    const messagesRef = ref(db, `chats/${chatID}/messages`);

    try {
      const snapshot = await get(query(
        messagesRef,
        orderByChild('timestamp')
      ));

      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const unreadMessages = Object.values(messagesData).filter(message =>
          !message.readBy?.[generateUserEmailID(currentUserEmail)]
        );
        return unreadMessages.length;
      }
      return 0;
    } catch (error) {
      console.error('Error counting unread messages:', error);
      return 0;
    }
};

export default countUnreadMessages;
