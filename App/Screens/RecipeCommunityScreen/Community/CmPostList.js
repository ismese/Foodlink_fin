import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import CmPost from "../Community/CmPost"; // CmPost 컴포넌트
import { styles } from "../../../styles/RecipeCommunity/CmPostList.style";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { app2 } from "../../../../firebase"; // Firebase 초기화

const CmPostList = ({ navigation }) => {
  const [posts, setPosts] = useState([]); // 게시물 상태
  const db = getFirestore(app2); // Firestore 인스턴스

  // Firestore에서 게시물 가져오기 (createdAt 기준 내림차순 정렬)
  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "community"), orderBy("createdAt", "desc")); // 내림차순 정렬
      const querySnapshot = await getDocs(q);
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
    fetchPosts(); // 컴포넌트가 마운트될 때 게시물 가져오기
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

  // 게시물 렌더링
  const renderItem = ({ item }) => (
    <CmPost
      {...item}
      onPress={() => navigation.navigate('CmPostChat', { post: item })} // post 객체 전달
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