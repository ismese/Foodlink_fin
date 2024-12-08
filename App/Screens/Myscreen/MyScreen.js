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
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

const MyScreen = ({ navigation }) => {
  const { deletePost } = useContext(PostContext);
  const [posts, setPosts] = useState([]);
  const [showPostSelection, setShowPostSelection] = useState(false);
  const [rating, setRating] = useState(4);
  const [nickname, setNickname] = useState("");
  const [co2Reduction, setCo2Reduction] = useState(0);

  const auth = getAuth();
  const db = getFirestore();

  // Firestore에서 사용자 데이터 및 게시글 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // 사용자 닉네임 가져오기
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname || "사용자");
        }

        // 거래 데이터에서 CO2 절감량 합산
        const transactionsRef = collection(db, "transactions");
        const transactionsQuery = query(
          transactionsRef,
          where("userId", "==", user.uid)
        );

        let totalCo2 = 0;
        const transactionsSnapshot = await getDocs(transactionsQuery);
        transactionsSnapshot.forEach((doc) => {
          totalCo2 += doc.data().CO2_reduction || 0;
        });
        setCo2Reduction(totalCo2);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        Alert.alert("오류", "사용자 데이터를 가져오는 중 문제가 발생했습니다.");
      }
    };

    fetchUserData();
  }, [auth, db]);

  // Firestore에서 사용자 게시글 실시간 가져오기
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

        // 최신 게시글이 배열의 앞쪽으로 오도록 정렬
        fetchedPosts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        setPosts(fetchedPosts);
      },
      (error) => {
        console.error("실시간 데이터 구독 중 오류 발생:", error);
        Alert.alert("오류", "게시글 데이터를 가져오는 중 문제가 발생했습니다.");
      }
    );

    return () => unsubscribe();
  }, [auth, db]);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleEdit = () => {
    navigation.navigate("MyPostWrite"); // MyPostWrite 화면으로 이동
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
              await deletePost(postId); // Firebase에서 게시물 삭제
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
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <MaterialIcons name="edit" style={styles.actionButtonIcon} />
            </TouchableOpacity>

            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity key={value} onPress={() => handleRating(value)}>
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

        <View style={styles.separator} />

        {showPostSelection ? (
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {posts
              .filter((item) => item.images && item.images[0])
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => confirmDeletePost(item.id)}
                >
                  <Image source={{ uri: item.images[0] }} style={styles.gridImage} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {posts
              .filter((item) => item.images && item.images[0])
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
