import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import NavigateBefore from "../../../components/NavigateBefore"; // 이전 버튼 컴포넌트
import RecipeDetail from "./RecipeDetail"; // RecipeDetail 컴포넌트
import { fetchRecipeDetail } from "../../../services/recipeService";

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params; // 전달된 레시피 정보
  const [recipeDetail, setRecipeDetail] = useState(null); // 레시피 상세 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const loadRecipeDetail = async () => {
      try {
        const detail = await fetchRecipeDetail(recipe.idMeal);
        setRecipeDetail(detail);
      } catch (err) {
        console.error("레시피 상세 정보 로드 중 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRecipeDetail();
  }, [recipe.idMeal]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D754E" />
        <Text style={styles.loadingText}>레시피 정보를 불러오는 중입니다...</Text>
      </SafeAreaView>
    );
  }

  if (!recipeDetail) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>레시피 정보를 불러오지 못했습니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <NavigateBefore onPress={() => navigation.goBack()} />
        <Text style={styles.title}>레시피 상세 정보</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <RecipeDetail recipeDetail={recipeDetail} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 80,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#888",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
  },
});

export default RecipeDetailScreen;