import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { styles } from "../../styles/MyScreen.style";
import { MaterialIcons } from "@expo/vector-icons";
import { PostContext } from "../../PostContext";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"; // Firestore 관련 함수 추가

const MyScreen = ({ navigation }) => {
  const { posts: contextPosts, deletePost, addPost } = useContext(PostContext); // PostContext에서 posts 가져오기
  const [posts, setPosts] = useState([]); // 로컬 상태로 posts 관리
  const [showPostSelection, setShowPostSelection] = useState(false);
  const [rating, setRating] = useState(4); // 초기 별점 설정
  const [nickname, setNickname] = useState("");  // 사용자 닉네임 상태
  const [co2Reduction, setCo2Reduction] = useState(0);  // 절감된 CO2 상태

  // Firebase Auth와 Firestore 사용을 위한 초기화
  const auth = getAuth();
  const db = getFirestore();

  // Context posts를 로컬 posts와 동기화
  useEffect(() => {
    setPosts(contextPosts);
  }, [contextPosts]);

  // Firestore에서 사용자 닉네임 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        // Firestore에서 사용자 닉네임 가져오기
        const userDocRef = doc(db, "users", user.uid);  // 'users' 컬렉션에서 사용자 정보 가져오기
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname || "사용자");  // 닉네임이 없으면 '사용자'로 설정
        }

        // 거래 데이터에서 CO2 절감량 합산하기
        const transactionsRef = collection(db, "transactions");
        const q = query(transactionsRef, where("userId", "==", user.uid)); // 사용자 ID로 거래 데이터 조회
        const querySnapshot = await getDocs(q);

        let totalCo2 = 0;
        querySnapshot.forEach((doc) => {
          totalCo2 += doc.data().CO2_reduction || 0;  // 각 거래의 CO2 절감량 합산
        });
        setCo2Reduction(totalCo2);  // 총 CO2 절감량 업데이트
      }
    };

    fetchUserData();
  }, [auth, db]);

  // 별점 조정 함수
  const handleRating = (value) => {
    setRating(value);
  };

  // 내 포스트 수정 버튼 클릭
  const handleEdit = () => {
    const newPost = {
      image: "https://example.com/sample-image.jpg", // 예제 이미지 URL
      id: Date.now().toString(), // 고유 ID
    };
    addPost(newPost); // Context에 추가
    setPosts((prevPosts) => [newPost, ...prevPosts]); // 로컬 상태 업데이트
    navigation.navigate("MyPostWrite"); // 네비게이션 이동
  };

  // 삭제 모드 활성화
  const handleDelete = () => {
    setShowPostSelection(true); // 게시물 선택 모드 활성화
  };

  // 삭제 확인
  const confirmDeletePost = (postId) => {
    Alert.alert(
      "삭제 확인",
      "정말로 이 게시물을 삭제하시겠습니까?",
      [
        { text: "아니요", style: "cancel" },
        {
          text: "네",
          onPress: () => {
            deletePost(postId); // PostContext에서 삭제
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // 로컬 상태 업데이트
            setShowPostSelection(false); // 삭제 모드 비활성화
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <Image
            source={require("../../../start-expo/assets/avatar.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>
            <Text style={styles.highlightText}>{nickname || "동길님"}</Text>
            <Text>의 나눔으로{"\n"} {co2Reduction.toFixed(2)}g의 CO</Text>
            <Text style={styles.smallText}>2</Text>
            <Text> 배출을 절감했습니다.</Text>
          </Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEdit}
            >
              <MaterialIcons name="edit" style={styles.actionButtonIcon} />
            </TouchableOpacity>

            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleRating(value)}
                >
                  <MaterialIcons
                    name={value <= rating ? "star" : "star-border"}
                    size={30}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDelete}
            >
              <MaterialIcons name="delete" style={styles.actionButtonIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator}
        />
        
        {showPostSelection ? (
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {posts
              .filter((item) => item.images && item.images[0]) // 이미지가 없는 게시물 필터링
              .map((item) => (
                <TouchableOpacity
                  key={item.id} // 고유 키 설정
                  style={[styles.gridItem]}
                  onPress={() => confirmDeletePost(item.id)} // 삭제 확인 호출
                >
                  <Image source={{ uri: item.images[0] }} style={styles.gridImage} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {posts
              .filter((item) => item.images && item.images[0]) // 이미지가 없는 게시물 필터링
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate("FeedScreen", { post: item })}
                >
                  <Image source={{ uri: item.images[0] }} style={styles.gridImage} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyScreen;
