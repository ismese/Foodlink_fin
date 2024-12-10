import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import PostHeader from "../post/PostHeader";
import PostDescription from "../post/PostDescription";
import styles from "../post/FeedScreen.style";
import FavoriteBox from "../components/FavoriteBox";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const FeedScreen = ({ route, navigation }) => {
  const { post } = route.params || {}; // 기본값 설정하여 안전하게 처리
  const [showFavoriteBox, setShowFavoriteBox] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [postOwnerNickname, setPostOwnerNickname] = useState("알 수 없음");
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const auth = getAuth();
  const currentUserUID = auth.currentUser?.uid; // 현재 로그인된 사용자 UID
  const db = firebase.database(); // Realtime Database 인스턴스
  const firestore = getFirestore(); // Firestore 인스턴스

  // 게시물 작성자의 닉네임 가져오기
  useEffect(() => {
    const fetchPostOwnerNickname = async () => {
      if (!post?.userUID) {
        setPostOwnerNickname("작성자 정보 없음");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(firestore, "users", post.userUID);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setPostOwnerNickname(userDoc.data().nickname || "알 수 없음");
        } else {
          setPostOwnerNickname("닉네임 없음");
        }
      } catch (error) {
        console.error("작성자 닉네임 가져오기 중 오류:", error);
        setPostOwnerNickname("오류 발생");
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchPostOwnerNickname();
  }, [post?.userUID]);

  // 시간 계산
  const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const postDate = createdAt?.toDate?.() || new Date(createdAt);

    if (isNaN(postDate.getTime())) return "알 수 없음";

    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return `방금 전`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  // 찜하기 처리
  const handleFavorite = (action) => {
    setShowFavoriteBox(false);
    setFeedbackMessage(
      action === "confirm" ? "이 게시물을 찜하셨습니다" : "취소되었습니다"
    );
    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  const isPostOwner = currentUserUID === post?.userUID; // 게시물 작성자인지 확인

  const handleChatPress = async () => {
    if (!currentUserUID || !post?.userUID) return;
  
    try {
      const chatRoomId = `${post.id}_${currentUserUID}_${post.userUID}`; // 고유한 chatRoomId 생성
      const chatRoomRef = db.ref(`chats/${chatRoomId}`);
      const chatRoomSnapshot = await chatRoomRef.get();
  
      if (!chatRoomSnapshot.exists()) {
        const chatRoomData = {
          members: {
            [currentUserUID]: true,
            [post.userUID]: true,
          },
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          postId: post.id || "unknown",
          postTitle: post.title || "제목 없음",
          lastMessage: "채팅을 시작해보세요!",
          lastMessageTime: firebase.database.ServerValue.TIMESTAMP,
        };
        await chatRoomRef.set(chatRoomData);
      }
  
      navigation.navigate("ChatScreen", {
        chatRoomId,
        post,
      });
    } catch (error) {
      console.error("채팅방 생성 중 오류:", error);
      Alert.alert("오류", "채팅방 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };
  
  
  // 수정 버튼 클릭 처리
  const handleModifyPress = () => {
    if (!post?.id) {
      Alert.alert("오류", "Firestore 문서 ID가 유효하지 않습니다.");
      return;
    }

    navigation.navigate("MyPostModify", { docId: post.id, postData: post });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>게시물 데이터를 불러오지 못했습니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 게시물 상단 헤더 */}
      <PostHeader
        post={post}
        calculateTimeAgo={calculateTimeAgo}
        onBackPress={navigation.goBack}
        styles={styles}
      />

      {/* 작성자 정보, 유통기한, 카테고리 */}
      <View style={styles.ownerInfo}>
        <Text style={styles.ownerText}>작성자: {postOwnerNickname}</Text>
        <Text style={styles.expirationText}>
          유통기한: {post.expirationDate || "정보 없음"}
        </Text>
        <Text style={styles.categoryText}>
          카테고리: {post.categories?.join(", ") || "카테고리 없음"}
        </Text>
      </View>

      {/* 게시물 설명 */}
      <PostDescription description={post.description} styles={styles} />

      {/* 하단 바 */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setShowFavoriteBox(true)}
          >
            <Text style={styles.favoriteIcon}>♥</Text>
          </TouchableOpacity>
          <Text style={styles.price}>
            {post.priceOrExchange
              ? `${Number(post.priceOrExchange).toLocaleString()}원`
              : "0원"}
          </Text>
        </View>

        {/* 수정하기 또는 채팅하기 버튼 */}
        {isPostOwner ? (
          <TouchableOpacity style={styles.chatButton} onPress={handleModifyPress}>
            <Text style={styles.chatButtonText}>수정하기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
            <Text style={styles.chatButtonText}>채팅하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FeedScreen;
