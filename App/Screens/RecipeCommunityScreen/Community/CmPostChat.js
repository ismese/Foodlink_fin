import React, { useState, useEffect } from "react";
import { View, TextInput, SafeAreaView, Text, TouchableOpacity, Alert } from "react-native";
import { styles } from "../../../styles/RecipeCommunity/CmPostChat.style";
import NavigateBefore from "../../../components/NavigateBefore";
import CmPostDetail from "../Community/CmPostDetail";
import CommentList from "../Community/CommentList";
import { MaterialIcons } from "@expo/vector-icons";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app2 } from "../../../../firebase"; // Firebase 초기화

const CmPostChat = ({ navigation, route }) => {
  const { post } = route.params || {}; // route.params가 없으면 기본값으로 빈 객체 설정
  const [comment, setComment] = useState(""); // 댓글 입력 상태 관리
  const [nickname, setNickname] = useState(""); // 로그인한 사용자 닉네임
  const db = getFirestore(app2); // Firestore 초기화
  const usersDb = getFirestore(); // 형의 Firestore
  const auth = getAuth(); // 형의 Auth

  // 로그인한 사용자 닉네임 가져오기
  useEffect(() => {
    const fetchNickname = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(usersDb, "users", user.uid); // 'users' 컬렉션에서 UID로 사용자 문서 가져오기
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const fetchedNickname = userDoc.data().nickname || "익명";
            console.log("가져온 닉네임:", fetchedNickname); // 디버깅 로그
            setNickname(fetchedNickname);
          } else {
            console.log("사용자 문서 없음"); // 디버깅 로그
          }
        } catch (error) {
          console.error("닉네임 가져오기 실패:", error); // 에러 로그
        }
      } else {
        console.log("로그인된 사용자 없음"); // 디버깅 로그
      }
    };

    fetchNickname();
  }, [auth, usersDb]);

  // 댓글 저장 함수
  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert("알림", "댓글을 입력해주세요."); // 사용자 알림 추가
      return;
    }
    try {
      // Firestore에 댓글 저장
      await addDoc(collection(db, "community", post.id, "comments"), {
        name: nickname || "익명", // 로그인한 사용자 이름 (닉네임)
        content: comment.trim(),
        timestamp: serverTimestamp(),
      });
      setComment(""); // 입력란 초기화
      Alert.alert("알림", "댓글이 성공적으로 등록되었습니다."); // 성공 알림
    } catch (error) {
      console.error("댓글 저장 실패:", error.message);
      Alert.alert("오류", "댓글 작성에 실패했습니다. 다시 시도해주세요."); // 에러 알림
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <NavigateBefore onPress={() => navigation.goBack()} />
        <Text style={styles.title}>커뮤니티</Text>
        <View style={styles.emptySpace} />
      </View>

      {/* 글 디테일 */}
      {post && post.id ? (
        <CmPostDetail post={post} /> // post 객체 전달
      ) : (
        <Text style={styles.errorText}>게시물 데이터를 불러올 수 없습니다.</Text>
      )}

      {/* 댓글창 */}
      {post.id && (
        <CommentList postId={post.id} /> // postId 전달
      )}

      {/* 댓글 입력창 */}
      {post.id && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요"
            placeholderTextColor="#8C8C8C"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity onPress={handleCommentSubmit}>
            <MaterialIcons name="send" size={24} color="#2D754E" style={{ marginLeft: 14 }} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CmPostChat;