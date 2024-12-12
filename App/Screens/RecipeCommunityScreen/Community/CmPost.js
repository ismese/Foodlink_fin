import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getFirestore, collection, onSnapshot, doc } from "firebase/firestore";
import { styles } from "../../../styles/RecipeCommunity/CmPost.style";
import { app2 } from "../../../../firebase"; // Firebase 초기화

const CmPost = ({ id, title, content, distance, time, onPress, onOptionsPress }) => {
  const [likes, setLikes] = useState(0); // 좋아요 수
  const [comments, setComments] = useState(0); // 댓글 수
  const db = getFirestore(app2);

  useEffect(() => {
    if (!id) return;

    // Firestore에서 좋아요 수 구독
    const unsubscribeLikes = onSnapshot(
      doc(db, "community", id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setLikes(data?.likes || 0); // 좋아요 수 업데이트
        }
      },
      (error) => {
        console.error("좋아요 데이터 구독 실패:", error.message);
      }
    );

    // Firestore에서 댓글 수 구독
    const unsubscribeComments = onSnapshot(
      collection(db, "community", id, "comments"),
      (querySnapshot) => {
        setComments(querySnapshot.size); // 댓글 수 업데이트
      },
      (error) => {
        console.error("댓글 데이터 구독 실패:", error.message);
      }
    );

    return () => {
      unsubscribeLikes(); // 좋아요 수 구독 취소
      unsubscribeComments(); // 댓글 수 구독 취소
    };
  }, [id]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
    {/* 게시물 제목과 옵션 버튼 */}
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onOptionsPress} style={styles.optionsButton}>
        <MaterialIcons name="more-vert" size={15} color="#8C8C8C" />
      </TouchableOpacity>
    </View>

      {/* 게시물 내용 */}
      <Text style={styles.content}>{content}</Text>

      {/* 게시물 정보 */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{time}</Text>
      </View>

      {/* 좋아요, 댓글, 찜 버튼 */}
      <View style={styles.actionsContainer}>
        <View style={styles.action}>
          <MaterialIcons name="favorite-border" size={16} color="#8C8C8C" />
          <Text style={styles.actionText}>{likes}</Text>
        </View>
        <View style={styles.action}>
          <MaterialIcons name="chat-bubble-outline" size={16} color="#8C8C8C" />
          <Text style={styles.actionText}>{comments}</Text>
        </View>  
      </View>
    </TouchableOpacity>
  );
};

export default CmPost;
