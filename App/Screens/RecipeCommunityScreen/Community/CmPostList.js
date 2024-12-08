import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Alert, ActionSheetIOS } from "react-native";
import CmPost from "../Community/CmPost"; // CmPost 컴포넌트
import { styles } from "../../../styles/RecipeCommunity/CmPostList.style";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { app2 } from "../../../../firebase"; // Firebase 초기화

const CmPostList = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const db = getFirestore(app2);

  // Firestore에서 게시물 가져오기
  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "community"));
      const fetchedPosts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        const timeDifference = getTimeDifference(createdAt); // 시간 차이를 계산
        return {
          id: doc.id,
          ...data,
          time: timeDifference, // 시간 차이를 추가
        };
      });
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("게시물 가져오기 실패:", error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 시간 차이를 계산하는 함수
  const getTimeDifference = (createdAt) => {
    const now = new Date();
    const diff = Math.floor((now - createdAt) / 1000); // 초 단위로 계산

    if (diff < 60) {
      return `${"1분"} 전`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)}분 전`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}시간 전`;
    } else {
      return `${Math.floor(diff / 86400)}일 전`;
    }
  };

  // 게시물 삭제 함수
  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "community", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      Alert.alert("삭제 완료", "게시물이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("게시물 삭제 실패:", error.message);
      Alert.alert("오류", "게시물 삭제에 실패했습니다.");
    }
  };

  // 옵션 버튼 핸들러
  const handleOptionsPress = (post) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["게시글 수정", "삭제", "닫기"],
        destructiveButtonIndex: 1, // "삭제"를 빨간색으로 표시
        cancelButtonIndex: 2, // "닫기" 버튼의 인덱스
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          navigation.navigate("ModifyCmPost", { post }); // 게시물 수정 화면으로 이동
        } else if (buttonIndex === 1) {
          Alert.alert(
            "게시물 삭제",
            "정말로 삭제하시겠습니까?",
            [
              { text: "취소", style: "cancel" },
              {
                text: "삭제",
                onPress: () => deletePost(post.id),
              },
            ],
            { cancelable: true }
          );
        }
      }
    );
  };

  // 게시물 렌더링
  const renderItem = ({ item }) => (
    <CmPost
      {...item}
      onPress={() => navigation.navigate('CmPostChat', { post: item })} // post 객체 전달
      onOptionsPress={() => handleOptionsPress(item)}
    />
  );
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id} // Firestore 문서 ID를 키로 설정
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default CmPostList;