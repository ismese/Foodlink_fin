import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';

const firebaseConfig = {
  apiKey: "AIzaSyDAe4Vp0vpG0j6qWKqfhBLKe_X7tLfScjM",
  authDomain: "foodlink-2b531.firebaseapp.com",
  databaseURL: "https://foodlink-2b531-default-rtdb.firebaseio.com",
  projectId: "foodlink-2b531",
  storageBucket: "foodlink-2b531.firebaseapp.com",
  messagingSenderId: "247328439601",
  appId: "1:247328439601:web:855b1ac29ec44e105b8410",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const ChatScreen = () => {
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const userId = 'currentUser';

  useEffect(() => {
    const chatListRef = db.ref('chats');
    const listener = chatListRef.on('value', (snapshot) => {
      const loadedChats = [];
      snapshot.forEach((childSnapshot) => {
        loadedChats.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setChatList(loadedChats);
    });

    return () => chatListRef.off('value', listener);
  }, []);

  useEffect(() => {
    if (!currentRoomId) return;
    const messagesRef = db.ref(`chats/${currentRoomId}/messages`);
    const listener = messagesRef.on('value', (snapshot) => {
      const loadedMessages = [];
      snapshot.forEach((childSnapshot) => {
        loadedMessages.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setMessages(loadedMessages);
    });

    return () => messagesRef.off('value', listener);
  }, [currentRoomId]);

  const handleSendMessage = () => {
    if (!input.trim() || !currentRoomId) return;

    const messageRef = db.ref(`chats/${currentRoomId}/messages`).push();
    messageRef.set({
      sender: userId,
      text: input,
      timestamp: Date.now(),
    });

    setInput('');
  };

  if (currentRoomId) {
    return (
      <ChatRoom
        messages={messages}
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        setCurrentRoomId={setCurrentRoomId}
        userId={userId}
      />
    );
  }

  return <ChatList chatList={chatList} setCurrentRoomId={setCurrentRoomId} />;
};

export default ChatScreen;
