import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from './Chat.Styles';

const ChatList = ({ chatList, setCurrentRoomId }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id.toString()} // id를 문자열로 변환
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            // setCurrentRoomId에 id만 전달
            onPress={() => setCurrentRoomId(item.id)}
          >
            <View style={styles.chatContent}>
              {/* 채팅방 사진 */}
              <Image
                source={require('../../../start-expo/assets/avatar.png')} // 기본 이미지 추가
                style={styles.chatImage}
              />
              <View style={styles.chatDetails}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{item.name || '채팅'}</Text>
                  <Text style={styles.chatLastMessageTime}>
                    {item.lastMessageTime || 'time'}
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
    </View>
  );
};

export default ChatList;
