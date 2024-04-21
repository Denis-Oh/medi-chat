import React, { FormEvent, useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { auth } from '@/firebaseConfig';

// Define the expected type for the onSelectChat prop
interface ChatListProps {
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const [newContactEmail, setNewContactEmail] = useState("");
  const [chats, setChats] = useState<{ id: string; name: string }[]>([]);
  const db = getFirestore(); // Firestore instance

  useEffect(() => {
    // Fetch initial chats for the current user
    const fetchChats = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const chatsQuery = query(
          collection(db, 'chats'),
          where('participants', 'array-contains', currentUser.uid) // participants is an array of user IDs
        );
        const chatDocs = await getDocs(chatsQuery);
        const fetchedChats = chatDocs.docs.map(doc => ({ 
          id: doc.id, 
          name: doc.data().chatName || `Chat ${doc.id}`,
        }));
        setChats(fetchedChats);
      }
    };

    fetchChats(); // Fetch the initial list of chats
  }, []);

  const handleNewContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newContactEmail.trim()) {
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', newContactEmail.trim())
      );

      const userDocs = await getDocs(usersQuery);

      if (!userDocs.empty) {
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Get participant usernames
          const participants = [currentUser.uid, userDocs.docs[0].id];
          const usernames = await Promise.all(
            participants.map(async (userId) => {
              const userDocRef = doc(collection(db, 'users'), userId);
              const userDoc = await getDoc(userDocRef);
              return userDoc.data()?.username || 'Unknown User';
            })
          );

          const chatName = `Chat with: ${usernames.join(', ')}`; // Generate the chat name

          const newChatDoc = await addDoc(collection(db, 'chats'), {
            participants,
            createdAt: new Date(),
            chatName, // Store the chat name
          });

          setChats([...chats, { id: newChatDoc.id, name: chatName }]); // Update the chat list with the new chat
          setNewContactEmail(''); // Clear the input field
        }
      } else {
        alert("User not found. Please ensure the email is correct."); // Handle user not found
      }
    }
  };


  return (
    <div className="border-r border-gray-300 text-black">
      <form className="p-4" onSubmit={handleNewContact}>
        <input
          type="text"
          value={newContactEmail}
          onChange={(e) => setNewContactEmail(e.target.value)}
          className="w-full rounded p-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="New contact's email"
        />
        <button type="submit" className="p-1 text-blue-400 hover:text-blue-600">Start Chat</button>
      </form>

      <h2 className="text-lg font-bold p-4">Chats</h2>
      <ul className="list-none">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="cursor-pointer p-2 hover:bg-gray-200"
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
