import React, { useContext, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { PostContext } from "../../../PostContext"; // 올바른 경로로 import

const HeartScreen = ({ navigation }) => {
  const { favorites = [], removeFavorite } = useContext(PostContext);

  // 찜 데이터 디버깅
  useEffect(() => {
    console.log("Favorites Data:", favorites); // favorites 데이터 로그 출력
  }, [favorites]);

  const handleRemoveFavorite = (postId) => {
    Alert.alert("삭제 확인", "이 항목을 찜 목록에서 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: () => {
          removeFavorite(postId); // PostContext의 removeFavorite 호출
        },
        style: "destructive",
      },
    ]);
  };

  const handlePostPress = (post) => {
    navigation.navigate("FeedScreen", { post });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나의 찜</Text>
      </View>

      {/* 콘텐츠 영역 */}
      <View style={styles.content}>
        {favorites.length === 0 ? (
          <Text style={styles.text}>찜한 항목이 없습니다.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()} // 고유한 키 설정
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePostPress(item)}>
                <Post
                  item={item}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              </TouchableOpacity>
            )}
            
            ListEmptyComponent={() => (
              <Text style={styles.emptyList}>찜한 게시물이 없습니다.</Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listFooter: {
    fontSize: 14,
    color: "#8C8C8C",
    marginTop: 10,
    textAlign: "center",
  },
  emptyList: {
    fontSize: 16,
    color: "#8C8C8C",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HeartScreen;
