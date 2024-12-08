import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Alert, TouchableOpacity } from "react-native";
import { styles } from "../../../styles/RecipeCommunity/CommentList.style";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { app2 } from "../../../../firebase"; // Firebase 초기화

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const db = getFirestore(app2);

  useEffect(() => {
    if (!postId) return;

    // Firestore 쿼리: 댓글 작성 시간 기준 정렬
    const q = query(
      collection(db, "community", postId, "comments"),
      orderBy("timestamp", "asc")
    );

    // 실시간 댓글 업데이트
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null,
      }));
      setComments(fetchedComments);
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 취소
  }, [postId]);

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, "community", postId, "comments", commentId));
      Alert.alert("알림", "댓글이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 실패:", error.message);
      Alert.alert("오류", "댓글 삭제에 실패했습니다.");
    }
  };

  // 댓글 수정 함수
  const handleEditComment = async (commentId, newContent) => {
    if (!newContent.trim()) {
      Alert.alert("알림", "내용을 입력해주세요.");
      return;
    }
    try {
      await updateDoc(doc(db, "community", postId, "comments", commentId), {
        content: newContent,
      });
      Alert.alert("알림", "댓글이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("댓글 수정 실패:", error.message);
      Alert.alert("오류", "댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제 확인
  const confirmDelete = (commentId) => {
    Alert.alert(
      "댓글 삭제",
      "정말로 댓글을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => handleDeleteComment(commentId),
        },
      ],
      { cancelable: true }
    );
  };

  // 댓글 수정 확인
  const confirmEdit = (commentId, currentContent) => {
    Alert.prompt(
      "댓글 수정",
      "새로운 내용을 입력해주세요.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "저장",
          onPress: (newContent) => handleEditComment(commentId, newContent),
        },
      ],
      "plain-text",
      currentContent // 기존 내용 표시
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentContainer}>
          {/* 사용자 아바타 */}
          <Image
            source={require("../../../../start-expo/assets/avatar.png")}
            style={styles.commentAvatar}
          />

          {/* 댓글 세부정보 */}
          <View style={styles.commentDetails}>
            {/* 작성자 이름 */}
            <Text style={styles.commentName}>
              {typeof comment.name === "string" ? comment.name : "익명"}
            </Text>

            {/* 작성 시간 */}
            <Text style={styles.commentTimestamp}>
              {comment.timestamp
                ? comment.timestamp.toLocaleString() // Date 객체를 문자열로 변환
                : "시간 없음"}
            </Text>

            {/* 댓글 내용 */}
            <Text style={styles.commentContent}>
              {typeof comment.content === "string"
                ? comment.content
                : "내용 없음"}
            </Text>

            {/* 댓글 옵션 */}
            <View style={styles.commentActions}>
              <TouchableOpacity
                onPress={() => confirmEdit(comment.id, comment.content)}
              >
                <Text style={styles.editButton}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmDelete(comment.id)}
              >
                <Text style={styles.deleteButton}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};


export default CommentList;