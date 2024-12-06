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

const ChatRoom = ({
  messages,
  input,
  setInput,
  handleSendMessage,
  currentRoom,
  setCurrentRoomId,
  userId,
}) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 저장
  const [showRatingModal, setShowRatingModal] = useState(false); // 별점 모달 상태
  const [rating, setRating] = useState(0); // 선택한 별점

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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSendMessageWithScroll = () => {
    handleSendMessage();
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
    // 모달을 먼저 닫고 Alert를 띄웁니다.
    setShowRatingModal(false); 
    Alert.alert(
      '별점',
      `별점 ${rating}개가 매겨졌습니다.`,
      [
        {
          text: '취소',
          onPress: () => {
            setShowRatingModal(true); // 취소 시 모달을 다시 열기
            console.log('취소 클릭');
          },
          style: 'cancel',
        },
        {
          text: '저장하기',
          onPress: () => {
            console.log('저장 클릭');
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 47 : 60}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={{ flex: 1 }}>
            {/* 상단 헤더 */}
            <View style={styles.header}>
              <NavigateBefore onPress={() => setCurrentRoomId(null)} />
              <Text style={[styles.chatTitle, { textAlign: 'left', paddingLeft: 30 }]}>
                {currentRoom?.name || '채팅창'}</Text>
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

            {/* 약속 날짜 표시 */}
            {selectedDate && (
              <View style={styles.dateDisplay}>
                <Text style={styles.dateText}>
                  약속 날짜: {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
                </Text>
              </View>
            )}

            {/* 메시지 리스트 */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageContainer,
                    item.sender === userId ? styles.selfMessage : styles.otherMessage,
                  ]}
                >
                  <Text
                    style={
                      item.sender === userId
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

            {/* 입력창 */}
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
                  onPress={handleSendMessageWithScroll}
                >
                  <Ionicons name="send" size={20} color="#2D754E" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* 약속 날짜 선택 */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* 별점 모달 */}
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
