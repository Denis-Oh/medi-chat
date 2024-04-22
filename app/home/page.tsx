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

export default function Home() {
  const router = useRouter();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
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
    <div className="flex h-screen bg-gray-100 text-black"> {/* Full height screen */}
      <aside className="w-1/4 bg-white p-4 flex flex-col h-full overflow-y-auto"> {/* Independent scroll */}
        <ChatList onSelectChat={selectChat} />
        <button
          onClick={handleSignOut}
          className="mt-auto py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md"
        >
          Sign Out
        </button>
      </aside>
      <div className="flex flex-col w-3/4">
        <main className="flex-1 flex flex-col overflow-y-auto pb-20"> {/* Independent scroll */}
          {currentChatId ? (
            <>
              <ChatWindow chatId={currentChatId} />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </main>
        <div className="fixed bottom-0 right-0 w-3/4 h-20 bg-white"> {/* Keep MessageInput at the bottom of the screen */}
          <div>
            {currentChatId && <MessageInput chatId={currentChatId} />} {/* Fixed position */}
          </div>
        </div>
      </div>
    </div>
  );
}
