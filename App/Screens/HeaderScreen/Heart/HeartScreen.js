import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { PostContext } from "../../../PostContext";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const HeartScreen = ({ navigation }) => {
  const { favorites, removeFavorite } = useContext(PostContext);
  const [userLocation, setUserLocation] = useState(null); 
  const db = getFirestore();
  const auth = getAuth();

  // Firestore에서 사용자 위치 가져오기
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const userUID = auth.currentUser?.uid;
        if (!userUID) {
          console.error("로그인된 사용자가 없습니다.");
          return;
        }
        const userDocRef = doc(db, "users", userUID);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
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

  const handleRemoveFavorite = (postId) => {
    Alert.alert("삭제 확인", "이 항목을 찜 목록에서 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: () => removeFavorite(postId),
        style: "destructive",
      },
    ]);
  };

  const handlePostPress = (post) => {
    navigation.navigate("FeedScreen", { post });
  };

  const renderPost = ({ item }) => (
    <Post 
      item={item} 
      onPress={() => handlePostPress(item)} 
      onRemove={() => handleRemoveFavorite(item.id)} 
      userLocation={userLocation}
      calculateDistance={calculateDistance}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
    {/* 고정된 헤더 영역 */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>나의 찜</Text>
    </View>

    {/* 스크롤 가능한 게시물 목록 영역 */}
    <View style={styles.content}>
      {favorites.length === 0 ? (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>찜한 항목이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  </SafeAreaView>
  );
};

const Post = ({ item, onPress, onRemove, userLocation, calculateDistance }) => {
  const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const postDate = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return `1분 전`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  const distance = 
    item.location && userLocation 
      ? calculateDistance(userLocation, item.location).toFixed(1) 
      : "거리 정보 없음";

  const timeAgo = item.createdAt ? calculateTimeAgo(item.createdAt) : "시간 정보 없음";

  return (
    <TouchableOpacity onPress={onPress} style={styles.postContainer}>
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
          <Text style={styles.infoText}>{distance}</Text>
          <Text style={styles.infoSeparator}>·</Text>
          <Text style={styles.infoText}>{timeAgo}</Text>
        </View>
        <Text style={styles.price}>
          {item.priceOrExchange ? `${item.priceOrExchange}원` : "가격 정보 없음"}
        </Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onRemove}>
            <MaterialIcons name="delete" size={20} color="#F44336" />
            <Text style={styles.actionText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // 📌 상단 고정된 헤더 스타일
  header: {
    height: 60, // 헤더 높이 고정
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 10, 
    backgroundColor: "#fff", 
    borderBottomWidth: 1, 
    borderBottomColor: "#EAEAEA",
  },  
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flex: 1, 
    textAlign: "center" // 제목을 가운데 정렬
  },
  backButton: {
    padding: 10, // 터치 영역을 확장
  },

  // 📌 메인 컨텐츠 스타일
  content: {
    flex: 1, // 남은 영역을 차지
  },

  // 📌 검색 영역 스타일 (필요한 경우 사용)
  searchArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },

  // 📌 게시물 목록 스타일
  postContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },

  imageContainer: {
    width: 127, // 이미지의 너비 고정
    height: 109, // 이미지의 높이 고정
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    overflow: "hidden",
  },

  imagePlaceholder: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: "#D9D9D9",
  },

  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 10,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  title: {
    color: "#521212",
    fontSize: 13, // 제목 크기 조정
    fontWeight: "bold", // 글씨 더 두껍게
    lineHeight: 18,
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },

  infoText: {
    color: "#8C8C8C",
    fontSize: 11, 
    fontWeight: "400",
    lineHeight: 16,
  },

  infoSeparator: {
    color: "#8C8C8C",
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 16,
  },

  price: {
    color: "#2D754E",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 8,
  },

  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  actionText: {
    color: "#8C8C8C",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },

  // 📌 빈 리스트 스타일
  emptyListContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 20, 
  },

  emptyListText: {
    color: "#555", 
    fontSize: 16,
    textAlign: 'center',
  },
});


export default HeartScreen;
