import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "../../styles/MyScreen.style";
import { MaterialIcons } from "@expo/vector-icons";
import { PostContext } from "../../PostContext";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";

const MyScreen = ({ navigation }) => {
  const { deletePost } = useContext(PostContext);
  const [posts, setPosts] = useState([]);
  const [showPostSelection, setShowPostSelection] = useState(false);
  const [rating, setRating] = useState(0); // 평균 별점 저장
  const [nickname, setNickname] = useState("");
  const [co2Reduction, setCo2Reduction] = useState(0);

  const auth = getAuth();
  const db = getFirestore();

  // 사용자 데이터 및 탄소 배출 절감량 실시간 구독
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setNickname(userData.nickname || "사용자");
          setRating(userData.averageRating || 0);
          setCo2Reduction(userData.carbonFootprint || 0); // 탄소 배출 절감량 실시간 업데이트
        }
      },
      (error) => {
        console.error("사용자 데이터 구독 오류:", error);
        Alert.alert("오류", "사용자 데이터를 가져오는 중 문제가 발생했습니다.");
      }
    );

    return () => unsubscribe();
  }, [auth, db]);

  // 실시간 게시글 구독
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const postsRef = collection(db, "posts");
    const postsQuery = query(postsRef, where("userUID", "==", user.uid));

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const fetchedPosts = [];
        snapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });

        fetchedPosts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        setPosts(fetchedPosts);
      },
      (error) => {
        console.error("게시글 구독 중 오류 발생:", error);
        Alert.alert("오류", "게시글 데이터를 가져오는 중 문제가 발생했습니다.");
      }
    );

    return () => unsubscribe();
  }, [auth, db]);

  const handleEdit = () => {
    navigation.navigate("MyPostWrite");
  };

  const handleDelete = () => {
    setShowPostSelection(true);
  };

  const confirmDeletePost = (postId) => {
    Alert.alert(
      "삭제 확인",
      "정말로 이 게시물을 삭제하시겠습니까?",
      [
        { text: "아니요", style: "cancel" },
        {
          text: "네",
          onPress: async () => {
            try {
              await deletePost(postId);
              setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== postId)
              );
              setShowPostSelection(false);
            } catch (error) {
              console.error("게시글 삭제 중 오류 발생:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 프로필 섹션 */}
        <View style={styles.profileCard}>
          <Image
            source={require("../../../start-expo/assets/avatar.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>
            <Text style={styles.highlightText}>{nickname || "사용자"}</Text>
            <Text>의 나눔으로{"\n"} {co2Reduction.toFixed(2)}g의 CO</Text>
            <Text style={styles.smallText}>2</Text>
            <Text> 배출을 절감했습니다.</Text>
          </Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <MaterialIcons name="edit" style={styles.actionButtonIcon} />
            </TouchableOpacity>

            {/* 별점 표시 */}
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((value) => (
                <MaterialIcons
                  key={value}
                  name={value <= rating ? "star" : "star-border"}
                  size={30}
                  color="#FFD700"
                />
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

        <View style={styles.separator} />

        {/* 게시글 표시 */}
        {showPostSelection ? (
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {posts
              .filter((item) => item.images && item.images[0])
              .map((item) => (
                <TouchableWithoutFeedback
                  key={item.id}
                  onLongPress={() => confirmDeletePost(item.id)}
                >
                  <View style={styles.gridItem}>
                    <Image
                      source={{ uri: item.images[0] }}
                      style={styles.gridImage}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ))}
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {posts
              .filter((item) => item.images && item.images[0])
              .map((item) => (
                <TouchableWithoutFeedback
                  key={item.id}
                  onLongPress={() => confirmDeletePost(item.id)}
                  onPress={() =>
                    navigation.navigate("FeedScreen", { post: item })
                  }
                >
                  <View style={styles.gridItem}>
                    <Image
                      source={{ uri: item.images[0] }}
                      style={styles.gridImage}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyScreen;
