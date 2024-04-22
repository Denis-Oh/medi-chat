import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth } from '@/firebaseConfig';

interface ChatWindowProps {
  chatId: string;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  senderUsername: string;
  timestamp: Date; 
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  // const [chatName, setChatName] = useState(''); 
  const [messages, setMessages] = useState<Message[]>([]); 

  const db = getFirestore(); // Firestore instance
  const currentUser = auth.currentUser;

  useEffect(() => {
    // Fetch the chat name and participants
    // const fetchChatDetails = async () => {
    //   const chatDocRef = doc(db, 'chats', chatId); // Reference to chat document
    //   const chatDoc = await getDoc(chatDocRef); // Get chat document

    //   if (chatDoc.exists()) {
    //     const participants = chatDoc.data().participants as string[]; // Get the participant user IDs

    //     // Fetch usernames of the participants
    //     const usernames = await Promise.all(
    //       participants.map(async (userId) => {
    //         const userDocRef = doc(collection(db, 'users'), userId);
    //         const userDoc = await getDoc(userDocRef);
    //         return userDoc.exists() ? userDoc.data()?.username || 'Unknown User' : 'Unknown User';
    //       })
    //     );

    //     setChatName(`Chat with: ${usernames.join(', ')}`); // Format the chat name
    //   }
    // };

    // Fetch chat messages in real-time
    const fetchMessages = () => {
      const messagesQuery = query(
        collection(db, `chats/${chatId}/messages`), // Reference to the messages subcollection
        orderBy('timestamp', 'asc') // Order messages by timestamp
      );

      onSnapshot(messagesQuery, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          sender: doc.data().sender,
          senderUsername: doc.data().senderUsername,
          timestamp: doc.data().timestamp.toDate(),
        }));
        
        setMessages(fetchedMessages);
      });
    };

    // fetchChatDetails();
    fetchMessages(); 
  }, [chatId, db]);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = currentUser && msg.sender === currentUser.uid;

          return (
            <div
              key={msg.id}
              className={`flex ${
                isCurrentUser ? 'justify-end' : 'justify-start'
              }`} // Align right for current user, left for others
            >
              <div
                className={`${
                  isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white text-black'
                } p-3 rounded-lg shadow`} // Blue for current user, white for others
              >
                {!isCurrentUser && (
                  <div className="text-xs text-gray-500 mb-1">
                    {msg.senderUsername} {/* Display sender's ID for others */}
                  </div>
                )}
                <p>{msg.text}</p>
                <span className="text-sm text-gray-400">
                  {new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  }).format(msg.timestamp)} {/* Display the formatted timestamp */}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ChatWindow;
