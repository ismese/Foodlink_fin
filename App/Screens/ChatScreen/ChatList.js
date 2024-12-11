import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import styles from './Chat.Styles';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ChatList = ({ setCurrentRoomId, createChatRoom }) => {
  const [chatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUserUID = auth.currentUser?.uid;
  const firestore = getFirestore();

  useEffect(() => {
    if (!currentUserUID) {
      console.error('로그인된 사용자가 없습니다.');
      return;
    }

    const db = getDatabase();
    const chatListRef = ref(db, 'chats');

    // Firebase에서 로그인한 사용자의 채팅 목록 데이터 가져오기
    const unsubscribe = onValue(chatListRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userChats = await Promise.all(
          Object.keys(data)
            .filter((key) => data[key]?.members?.[currentUserUID]) // 사용자가 속한 채팅방만 필터링
            .map(async (key) => {
              const memberIds = Object.keys(data[key]?.members || {});
              const otherUserId = memberIds.find((id) => id !== currentUserUID);

              // Firestore에서 상대방 닉네임 가져오기
              let otherUserNickname = '알 수 없음';
              if (otherUserId) {
                try {
                  const userDocRef = doc(firestore, 'users', otherUserId);
                  const userDoc = await getDoc(userDocRef);
                  if (userDoc.exists()) {
                    otherUserNickname = userDoc.data().nickname || '알 수 없음';
                  }
                } catch (error) {
                  console.error('닉네임 가져오기 오류:', error);
                }
              }

              return {
                id: key,
                lastMessage: data[key]?.lastMessage || '아직 대화를 하지 않았습니다.',
                lastMessageTime: data[key]?.lastMessageTime
                  ? new Date(data[key].lastMessageTime).toISOString()
                  : null,
                nickname: otherUserNickname, // 상대방 닉네임
              };
            })
        );

        userChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)); // 최근 메시지 우선 정렬
        setChatList(userChats);
      } else {
        setChatList([]);
      }
      setIsLoading(false);
    });

    // 컴포넌트 언마운트 시 Firebase 리스너 제거
    return () => unsubscribe();
  }, [currentUserUID, firestore]);

  // 채팅방 클릭 시 동작
  const handleChatClick = (chatRoomId) => {
    if (!chatRoomId) {
      console.error('ChatRoomId is missing!');
      return;
    }

    console.log(`Navigating to ChatScreen with chatRoomId: ${chatRoomId}`);
    setCurrentRoomId(chatRoomId);
    navigation.navigate('ChatScreen', { chatRoomId });
  };

  // 채팅방 삭제 확인 및 삭제
  const confirmDeleteChat = (chatRoomId) => {
    Alert.alert(
      '채팅방 삭제',
      '이 채팅방을 삭제하시겠습니까? 모든 데이터가 삭제됩니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = getDatabase();
              const chatRef = ref(db, `chats/${chatRoomId}`);
              await remove(chatRef); // Firebase에서 데이터 완전히 삭제
              setChatList((prev) => prev.filter((chat) => chat.id !== chatRoomId));
              Alert.alert('삭제 완료', '채팅방 및 관련 데이터가 삭제되었습니다.');
            } catch (error) {
              console.error('채팅방 삭제 중 오류 발생:', error);
              Alert.alert('오류', '채팅방 삭제 중 문제가 발생했습니다.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
          채팅방 목록을 불러오는 중입니다...
        </Text>
      ) : chatList.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
          생성된 채팅방이 없습니다.
        </Text>
      ) : (
        <FlatList
          data={chatList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => handleChatClick(item.id)}
              onLongPress={() => confirmDeleteChat(item.id)} // 길게 누르면 삭제
            >
              <View style={styles.chatContent}>
                <Image
                  source={require('../../../start-expo/assets/avatar.png')}
                  style={styles.chatImage}
                />
                <View style={styles.chatDetails}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>
                      {item.nickname || '알 수 없음'}
                    </Text>
                    <Text style={styles.chatLastMessageTime}>
                      {item.lastMessageTime
                        ? new Date(item.lastMessageTime).toLocaleString()
                        : '시간 정보 없음'}
                    </Text>
                  </View>
                  <Text style={styles.chatLastMessage}>
                    {item.lastMessage || '아직 대화를 하지 않았습니다.'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chatList}
        />
      )}
      <TouchableOpacity
        style={{ margin: 20 }}
        onPress={() => createChatRoom('새 채팅방')}
      >
      </TouchableOpacity>
    </View>
  );
};

export default ChatList;
