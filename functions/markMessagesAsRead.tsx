import {
    query, orderByChild, endAt, get, limitToLast, ref, update
} from 'firebase/database';
import { db } from '../firebaseConfig';
import generateUserEmailID from './generateUserEmailId';

const markMessagesAsRead = async (chatID, loggedUserEmail) => {
    let continueFetching = true;
    let lastMessageTimestamp = null;
    const messagesRef = ref(db, `chats/${chatID}/messages`);

    try {
      while (continueFetching) {
        let queryRef;
        if (lastMessageTimestamp === null) {
          queryRef = query(
            messagesRef,
            orderByChild('timestamp'),
            limitToLast(10)
          );
        } else {
          queryRef = query(
            messagesRef,
            orderByChild('timestamp'),
            endAt(lastMessageTimestamp - 1),
            limitToLast(10)
          )
        }
        const snapshot = await get(queryRef);
        if (snapshot.exists()) {
          const updates = {};
          const messagesData = snapshot.val();
          const messageIds = Object.keys(messagesData).reverse();

          for (const messageId of messageIds) {
            const message = messagesData[messageId];

            if (message.sender !== loggedUserEmail && !message.readBy?.[generateUserEmailID(loggedUserEmail)]) {
              updates[`/chats/${chatID}/messages/${messageId}/readBy/${generateUserEmailID(loggedUserEmail)}`] = true;
            } else {
              continueFetching = false;
              break;
            }
          }

          if (Object.keys(updates).length > 0) {
            await update(ref(db), updates);
          }

          lastMessageTimestamp = messagesData[messageIds[0]].timestamp;

          if (messageIds.length < 10) {
            continueFetching = false;
          }
        } else {
          continueFetching = false;
        }
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

export default markMessagesAsRead;