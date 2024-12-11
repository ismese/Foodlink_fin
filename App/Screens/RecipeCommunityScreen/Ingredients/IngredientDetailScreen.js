import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
  Alert,
  TouchableOpacity
} from "react-native";
import { pickImageAndAnalyze } from "../../../services/awsService"; // AWS Rekognition 서비스
import { fetchRecipeForIngredient, fetchRecipeDetail } from "../../../services/recipeService"; // 레시피 API
import NavigateBefore from "../../../components/NavigateBefore"; // NavigateBefore 컴포넌트 가져오기
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore
import styles from "./IngredientDetailScreen.style"; // 스타일 임포트

const IngredientDetailScreen = ({ navigation, route }) => {
  const [imageUri, setImageUri] = useState(route.params?.item?.url || null); // 냉장고 DB에서 가져온 이미지 URL
  const [labels, setLabels] = useState([]); // 감지된 라벨
  const [error, setError] = useState(null); // 오류 메시지
  const [recipes, setRecipes] = useState([]); // 추천 레시피
  const [ingredient, setIngredient] = useState(""); // 감지된 재료
  const [recipeDetail, setRecipeDetail] = useState(null); // 선택한 레시피 세부 정보
  const [nickname, setNickname] = useState(""); // 사용자 닉네임

  const auth = getAuth();
  const firestore = getFirestore();

  const fetchUserNickname = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("로그인된 사용자가 없습니다.");

      const uid = user.uid;
      const userRef = doc(firestore, "users", uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setNickname(userData.nickname || "사용자");
      } else {
        console.error("해당 사용자의 정보를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("닉네임을 가져오는 중 오류:", err);
    }
  };

  useEffect(() => {
    const analyzeImage = async () => {
      if (!imageUri) return;

      try {
        const { labels: detectedLabels } = await pickImageAndAnalyze(imageUri);
        setLabels(detectedLabels);

        if (detectedLabels.length > 0) {
          const firstIngredient = detectedLabels[3]?.Name?.toLowerCase() || "재료 미확인";
          setIngredient(firstIngredient);
          const fetchedRecipes = await fetchRecipeForIngredient(firstIngredient);
          setRecipes(fetchedRecipes);
        }
      } catch (err) {
        console.error("이미지 분석 중 오류 발생:", err);
        setError("이미지 분석 중 오류가 발생했습니다.");
        Alert.alert("오류", "이미지를 분석하는 동안 오류가 발생했습니다.");
      }
    };

    analyzeImage();
  }, [imageUri]);

  useEffect(() => {
    fetchUserNickname();
  }, []);

  const handleRecipeSelect = async (idMeal) => {
    const detail = await fetchRecipeDetail(idMeal);
    navigation.navigate("RecipeDetailScreen", { recipeDetail: detail });
  };

  const getRandomRecipes = (recipes) => {
    if (recipes.length <= 5) return recipes;
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <NavigateBefore onPress={() => navigation.goBack()} />
          <Text style={styles.title}>AI 추천 레시피</Text>
          <View style={styles.emptySpace} />
        </View>

        <View contentContainerStyle={styles.scrollContainer}>
          {imageUri && (
            <View style={styles.userMessageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
              <View style={styles.infoContainer}>
                <Text style={styles.expirationDate}>유통기한: 2024년 12월 13일</Text>
                <Text style={styles.categoryText}>농산물 > 채소 > {ingredient}</Text>
              </View>
            </View>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {ingredient && (
            <View style={styles.userMessageContainer}>
              <View style={styles.iconContainer}>
                <Image
                  style={styles.userIcon}
                  source={require("../../../../start-expo/assets/avatar.png")}
                />
              </View>
              <View style={styles.userMessage}>
                <Text style={styles.userName}>{nickname}님</Text>
                <Text style={styles.message}>
                선택한 식자재는 <Text style={styles.ingredientName}>{ingredient}</Text> 입니다.
                </Text>
              </View>
            </View>
          )}

          {recipes.length > 0 && (
            <View style={styles.section}>
              {getRandomRecipes(recipes).map((recipe) => (
                <TouchableOpacity key={recipe.idMeal} style={styles.recipeItem} onPress={() => handleRecipeSelect(recipe.idMeal)}>
                  <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} resizeMode="cover" />
                  <View style={styles.recipeDetails}>
                    <Text style={styles.recipeName}>{recipe.strMeal}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {recipeDetail && (
            <View style={styles.detailContainer}>
              <Text style={styles.recipeName}>{recipeDetail.strMeal}</Text>
              <Image source={{ uri: recipeDetail.strMealThumb }} style={styles.recipeImage} resizeMode="contain" />
              <Text style={styles.description}>{recipeDetail.strInstructions}</Text>
              {recipeDetail.strYoutube && <Text style={styles.youtubeLink}>유튜브 비디오: {recipeDetail.strYoutube}</Text>}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IngredientDetailScreen;