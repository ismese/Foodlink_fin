import React, { useContext } from "react";
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

const HeartScreen = ({ navigation }) => {
  const { favorites, removeFavorite } = useContext(PostContext);

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
    <TouchableOpacity onPress={() => handlePostPress(item)} style={styles.postContainer}>
      {/* 이미지 섹션 */}
      <View style={styles.imageContainer}>
        {item.images?.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>이미지 없음</Text>
          </View>
        )}
      </View>
      {/* 게시물 정보 섹션 */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title || "제목 없음"}</Text>
        <Text style={styles.description}>{item.description || "내용 없음"}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => handleRemoveFavorite(item.id)}
            style={styles.removeButton}
          >
            <Ionicons name="trash-outline" size={20} color="#f00" />
            <Text style={styles.removeText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나의 찜</Text>
      </View>
      <View style={styles.content}>
        {favorites.length === 0 ? (
          <Text style={styles.text}>찜한 항목이 없습니다.</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" },
  content: { flex: 1, padding: 16 },
  text: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#555" },
  listContent: { paddingBottom: 16 },
  postContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  imageContainer: { width: 120, height: 120 },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  placeholderText: { color: "#aaa", fontSize: 14 },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontWeight: "bold", color: "#333" },
  description: { fontSize: 14, color: "#666", marginTop: 4 },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeText: { marginLeft: 4, fontSize: 14, color: "#f00" },
});

export default HeartScreen;
