import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app2 } from "../../../../firebase"; // Firebase 초기화
import { useNavigation } from "@react-navigation/native"; // Navigation 사용

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const db = getFirestore(app2);
  const navigation = useNavigation(); // Navigation 객체 가져오기

  // Firestore에서 레시피 데이터 가져오기
  const fetchRecipes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recipe"));
      const fetchedRecipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error("레시피 데이터 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // 데이터가 홀수일 때 빈 카드 추가
  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  return (
    <FlatList
      data={formatData(recipes, 2)} // 2열로 데이터 정렬
      keyExtractor={(item) => item.id}
      numColumns={2} // 2열로 설정
      columnWrapperStyle={styles.row} // 열 간격 스타일
      renderItem={({ item }) => {
        if (item.empty) {
          return <View style={[styles.recipeCard, styles.invisibleCard]} />;
        }
        return (
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate("NewIngredients", { recipe: item })}
          >
            {/* 이미지 부분 */}
            <View style={styles.recipeImage}>
              {item.images && item.images.length > 0 ? (
                <Image source={{ uri: item.images[0] }} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>이미지 없음</Text>
                </View>
              )}
            </View>
            {/* 텍스트 정보 */}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{item.title || "제목 없음"}</Text>
              <Text style={styles.recipeAuthor}>
                {item.nickname ? `작성자: ${item.nickname}` : "작성자 없음"}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
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
    flex: 1,
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
  invisibleCard: {
    backgroundColor: "transparent",
    elevation: 0, // 그림자 제거
  },
  recipeImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F2F3F6", // 회색 배경
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
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