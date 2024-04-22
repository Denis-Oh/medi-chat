'use client'; // client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
  const [currentChatName, setCurrentChatName] = useState<string>("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/'); // Redirect to sign-in page if not logged in
      }
    });
  }, [router]);

  useEffect(() => {
    const fetchChatName = async () => {
      if (currentChatId) {
        const chatDocRef = doc(db, 'chats', currentChatId); 
        const chatDoc = await getDoc(chatDocRef); 
        
        if (chatDoc.exists() && chatDoc.data()?.chatName) {
          setCurrentChatName(chatDoc.data()?.chatName); 
        } else {
          setCurrentChatName('Unnamed Chat'); 
        }
      }
    };

    fetchChatName(); // Fetch the chat name when currentChatId changes
  }, [currentChatId, db]); // Dependency array to rerun when currentChatId changes

  useEffect(() => {
    // sign out on page refresh
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      handleSignOut();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Cleanup event listener

    };
  }, []);

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
    <div className="flex h-screen bg-gray-100 text-black"> 
      <aside className="sm:w-1/4 w-2/6 bg-white sm:p-4 p-2 flex flex-col h-full overflow-y-auto"> 
        <ChatList onSelectChat={selectChat} />
        <button
          onClick={handleSignOut}
          className="mt-auto py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md"
        >
          Sign Out
        </button>
      </aside>
      <div className="flex flex-col sm:w-3/4 w-4/6">
        <div className="bg-white">
          <h2 className="text-lg font-bold p-3">{currentChatName}</h2> 
        </div>
        <main className="flex-1 flex flex-col overflow-y-auto pb-20"> 
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
        <div className="fixed bottom-0 right-0 sm:w-3/4 w-4/6 h-20 bg-white"> 
          <div>
            {currentChatId && <MessageInput chatId={currentChatId} />} 
          </div>
        </div>
      </div>
    </div>
  );
}
