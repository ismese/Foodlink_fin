import React from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";

const RecipeList = ({ navigation }) => {
  // 레시피 데이터
  const recipes = Array(10).fill({
    uri: null, // 이미지 URL 대신 null로 설정
    title: "레시피 제목",
    author: "작성자",
  });

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2} // 2열로 설정
      columnWrapperStyle={styles.row} // 열 간격 스타일
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.recipeCard}
          onPress={() => navigation.navigate("NewIngredients", { recipe: item })} // MyIngredients로 이동
        >
          {/* 이미지 부분 */}
          <View style={styles.recipeImage}>
            {item.uri ? (
              <Image source={{ uri: item.uri }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>이미지 없음</Text>
              </View>
            )}
          </View>
          {/* 텍스트 정보 */}
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
            <Text style={styles.recipeAuthor}>{item.author}</Text>
          </View>
        </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false} // 스크롤바 숨김
    />
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between", // 각 열의 아이템 사이 간격
    marginBottom: 10,
  },
  recipeCard: {
    flex: 1, // 2열로 나누기 위해 flex를 1로 설정
    marginHorizontal: 5, // 카드 간격
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2, // 그림자 효과 (Android)
    shadowColor: "#000", // 그림자 효과 (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F2F3F6", // 회색 배경
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  recipeInfo: {
    padding: 10,
  },
  recipeTitle: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recipeAuthor: {
    color: "#8C8C8C",
    fontSize: 12,
  },
});

export default RecipeList;
