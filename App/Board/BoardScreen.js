import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity,
  View,
  Image,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./BoardScreen.style";
import { PostContext } from "../PostContext";
import firebase from "firebase/compat/app"; // firebase/compat 가져오기
import "firebase/compat/firestore"; // Firestore 사용
import { useRoute } from "@react-navigation/native";

const BoardScreen = ({ navigation }) => {
  const { addFavorite } = useContext(PostContext);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const route = useRoute(); // 네비게이션 route
  const db = firebase.firestore(); // Firestore 초기화
  const auth = firebase.auth();

  // Firestore에서 사용자 위치 가져오기
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const userUID = auth.currentUser?.uid;
        if (!userUID) {
          console.error("로그인된 사용자가 없습니다.");
          return;
        }

        const userDocRef = db.collection("users").doc(userUID);
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserLocation({
            latitude: userData.latitude,
            longitude: userData.longitude,
          });
        } else {
          console.error("사용자 문서를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("사용자 위치를 가져오는 중 오류 발생:", error);
      }
    };

    fetchUserLocation();
  }, [auth, db]);

  // Firestore에서 실시간 게시글 가져오기
  useEffect(() => {
    const fetchPosts = () => {
      const postsRef = db.collection("posts").orderBy("createdAt", "desc");

      const unsubscribe = postsRef.onSnapshot((snapshot) => {
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchPosts();
    return unsubscribe;
  }, [db]);

  // 검색어를 통해 게시글 필터링
  useEffect(() => {
    const searchQuery = route.params?.searchQuery || ""; // 검색어 가져오기
    if (searchQuery.trim()) {
      const filtered = posts.filter((post) =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [route.params?.searchQuery, posts]);

  // 거리 계산 함수
  const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) {
      return null;
    }
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // 지구 반지름 (km)
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(loc1.latitude)) *
        Math.cos(toRad(loc2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 거리 반환 (km)
  };

  const handlePostPress = (post) => {
    navigation.navigate("FeedScreen", { post });
  };

  const handleFavorite = async (post) => {
    try {
      const userUID = auth.currentUser?.uid;
      if (!userUID) {
        Alert.alert("오류", "로그인된 사용자가 없습니다.");
        return;
      }

      const userDocRef = db.collection("users").doc(userUID);
      const userDoc = await userDocRef.get();

      let favorites = [];
      if (userDoc.exists) {
        const userData = userDoc.data();
        favorites = userData.favorites || [];
      }

      // 중복 확인
      if (!favorites.some((fav) => fav.id === post.id)) {
        favorites.push({
          id: post.id,
          title: post.title,
          priceOrExchange: post.priceOrExchange,
          createdAt: post.createdAt.toDate(),
          location: post.location,
          images: post.images,
        });

        // Firestore 업데이트
        await userDocRef.update({ favorites });

        Alert.alert("찜 성공", "게시물이 찜 목록에 추가되었습니다.");
      } else {
        Alert.alert("중복", "이미 찜한 게시물입니다.");
      }
    } catch (error) {
      console.error("찜한 게시물 저장 중 오류 발생:", error);
      Alert.alert("오류", "찜한 게시물을 저장하는 중 문제가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 게시글 목록 */}
      <FlatList
        data={filteredPosts} // 필터링된 게시글 데이터
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePostPress(item)}>
            <Post
              item={item}
              userLocation={userLocation}
              calculateDistance={calculateDistance}
              onFavorite={() => handleFavorite(item)}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>검색 결과가 없습니다.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const Post = ({ item, userLocation, calculateDistance, onFavorite }) => {
  const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const postDate = createdAt.toDate();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return `1분 전`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  const distance =
    item.location && userLocation
      ? calculateDistance(userLocation, item.location).toFixed(1)
      : null;

  return (
    <View style={styles.postContainer}>
      <View style={styles.imageContainer}>
        {item.images?.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.imagePlaceholder}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title || "제목 없음"}</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialIcons name="location-on" size={12} color="#8C8C8C" />
          <Text style={styles.infoText}>
            {distance ? `${distance}km` : "거리 정보 없음"}
          </Text>
          <Text style={styles.infoSeparator}>·</Text>
          <Text style={styles.infoText}>{calculateTimeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.price}>
          {item.priceOrExchange ? `${item.priceOrExchange}원` : "가격 정보 없음"}
        </Text>
        <View style={styles.actionsContainer}>
          {onFavorite && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onFavorite}
            >
              <MaterialIcons name="favorite" size={16} color="#F44336" />
              <Text style={styles.actionText}>찜</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default BoardScreen;