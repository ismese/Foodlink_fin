import React from "react";
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity } from "react-native";

const RecipeDetail = ({ recipeDetail }) => {
  // 문단 나누기
  const instructions = recipeDetail.strInstructions.split("\n").filter((line) => line.trim() !== "");

  const openYoutubeLink = () => {
    if (recipeDetail.strYoutube) {
      Linking.openURL(recipeDetail.strYoutube).catch((err) =>
        console.error("유튜브 링크를 열 수 없습니다:", err)
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mealTitle}>{recipeDetail.strMeal}</Text>
      <Image
        source={{ uri: recipeDetail.strMealThumb }}
        style={styles.mealImage}
        resizeMode="contain"
      />
      <View style={styles.instructionsContainer}>
        {instructions.map((paragraph, index) => (
          <Text key={index} style={styles.instructionParagraph}>
            {paragraph}
          </Text>
        ))}
      </View>
      {recipeDetail.strYoutube && (
        <TouchableOpacity onPress={openYoutubeLink}>
          <Text style={styles.youtubeLink}>유튜브에서 요리법 보기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  mealTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  mealImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  instructionsContainer: {
    marginTop: 20,
  },
  instructionParagraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 10,
  },
  youtubeLink: {
    fontSize: 16,
    color: "#1E90FF",
    textDecorationLine: "underline",
    marginTop: 20,
    textAlign: "center",
  },
});

export default RecipeDetail;