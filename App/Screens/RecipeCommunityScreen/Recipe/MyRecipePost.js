import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { styles } from "../../../styles/RecipeCommunity/MyRecipePost.style";
import NavigateBefore from "../../../components/NavigateBefore"; // NavigateBefore 컴포넌트
import MyRecipeList from "../Recipe/MyReipeList"; // MyRecipeList 컴포넌트 확인

const MyRecipePost = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <NavigateBefore onPress={() => navigation.goBack()} />
          <Text style={styles.title}>내 레시피</Text>
          <View style={styles.emptySpace} />
        </View>

        {/* 내 레시피들 */}
        <View style={styles.recipeListContainer}>
          <MyRecipeList />
        </View>

        {/* 추가하기 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton}
            onPress={() => navigation.navigate("RecipePost")}>
            <Text style={styles.submitButtonText}>추가하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyRecipePost;