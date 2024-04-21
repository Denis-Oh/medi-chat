import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface ChatWindowProps {
  chatId: string;
}

interface Message {
  id: string;
  text: string;
  sender: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [chatName, setChatName] = useState(''); 
  const [messages, setMessages] = useState<Message[]>([]); 

  const db = getFirestore(); // Firestore instance

  useEffect(() => {
    // Fetch chat participants and their usernames
    const fetchChatDetails = async () => {
      const chatDocRef = doc(db, 'chats', chatId); // Reference to chat document
      const chatDoc = await getDoc(chatDocRef); // Get chat document

      if (chatDoc.exists()) {
        const participants = chatDoc.data().participants as string[]; // Get the participant user IDs

        // Fetch usernames of the participants
        const usernames = await Promise.all(
          participants.map(async (userId) => {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            return userDoc.exists() ? userDoc.data()?.username : 'Unknown User'; // Return username
          })
        );

        setChatName(`Chat with: ${usernames.join(', ')}`); // Format the chat name with usernames
      }
    };

    fetchChatDetails(); 
  }, [chatId, db]); 

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold">{chatName}</h2> {/* Display the formatted chat name */}
      <div className="space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-100 p-2 rounded">
            <p>{msg.text} - <span className="text-sm text-gray-500">{msg.sender}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
