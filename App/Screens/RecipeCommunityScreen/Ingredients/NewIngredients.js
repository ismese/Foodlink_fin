import React from 'react';
import { View, Text, Image, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../../../Screens/RecipeCommunityScreen/Ingredients/NewIngredients.style';
import NavigateBefore from '../../../components/NavigateBefore';

const NewIngredients = ({ route, navigation }) => {
  // `route.params`를 통해 전달된 게시물 데이터 가져오기
  const { recipe } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <NavigateBefore onPress={() => navigation.goBack()} />
          <Text style={styles.title}>레시피</Text>
          <View style={styles.emptySpace} />
        </View>

        {/* Recipe Image */}
        <View style={styles.imageContainer}>
          {recipe.images && recipe.images.length > 0 ? (
            <Image style={styles.recipeImage} source={{ uri: recipe.images[0] }} />
          ) : (
            <Image style={styles.recipeImage} source={require("../../../../start-expo/assets/avatar.png")} />
          )}
        </View>

        {/* Recipe Title */}
        <View style={styles.recipeTitleContainer}>
          <Text style={styles.recipeTitle}>{recipe.title || "제목 없음"}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Ingredients */}
        <View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>재료</Text>
            <View style={styles.ingredientsContainer}>
              <Text style={styles.ingredient}>{recipe.ingredients || "재료 없음"}</Text>
            </View>
          </View>

          {/* Steps */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>조리순서</Text>
            <ScrollView style={styles.stepsContainer}>
              <Text style={styles.stepText}>
                {recipe.instructions || "조리 방법이 없습니다."}
              </Text>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewIngredients;
