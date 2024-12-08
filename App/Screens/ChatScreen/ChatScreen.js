import React, { useEffect, useState, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
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
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState(route.params?.chatRoomId || null);
  const userId = 'currentUser'; // 실제 사용자 ID로 교체 필요

  // 채팅방 목록 로드
  useEffect(() => {
    const chatListRef = db.ref('chats');

    const handleChatListUpdate = (snapshot) => {
      const loadedChats = [];
      snapshot.forEach((childSnapshot) => {
        loadedChats.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      console.log('Loaded Chat List:', loadedChats);
      setChatList(loadedChats);
    };

    chatListRef.on('value', handleChatListUpdate);

    return () => chatListRef.off('value', handleChatListUpdate); // 리스너 해제
  }, []);

  // 선택된 채팅방 메시지 로드
  useEffect(() => {
    if (!currentRoomId) {
      setMessages([]); // 메시지가 없으면 초기화
      return;
    }

    const messagesRef = db.ref(`chats/${currentRoomId}/messages`).orderByChild('timestamp');

    const handleMessagesUpdate = (snapshot) => {
      const loadedMessages = [];
      snapshot.forEach((childSnapshot) => {
        loadedMessages.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      console.log('Loaded Messages:', loadedMessages);
      setMessages(loadedMessages);
    };

    messagesRef.on('value', handleMessagesUpdate);

    return () => messagesRef.off('value', handleMessagesUpdate); // 리스너 해제
  }, [currentRoomId]);

  // 메시지 전송
  const handleSendMessage = useCallback(() => {
    if (!input.trim() || !currentRoomId) {
      console.warn('메시지 또는 채팅방 ID가 없습니다.');
      return;
    }

    const messageRef = db.ref(`chats/${currentRoomId}/messages`).push();

    messageRef
      .set({
        sender: userId,
        text: input.trim(),
        timestamp: Date.now(),
      })
      .then(() => {
        db.ref(`chats/${currentRoomId}`).update({
          lastMessage: input.trim(),
          lastMessageTime: Date.now(),
        });
      })
      .catch((error) => {
        console.error('메시지 전송 오류:', error);
      });

    setInput('');
  }, [input, currentRoomId, userId]);

  // 새로운 채팅방 생성 및 목록 갱신
  const handleCreateChatRoom = useCallback((roomName) => {
    if (!roomName.trim()) {
      console.warn('채팅방 이름이 비어 있습니다.');
      return;
    }

    const chatRoomRef = db.ref('chats').push();

    chatRoomRef
      .set({
        name: roomName,
        lastMessage: '채팅을 시작해보세요!',
        lastMessageTime: Date.now(),
      })
      .then(() => {
        chatRoomRef.once('value').then((snapshot) => {
          setChatList((prev) => [
            ...prev,
            { id: snapshot.key, ...snapshot.val() },
          ]);
          console.log('새로운 채팅방 추가:', snapshot.val());
        });
      })
      .catch((error) => {
        console.error('채팅방 생성 오류:', error);
      });
  }, []);

  // 현재 선택된 채팅방을 렌더링
  if (currentRoomId) {
    return (
      <ChatRoom
        route={{
          params: {
            chatRoomId: currentRoomId,
            post: chatList.find((room) => room.id === currentRoomId)?.post || { title: '채팅방' },
          },
        }}
        messages={messages}
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        setCurrentRoomId={setCurrentRoomId}
        userId={userId}
      />
    );
  }

  // 채팅 리스트 렌더링
  return (
    <ChatList
      chatList={chatList}
      setCurrentRoomId={setCurrentRoomId}
      createChatRoom={handleCreateChatRoom}
    />
  );
};

export default ChatScreen;
