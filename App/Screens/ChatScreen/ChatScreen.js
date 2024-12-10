import React, { useEffect, useState, useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';

const firebaseConfig = {
  apiKey: "AIzaSyDAe4Vp0vpG0j6qWKqfhBLKe_X7tLfScjM",
  authDomain: "foodlink-2b531.firebaseapp.com",
  databaseURL: "https://foodlink-2b531-default-rtdb.firebaseio.com",
  projectId: "foodlink-2b531",
  storageBucket: "foodlink-2b531.firebasestorage.app",
  messagingSenderId: "247328439601",
  appId: "1:247328439601:web:855b1ac29ec44e105b8410",
  measurementId: "G-89B7DRZXEC",
};

// Firebase 초기화
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState(route.params?.chatRoomId || null);
  const userId = 'currentUser'; 

  // 채팅방 목록 로드
  useEffect(() => {
    const chatListRef = db.ref('chats');

    const handleChatListUpdate = (snapshot) => {
      const loadedChats = [];
      snapshot.forEach((childSnapshot) => {
        const chatRoom = { id: childSnapshot.key, ...childSnapshot.val() };
        if (chatRoom.members?.[userId]) {
          loadedChats.push(chatRoom);
        }
      });
      setChatList(loadedChats);
    };

    chatListRef.on('value', handleChatListUpdate);
    return () => chatListRef.off('value', handleChatListUpdate);
  }, [userId]);

  // 선택된 채팅방의 메시지 로드
  useEffect(() => {
    if (!currentRoomId) {
      setMessages([]); 
      return;
    }

    const messagesRef = db.ref(`chats/${currentRoomId}/messages`).orderByChild('timestamp');
    const handleMessagesUpdate = (snapshot) => {
      const loadedMessages = [];
      snapshot.forEach((childSnapshot) => {
        loadedMessages.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setMessages(loadedMessages);
    };

    messagesRef.on('value', handleMessagesUpdate);
    return () => messagesRef.off('value', handleMessagesUpdate);
  }, [currentRoomId]);

  // 메시지 전송
  const handleSendMessage = useCallback(() => {
    if (!input.trim() || !currentRoomId) return;

    const messageRef = db.ref(`chats/${currentRoomId}/messages`).push();
    messageRef.set({
      sender: userId,
      text: input.trim(),
      timestamp: Date.now(),
    });

    db.ref(`chats/${currentRoomId}`).update({
      lastMessage: input.trim(),
      lastMessageTime: Date.now(),
    });

    setInput('');
  }, [input, currentRoomId, userId]);

  // 채팅방 렌더링
  if (currentRoomId) {
    const currentChatRoom = chatList.find((room) => room.id === currentRoomId);
    return (
      <ChatRoom
        route={{ params: { chatRoomId: currentRoomId, post: currentChatRoom?.post || { title: '채팅방' } } }}
        messages={messages}
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        setCurrentRoomId={setCurrentRoomId}
        userId={userId}
      />
    );
  }

  return (
    <ChatList
      chatList={chatList}
      setCurrentRoomId={(chatRoomId) => 
        navigation.navigate('ChatScreen', { chatRoomId })
      }
    />
  );
};

export default ChatScreen;
