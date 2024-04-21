import React, { FormEvent, useState } from 'react';

// Define the expected type for the onSelectChat prop
interface ChatListProps {
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const [newContactEmail, setNewContactEmail] = useState("");
  const chats = [
    { id: 'chat1', name: 'Chat with Dr. Smith' },
    { id: 'chat2', name: 'Chat with Dr. Johnson' },
  ]; // Example data

  const handleNewContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newContactEmail.trim()) {

      // TODO: New Contact

      console.log(`New contact added: ${newContactEmail}`);
      setNewContactEmail('');
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
