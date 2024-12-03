import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../RecipeCommunityScreen/MyPage.style";
import CmPostList from "./Community/CmPostList"; // CmPostList 컴포넌트
import RecipeList from "../RecipeCommunityScreen/Recipe/RecipeList"; // RecipeList 컴포넌트
import * as ImagePicker from "expo-image-picker";

const MyPage = () => {
  const navigation = useNavigation(); // 네비게이션 객체
  const [ingredients, setIngredients] = useState(Array(5).fill(null)); // 기본 회색 이미지 상태
  const [selectedTab, setSelectedTab] = useState("레시피"); // 현재 선택된 탭 상태

  // 이미지 추가 핸들러
  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("권한 필요", "사진 라이브러리 접근 권한이 필요합니다.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!pickerResult.cancelled) {
      setIngredients((prevIngredients) => {
        const newIngredients = [...prevIngredients];
        const emptyIndex = newIngredients.indexOf(null);
        if (emptyIndex !== -1) {
          newIngredients[emptyIndex] = pickerResult.uri;
        } else {
          Alert.alert("슬롯 초과", "더 이상 이미지를 추가할 수 없습니다.");
        }
        return newIngredients;
      });
    }
  };

  // + 버튼 클릭 핸들러
  const handleAddPost = () => {
    if (selectedTab === "레시피") {
      navigation.navigate("MyRecipePost"); // 레시피 탭의 + 버튼
    } else if (selectedTab === "커뮤니티") {
      navigation.navigate("MyCmPost"); // 커뮤니티 탭의 + 버튼
    }
  };

  return (
    <View style={styles.container}>
      {/* 내 식자재 Section */}
      <View style={styles.myIngredientsSection}>
        <View style={styles.myIngredientsHeader}>
          <Text style={styles.headerText}>내 식자재</Text>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => navigation.navigate("MyIngredientsScreen")}
          >
            <Text style={styles.moreText}>더 보기</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.ingredientsListContainer}
        >
          {/* 사진 추가 버튼 */}
          <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>

          {/* 식자재 이미지 */}
          {ingredients.map((uri, index) => (
            <View
              key={index}
              style={[
                styles.ingredientImage,
                !uri && { backgroundColor: "#F2F3F6" },
              ]}
            >
              {uri && <Image source={{ uri }} style={styles.ingredientImage} />}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 게시판 Section */}
      <View style={styles.boardSection}>
        {/* 게시판 헤더 */}
        <View style={styles.boardHeader}>
          <Text style={styles.headerText}>게시판</Text>
          <TouchableOpacity style={styles.addPostButton} onPress={handleAddPost}>
            <Text style={styles.addPostButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.boardTabs}>
          <TouchableOpacity
            style={selectedTab === "레시피" ? styles.tabActive : styles.tab}
            onPress={() => setSelectedTab("레시피")}
          >
            <Text
              style={
                selectedTab === "레시피"
                  ? styles.tabActiveText
                  : styles.tabText
              }
            >
              레시피
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTab === "커뮤니티" ? styles.tabActive : styles.tab}
            onPress={() => setSelectedTab("커뮤니티")}
          >
            <Text
              style={
                selectedTab === "커뮤니티"
                  ? styles.tabActiveText
                  : styles.tabText
              }
            >
              커뮤니티
            </Text>
          </TouchableOpacity>
        </View>

        {/* 레시피 탭 */}
        {selectedTab === "레시피" && (
          <View style={styles.recipeListContainer}>
            <RecipeList navigation={navigation}/>
          </View>
        )}

        {/* 커뮤니티 */}
        {selectedTab === "커뮤니티" && (
          <View style={styles.postContainer}>  
            <CmPostList navigation={navigation} />
          </View>
        )}
      </View>
    </View>
  );
};

export default MyPage;
