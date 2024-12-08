import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Alert, ActionSheetIOS } from "react-native";
import CmPost from "../Community/CmPost"; // CmPost 컴포넌트
import { styles } from "../../../styles/RecipeCommunity/CmPostList.style";
import { getFirestore, collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app2 } from "../../../../firebase"; // 본인 Firebase Firestore 초기화

const MyCmPostList = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [userNickname, setUserNickname] = useState(""); // 현재 사용자 닉네임
  const db = getFirestore(app2); // 본인 Firestore
  const usersDb = getFirestore(); // 형 Firestore
  const auth = getAuth();

  // 현재 로그인된 사용자 닉네임 가져오기
  const fetchUserNickname = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        console.log("사용자 UID:", user.uid); // UID 확인 로그
        const userDocRef = doc(usersDb, "users", user.uid); // 형 Firestore에서 사용자 문서 참조
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const fetchedNickname = userDoc.data().nickname || "익명";
          console.log("로그인한 사용자 닉네임:", fetchedNickname);
          setUserNickname(fetchedNickname); // 닉네임 상태 업데이트
        } else {
          console.log("형 Firestore에서 사용자 문서를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("닉네임 가져오기 실패:", error.message);
      }
    } else {
      console.log("로그인된 사용자가 없습니다.");
    }
  };

  // Firestore에서 게시물 가져오기
  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "community"));
      const fetchedPosts = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        })
        .filter((post) => post.nickname === userNickname); // 닉네임 필터링
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("게시물 가져오기 실패:", error.message);
    }
  };

  useEffect(() => {
    fetchUserNickname(); // 닉네임 가져오기
  }, []);

  useEffect(() => {
    if (userNickname) {
      fetchPosts(); // 닉네임을 가져온 후 게시물 필터링
    }
  }, [userNickname]);

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
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
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