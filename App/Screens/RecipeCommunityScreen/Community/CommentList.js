import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { styles } from "../../../styles/RecipeCommunity/CommentList.style";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
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
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default CommentList;