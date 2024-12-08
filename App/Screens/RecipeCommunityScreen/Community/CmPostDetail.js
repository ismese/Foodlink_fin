import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "../../../styles/RecipeCommunity/CmPostDetail.style";
import { MaterialIcons } from "@expo/vector-icons";
import { getFirestore, collection, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { app2 } from "../../../../firebase"; // Firebase 초기화

const CmPostDetail = ({ post }) => {
  const [commentCount, setCommentCount] = useState(0); // 댓글 수 상태 관리
  const [likes, setLikes] = useState(post?.likes || 0); // 좋아요 수 상태 관리
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태 관리
  const [nickname, setNickname] = useState("익명"); // 작성자 닉네임
  const db = getFirestore(app2);

  useEffect(() => {
    if (!post?.id) return;

    // Firestore 댓글 수 구독
    const unsubscribeComments = onSnapshot(
      collection(db, "community", post.id, "comments"),
      (querySnapshot) => {
        setCommentCount(querySnapshot.size); // 댓글 수 업데이트
      },
      (error) => {
        console.error("댓글 수 구독 실패:", error.message);
      }
    );

    // Firestore 좋아요 상태 초기화
    const unsubscribeLikes = onSnapshot(
      doc(db, "community", post.id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setLikes(data?.likes || 0); // 좋아요 수 업데이트
        }
      },
      (error) => {
        console.error("좋아요 상태 구독 실패:", error.message);
      }
    );

    // Firestore에서 닉네임 가져오기
    const fetchNickname = async () => {
      try {
        const postRef = doc(db, "community", post.id);
        const postSnapshot = await getDoc(postRef);
        if (postSnapshot.exists()) {
          const postData = postSnapshot.data();
          setNickname(postData.nickname || "익명"); // community의 nickname 필드 가져오기
        }
      } catch (error) {
        console.error("닉네임 가져오기 실패:", error.message);
      }
    };

    fetchNickname();

    return () => {
      unsubscribeComments(); // 댓글 수 구독 취소
      unsubscribeLikes(); // 좋아요 수 구독 취소
    };
  }, [post?.id]);

  // 좋아요 버튼 클릭 핸들러
  const handleLike = async () => {
    if (!post?.id) return;

    try {
      const postRef = doc(db, "community", post.id);

      // 좋아요 수 업데이트
      const newLikes = isLiked ? likes - 1 : likes + 1;
      setLikes(newLikes);
      setIsLiked(!isLiked);

      // Firestore에 업데이트
      await updateDoc(postRef, {
        likes: newLikes,
      });
    } catch (error) {
      console.error("좋아요 업데이트 실패:", error.message);
    }
  };

  return (
    <View style={styles.postContainer}>
      {/* 작성자 정보 */}
      <View style={styles.authorContainer}>
        <Image
          source={require("../../../../start-expo/assets/avatar.png")}
          style={styles.authorImage}
        />
        <View>
          <Text style={styles.authorName}>{nickname || "익명"}</Text> 
          <Text style={styles.timestamp}>
            {post?.createdAt ? new Date(post.createdAt).toLocaleString() : "작성 날짜 없음"}
          </Text>
        </View>
      </View>

      {/* 제목 및 내용 */}
      <Text style={styles.postTitle}>{post?.title || "제목 없음"}</Text>
      <Text style={styles.postContent}>{post?.content || "내용 없음"}</Text>

      {/* 좋아요 및 댓글 */}
      <View style={styles.actionContainer}>
        {/* 좋아요 버튼 */}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={handleLike}
        >
          <MaterialIcons
            name={isLiked ? "thumb-up" : "thumb-up-off-alt"}
            size={16}
            color={isLiked ? "#2D754E" : "#8C8C8C"}
          />
          <Text style={[styles.actionText, { marginLeft: 5, color: isLiked ? "#2D754E" : "#8C8C8C" }]}>
            {likes}
          </Text>
        </TouchableOpacity>

        {/* 댓글 수 */}
        <View style={styles.commentContainer}>
          <MaterialIcons name="chat-bubble-outline" size={16} color="#8C8C8C" />
          <Text style={styles.actionText}>{commentCount}</Text>
        </View>
      </View>
    </View>
  );
};

export default CmPostDetail;