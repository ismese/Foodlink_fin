import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { pickImageAndAnalyze } from "../../../services/awsService"; // AWS Rekognition 서비스
import { fetchRecipeForIngredient, fetchRecipeDetail } from "../../../services/recipeService"; // 레시피 API
import NavigateBefore from "../../../components/NavigateBefore"; // NavigateBefore 컴포넌트 가져오기
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore

const IngredientDetailScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null); // 업로드된 이미지 URI
  const [labels, setLabels] = useState([]); // 감지된 라벨
  const [error, setError] = useState(null); // 오류 메시지
  const [recipes, setRecipes] = useState([]); // 추천 레시피
  const [ingredient, setIngredient] = useState(""); // 감지된 재료
  const [recipeDetail, setRecipeDetail] = useState(null); // 선택한 레시피 세부 정보
  const [nickname, setNickname] = useState(""); // 사용자 닉네임

  const auth = getAuth();
  const firestore = getFirestore();

  // 로그인한 사용자의 닉네임 가져오기
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

  // 컴포넌트가 마운트될 때 닉네임 가져오기
  useEffect(() => {
    fetchUserNickname();
  }, []);

  // 이미지 선택 및 분석 핸들러
  const handleImagePick = async () => {
    try {
      const { uri, labels: detectedLabels } = await pickImageAndAnalyze(); // AWS Rekognition 사용
      setImageUri(uri); // 선택된 이미지 URI 저장
      setLabels(detectedLabels); // 감지된 라벨 저장

      if (detectedLabels.length > 0) {
        const firstIngredient = detectedLabels[3]?.Name.toLowerCase(); // 감지된 첫 번째 재료 선택
        setIngredient(firstIngredient); // 감지된 재료 저장
        const fetchedRecipes = await fetchRecipeForIngredient(firstIngredient); // 레시피 검색
        setRecipes(fetchedRecipes); // 추천된 레시피 저장
      }
    } catch (err) {
      console.error("이미지 처리 중 오류:", err);
      setError("이미지 처리 중 오류가 발생했습니다.");
      Alert.alert("오류", "이미지를 분석하는 동안 오류가 발생했습니다.");
    }
  };

  // 레시피 선택 핸들러
  const handleRecipeSelect = async (idMeal) => {
    const detail = await fetchRecipeDetail(idMeal); // 레시피 세부 정보 검색
    setRecipeDetail(detail); // 세부 정보 저장
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <NavigateBefore onPress={() => navigation.goBack()} />
          <Text style={styles.title}>AI 추천 레시피</Text>
          <View style={styles.emptySpace} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 사진 선택 버튼 */}
          <TouchableOpacity style={styles.button} onPress={handleImagePick}>
            <Text style={styles.buttonText}>사진 선택</Text>
          </TouchableOpacity>

          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              resizeMode="contain"
            />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {ingredient && (
            <Text style={styles.ingredientText}>{nickname}님이 선택한 재료는 {ingredient} 입니다!</Text>
          )}

          {/* 추천 레시피 목록 */}
          {recipes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI 추천 레시피:</Text>
              {recipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.idMeal}
                  style={styles.recipeCard}
                  onPress={() => handleRecipeSelect(recipe.idMeal)}
                >
                  <Image
                    source={{ uri: recipe.strMealThumb }}
                    style={styles.recipeImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </ScrollView>
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
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  emptySpace: {
    width: 24, // 빈 공간을 위해 임의의 크기
  },
  scrollContent: {
    alignItems: "center",
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-bold',
    color: '#2E2F33',
  },
  emptySpace: {
    width: 24,
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginVertical: 10,
  },
  section: {
    width: "100%",
    marginVertical: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "left", // 텍스트 왼쪽 정렬
    alignSelf: "flex-start", // 부모 컨테이너 기준으로 왼쪽에 배치
  },
  labelText: {
    fontSize: 14,
    color: "#555",
  },
  ingredientText: {
    fontSize: 18,
    color: "#4CAF50",
    marginTop: 10,
  },
  recipeCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    padding: 10,
  },
  recipeImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  recipeTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginVertical: 20,
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  youtubeLink: {
    fontSize: 16,
    color: "blue",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

export default IngredientDetailScreen;