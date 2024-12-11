import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Alert, ActionSheetIOS } from "react-native";
import CmPost from "../Community/CmPost"; 
import { styles } from "../../../styles/RecipeCommunity/CmPostList.style";
import { getFirestore, collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app2 } from "../../../../firebase"; 

const MyCmPostList = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [userNickname, setUserNickname] = useState(""); // 현재 사용자 닉네임
  const db = getFirestore(app2); 
  const usersDb = getFirestore(); 
  const auth = getAuth();

  // 🔥 현재 로그인된 사용자 닉네임 가져오기
  const fetchUserNickname = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        const userDocRef = doc(usersDb, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const fetchedNickname = userDoc.data().nickname || "익명";
          setUserNickname(fetchedNickname); 
        }
      } catch (error) {
        console.error("닉네임 가져오기 실패:", error.message);
      }
    } else {
      console.log("로그인된 사용자가 없습니다.");
    }
  };

  // 🔥 Firestore에서 게시물 가져오기
  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "community"));
      const fetchedPosts = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
          const timeDifference = getTimeDifference(createdAt); // 🔥 시간 차이 계산
          return {
            id: doc.id,
            ...data,
            timeDifference, // 🔥 몇일 전, 몇시간 전 필드 추가
          };
        })
        .filter((post) => post.nickname === userNickname); 
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("게시물 가져오기 실패:", error.message);
    }
  };

  // 🔥 시간 차이를 계산하는 함수
  const getTimeDifference = (createdAt) => {
    const now = new Date();
    const diff = Math.floor((now - createdAt) / 1000); // 초 단위로 계산

    if (diff < 60) {
      return `${diff}초 전`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)}분 전`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}시간 전`;
    } else {
      return `${Math.floor(diff / 86400)}일 전`;
    }
  };

  useEffect(() => {
    fetchUserNickname(); 
  }, []);

  useEffect(() => {
    if (userNickname) {
      fetchPosts(); 
    }
  }, [userNickname]);

  // 🔥 게시물 삭제 함수
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

  // 🔥 옵션 버튼 핸들러
  const handleOptionsPress = (post) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["게시글 수정", "삭제", "닫기"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          navigation.navigate("ModifyCmPost", { post }); 
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

  // 🔥 게시물 렌더링
  const renderItem = ({ item }) => (
    <CmPost
      {...item}
      time={item.timeDifference} // 🔥 시간 표시를 위한 필드 추가
      onPress={() => navigation.navigate("CmPostChat", { post: item })}
      onOptionsPress={() => handleOptionsPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default MyCmPostList;
