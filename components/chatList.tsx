import React from 'react';

// Define the expected type for the onSelectChat prop
interface ChatListProps {
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const chats = [
    { id: 'chat1', name: 'Chat with Dr. Smith' },
    { id: 'chat2', name: 'Chat with Dr. Johnson' },
  ]; // Example data

  return (
    <div className="border-r border-gray-300 text-black">
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
