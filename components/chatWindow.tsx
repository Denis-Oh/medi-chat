import React from 'react';

// Props might include the current chat ID and methods to fetch or subscribe to messages
const ChatWindow = ({ chatId }:{ chatId: string }) => {
  const messages = [{ id: 'msg1', text: 'Hello', sender: 'User' }]; // Example messages

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold">Chat: {chatId}</h2>
      <div className="space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className="bg-gray-100 p-2 rounded">
            <p>{msg.text} - <span className="text-sm text-gray-500">{msg.sender}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
