import React, { useEffect, useState, useRef } from "react";
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
} from "react-native";
import styles from "./ChatRoom.style";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import NavigateBefore from "../../components/NavigateBefore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, onValue, set, push, update } from "firebase/database";

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
  const firestore = getFirestore();
  const realtimeDb = getDatabase();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.setOptions({
        headerShown: true,
        tabBarStyle: {
          height: 60,
          position: "absolute",
          bottom: 0,
          backgroundColor: "white",
        },
      });
    };
  }, [navigation]);

  useEffect(() => {
    const firestoreUnsubscribe = onSnapshot(
      doc(firestore, "chats", chatRoomId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatData = docSnapshot.data();
          setSelectedDate(
            chatData.appointmentDate ? new Date(chatData.appointmentDate) : null
          );
        } else {
          setSelectedDate(null);
        }
      }
    );

    const messagesRef = ref(realtimeDb, `chats/${chatRoomId}/messages`);
    const realtimeDbUnsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      const loadedMessages = messagesData
        ? Object.values(messagesData).sort((a, b) => a.timestamp - b.timestamp)
        : [];
      setMessages(loadedMessages);
    });

    return () => {
      firestoreUnsubscribe();
      realtimeDbUnsubscribe();
    };
  }, [chatRoomId, firestore, realtimeDb]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: currentUserUID,
        text: input.trim(),
        timestamp: Date.now(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        const messagesRef = ref(realtimeDb, `chats/${chatRoomId}/messages`);
        const newMessageRef = push(messagesRef);
        await set(newMessageRef, newMessage);

        const chatRef = ref(realtimeDb, `chats/${chatRoomId}`);
        await update(chatRef, {
          lastMessage: newMessage.text,
          lastMessageTime: newMessage.timestamp,
        });

        setInput("");
        flatListRef.current?.scrollToEnd({ animated: true });
      } catch (error) {
        console.error("메시지 전송 오류:", error);
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== newMessage.id)
        );
        Alert.alert("오류", "메시지를 전송하지 못했습니다. 다시 시도해주세요.");
      }
    }
  };

  const confirmRating = async () => {
    if (!selectedDate) {
      Alert.alert("오류", "약속 날짜가 설정되지 않았습니다.");
      return;
    }
  
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      Alert.alert("오류", "예약된 약속 날짜가 아직 지나지 않았습니다.");
      return;
    }
  
    if (rating <= 0) {
      Alert.alert("오류", "별점을 선택해주세요.");
      return;
    }
  
    setShowRatingModal(false);
  
    try {
      const chatRef = ref(realtimeDb, `chats/${chatRoomId}`);
  
      onValue(chatRef, async (snapshot) => {
        if (snapshot.exists()) {
          const chatData = snapshot.val();
          const { members } = chatData;
  
          const targetUserId = Object.keys(members).find(
            (id) => id !== currentUserUID
          );
  
          if (targetUserId) {
            const carbonFootprint = Math.floor(Math.random() * 50) + 1; // 랜덤 탄소 발자국 생성
  
            const updateUserData = async (userId, isCurrentUser) => {
              const userRef = doc(firestore, "users", userId);
              const userDoc = await getDoc(userRef);
  
              let ratings = {};
              let totalCarbonFootprint = 0;
  
              if (userDoc.exists()) {
                const userData = userDoc.data();
                ratings = userData.ratings || {};
                totalCarbonFootprint = userData.carbonFootprint || 0;
              }
  
              // 현재 채팅방의 별점 및 탄소 발자국 추가
              ratings[chatRoomId] = { rating, carbonFootprint };
              totalCarbonFootprint += carbonFootprint;
  
              // `ratings`에서 별점들만 추출
              const totalRatings = Object.values(ratings)
                .map((r) => r.rating)
                .filter((r) => typeof r === "number"); // 숫자 형식만 포함
  
              // 평균 별점 계산
              const averageRating =
                totalRatings.length > 0
                  ? totalRatings.reduce((sum, r) => sum + r, 0) / totalRatings.length
                  : 0; // 기본값 0 설정
  
              await setDoc(
                userRef,
                { ratings, averageRating, carbonFootprint: totalCarbonFootprint },
                { merge: true }
              );
  
              if (isCurrentUser) {
                console.log("현재 사용자의 데이터가 업데이트되었습니다.");
              } else {
                console.log("상대방 사용자의 데이터가 업데이트되었습니다.");
              }
            };
  
            // 현재 사용자와 상대방 데이터를 업데이트
            await Promise.all([
              updateUserData(currentUserUID, true),
              updateUserData(targetUserId, false),
            ]);
  
            Alert.alert(
              "평가 완료",
              `상대방에게 ${rating}점을 부여했습니다. 탄소 발자국은 ${carbonFootprint}g 입니다.`
            );
          } else {
            Alert.alert("오류", "채팅 상대방을 찾을 수 없습니다.");
          }
        } else {
          Alert.alert("오류", "Realtime Database에서 채팅 데이터를 찾을 수 없습니다.");
        }
      });
    } catch (error) {
      console.error("별점 저장 오류:", error);
      Alert.alert("오류", "별점 저장 중 문제가 발생했습니다.");
    }
  };
  

  const handleSetDate = () => {
    setShowDatePicker(true);
  };

  const onDateChange = async (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      Alert.alert(
        "약속 날짜",
        `약속 날짜가 ${date.getFullYear()}년 ${
          date.getMonth() + 1
        }월 ${date.getDate()}일로 설정되었습니다.`
      );

      try {
        const chatDocRef = doc(firestore, "chats", chatRoomId);
        await setDoc(
          chatDocRef,
          { appointmentDate: date.toISOString() },
          { merge: true }
        );
      } catch (error) {
        console.error("약속 날짜 저장 오류:", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <NavigateBefore onPress={() => navigation.goBack()} />
              <Text
                style={[styles.chatTitle, { textAlign: "left", paddingLeft: 30 }]}
              >
                {post.title || "채팅창"}
              </Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => setShowRatingModal(true)}
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
                  약속 날짜: {selectedDate.getFullYear()}년{" "}
                  {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
                </Text>
              </View>
            )}

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageContainer,
                    item.sender === currentUserUID
                      ? styles.selfMessage
                      : styles.otherMessage,
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
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              onLayout={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
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
      {/* 닫기 버튼 추가 */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setShowRatingModal(false)}
      >
        <Ionicons name="close" size={25} color="red" />
      </TouchableOpacity>

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
              color={star <= rating ? "#FFD700" : "#C0C0C0"}
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
