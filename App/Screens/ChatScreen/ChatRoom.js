import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Modal,
} from 'react-native';
import styles from './ChatRoom.style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import NavigateBefore from '../../components/NavigateBefore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const ChatRoom = ({ route }) => {
  const { chatRoomId, post } = route.params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const currentUserUID = getAuth()?.currentUser?.uid;
  const db = firebase.database();

  // 헤더 숨김 및 복원
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: { display: 'none' },
    });

    return () => {
      navigation.setOptions({
        headerShown: true,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
        },
      });
    };
  }, [navigation]);

  // 메시지 로드
  useEffect(() => {
    const messagesRef = db.ref(`chats/${chatRoomId}/messages`);

    const handleMessageUpdate = (snapshot) => {
      const loadedMessages = [];
      snapshot.forEach((child) => {
        loadedMessages.push({ id: child.key, ...child.val() });
      });
      setMessages(loadedMessages);
    };

    messagesRef.on("value", handleMessageUpdate);

    return () => messagesRef.off("value", handleMessageUpdate);
  }, [chatRoomId]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const sendMessage = () => {
    if (input.trim()) {
      const messageRef = db.ref(`chats/${chatRoomId}/messages`).push();
      messageRef
        .set({
          sender: currentUserUID,
          text: input.trim(),
          timestamp: Date.now(),
        })
        .then(() => {
          db.ref(`chats/${chatRoomId}`).update({
            lastMessage: input.trim(),
            lastMessageTime: Date.now(),
          });
          setInput("");
          flatListRef.current?.scrollToEnd({ animated: true });
        })
        .catch((error) => {
          console.error("메시지 전송 오류:", error);
        });
    }
  };

  const handleSetDate = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      Alert.alert(
        '약속 날짜',
        `약속 날짜가 ${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일로 설정되었습니다.`
      );
    }
  };

  const openRatingModal = () => {
    setShowRatingModal(true);
  };

  const confirmRating = () => {
    setShowRatingModal(false);
    Alert.alert(
      '별점',
      `별점 ${rating}개가 매겨졌습니다.`,
      [
        {
          text: '취소',
          onPress: () => setShowRatingModal(true),
          style: 'cancel',
        },
        {
          text: '저장하기',
          onPress: () => {
            console.log('별점 저장 완료:', rating);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0} // 기존 값을 줄이거나 0으로 설정
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <NavigateBefore onPress={() => navigation.goBack()} />
              <Text style={[styles.chatTitle, { textAlign: 'left', paddingLeft: 30 }]}>
                {post.title || '채팅창'}
              </Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={openRatingModal}
                >
                  <Ionicons name="star" size={20} color="#FFD700" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleSetDate}
                >
                  <Ionicons name="calendar" size={20} color="#2D754E" />
                </TouchableOpacity>
              </View>
            </View>

            {selectedDate && (
              <View style={styles.dateDisplay}>
                <Text style={styles.dateText}>
                  약속 날짜: {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
                </Text>
              </View>
            )}

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageContainer,
                    item.sender === currentUserUID ? styles.selfMessage : styles.otherMessage,
                  ]}
                >
                  <Text
                    style={
                      item.sender === currentUserUID
                        ? styles.messageText
                        : styles.otherMessageText
                    }
                  >
                    {item.text}
                  </Text>
                </View>
              )}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="메시지를 입력해주세요."
                  value={input}
                  onChangeText={setInput}
                  multiline
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={sendMessage}
                >
                  <Ionicons name="send" size={20} color="#2D754E" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Modal
          transparent={true}
          visible={showRatingModal}
          animationType="fade"
          onRequestClose={() => setShowRatingModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>별점 매기기</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.starContainer}
                  >
                    <Ionicons
                      name="star"
                      size={25}
                      color={star <= rating ? '#FFD700' : '#C0C0C0'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmRating}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatRoom;
