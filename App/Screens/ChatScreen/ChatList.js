import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from './Chat.Styles';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const ChatList = ({ setCurrentRoomId, createChatRoom }) => {
  const [chatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const chatListRef = ref(db, 'chats');

    // Firebase에서 채팅 목록 데이터 가져오기
    const unsubscribe = onValue(chatListRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const chats = Object.keys(data).map((key) => ({
          id: key,
          lastMessage: data[key]?.lastMessage || '아직 대화를 하지 않았습니다.',
          lastMessageTime: data[key]?.lastMessageTime
            ? new Date(data[key].lastMessageTime).toLocaleString()
            : '시간 정보 없음',
          post: {
            id: data[key]?.postId || 'unknown',
            title: data[key]?.postTitle || '제목 없음',
          },
        }));
        setChatList(chats);
      } else {
        setChatList([]);
      }
      setIsLoading(false);
    });

    // 컴포넌트 언마운트 시 Firebase 리스너 제거
    return () => unsubscribe();
  }, []);

  // 채팅방 클릭 시 동작
  const handleChatClick = (chatRoomId, post) => {
    if (!chatRoomId) {
      console.error('ChatRoomId is missing!');
      return;
    }

    console.log(`Navigating to ChatScreen with chatRoomId: ${chatRoomId}, post:`, post);
    setCurrentRoomId(chatRoomId);
    navigation.navigate('ChatScreen', {
      chatRoomId,
      post: post || { title: '채팅방 제목 없음' },
    });
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
              onPress={() => handleChatClick(item.id, item.post)}
            >
              <View style={styles.chatContent}>
                <Image
                  source={require('../../../start-expo/assets/avatar.png')}
                  style={styles.chatImage}
                />
                <View style={styles.chatDetails}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>
                      {item.post.title || '채팅방 제목 없음'}
                    </Text>
                    <Text style={styles.chatLastMessageTime}>
                      {item.lastMessageTime || '시간 정보 없음'}
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
        <Text style={{ textAlign: 'center', color: '#2D754E', fontWeight: 'bold' }}>
          + 채팅방 추가
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatList;