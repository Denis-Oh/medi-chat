import React, { FormEvent, useState } from 'react';

// Define the expected type for the onSendMessage prop
interface messageInputProps {
    onSendMessage: (chatId: string) => void;
  }
  
// Props might include methods to send messages
const MessageInput: React.FC<messageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
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
      <button type="submit" className="hidden">Send</button>
    </form>
  );
};

export default MessageInput;
