'use client'; // client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import ChatList from '@/components/chatList';
import ChatWindow from '@/components/chatWindow';
import MessageInput from '@/components/messageInput';

// Send message to database
const sendMessage = (chatId: string, message: string) => {
  // logic to send the message to Firestore
  console.log(`Sending message to chat ${chatId}: ${message}`);
};

export default function home() {
  const router = useRouter();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (!user) {
        router.push('/'); // Redirect to sign-in page if not logged in
      }
    });
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to sign-in page after sign out
    } catch (error: any) {
      console.error('Sign Out Error:', error);
      alert(error.message);
    }
  };

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    console.log(chatId);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <aside className="w-1/4 bg-white p-4">
        <ChatList onSelectChat={selectChat} />
      </aside>
      <main className="flex-1 flex flex-col">
        {currentChatId ? (
          <>
            <ChatWindow chatId={currentChatId} />
            <MessageInput onSendMessage={(message) => sendMessage(currentChatId, message)} />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p>Select a chat to start messaging</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="mt-auto w-full py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}
