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
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import NavigateBefore from "../components/NavigateBefore";

const FeedScreen = ({ route, navigation }) => {
  const { post } = route.params || {}; 
  const [showFavoriteBox, setShowFavoriteBox] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [postOwnerNickname, setPostOwnerNickname] = useState("알 수 없음");
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUserUID = auth.currentUser?.uid; 
  const db = firebase.database(); 
  const firestore = getFirestore(); 
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
        setLoading(false); 
      }
    };

    fetchPostOwnerNickname();
  }, [post?.userUID]);

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

  const isPostOwner = currentUserUID === post?.userUID;

  const handleChatPress = async () => {
    if (!currentUserUID || !post?.userUID) return;
  
    try {
      const chatRoomId = `${post.id}_${currentUserUID}_${post.userUID}`; 
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
  
  
  const handleModifyPress = () => {
    if (!post?.id) {
      Alert.alert("오류", "Firestore 문서 ID가 유효하지 않습니다.");
      return;
    }

    navigation.navigate("MyPostModify", { docId: post.id, postData: post });
  };


  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>게시물 데이터를 불러오지 못했습니다.</Text>
      </SafeAreaView>
    );
  }

  return (


    <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <NavigateBefore onPress={() => navigation.goBack()} />
            <Text style={styles.title}>게시물</Text>
            <View style={styles.emptySpace} />
          </View>


    <SafeAreaView style={styles.container}>
      <PostHeader
        post={post}
        calculateTimeAgo={calculateTimeAgo}
        styles={styles}
        postOwnerNickname={postOwnerNickname} 
      />
      

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>가격: </Text>
          <Text style={styles.price}>
            {post.priceOrExchange
              ? `${Number(post.priceOrExchange).toLocaleString()}원`
              : "0원"}
          </Text>
        </View>

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
    </SafeAreaView>
  );
};

export default FeedScreen;
