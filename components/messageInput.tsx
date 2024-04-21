import React, { FormEvent, useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig'; // Adjust import paths

interface MessageInputProps {
  chatId: string; // Conversation Chat ID where messages will be sent
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const [senderUsername, setSenderUsername] = useState('');

  useEffect(() => {
    const fetchCurrentUserUsername = async () => {
      const currentUser = auth.currentUser;

      if(currentUser) {
        const userDocRef = doc(db, `users/${currentUser.uid}`);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data()?.username) {
          setSenderUsername(userDoc.data()?.username);
        } else {
          setSenderUsername('Unknown User');
        }
      }
    };
    fetchCurrentUserUsername();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentUser = auth.currentUser;

    if (message.trim() && currentUser) {
      try {
        // Add the new message to the 'messages' subcollection in the chat document
        await addDoc(collection(db, `chats/${chatId}/messages`), {
          text: message,
          sender: currentUser.uid,
          senderUsername,
          timestamp: new Date(),
        });

        setMessage(''); // Clear input field

      } catch (error: any) {
        console.error("Error sending message:", error.message);
      }
    }
  };

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Type a message..."
      />
      <button type="submit" className="hidden">Send</button> {/* Hidden submit button for form submission */}
    </form>
  );
};

export default MessageInput;
