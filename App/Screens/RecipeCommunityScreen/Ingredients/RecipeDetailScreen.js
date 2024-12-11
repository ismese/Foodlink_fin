import React from "react";
import { SafeAreaView, Text, View, Image, StyleSheet, TouchableOpacity, Linking, Alert, ScrollView } from "react-native";
import * as Clipboard from 'expo-clipboard'; // 클립보드 기능 추가
import { Ionicons } from "@expo/vector-icons"; // 아이콘 추가
import NavigateBefore from "../../../components/NavigateBefore"; // NavigateBefore 컴포넌트 임포트

const RecipeDetailScreen = ({ navigation, route }) => {
  const { recipeDetail } = route.params; // 전달받은 레시피 데이터

  // 🔥 Papago에 텍스트 붙여넣기 기능 추가
  const handleTranslate = async () => {
    const textToCopy = `${recipeDetail.strMeal}\n\n${recipeDetail.strInstructions}`;
    try {
      await Clipboard.setStringAsync(textToCopy); // 클립보드에 텍스트 복사
      Alert.alert(
        '알림',
        '레시피가 복사되었습니다. Papago에서 붙여넣기(Ctrl+V) 해주세요.',
        [
          { text: '확인', onPress: () => Linking.openURL('https://papago.naver.com/') }
        ]
      );
    } catch (error) {
      console.error('클립보드 복사 오류:', error);
    }
  };

  // 레시피 설명을 문단으로 나누기
  const paragraphs = recipeDetail.strInstructions.split("\n").filter(p => p.trim() !== "");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* NavigateBefore 컴포넌트로 뒤로가기 아이콘 */}
        <NavigateBefore onPress={() => navigation.goBack()} />

        {/* 중앙 타이틀 */}
        <Text style={styles.title}>{recipeDetail.strMeal}</Text>

        {/* 헤더 오른쪽 아이콘 */}
        <View style={styles.headerIcons}>
          {recipeDetail.strYoutube && (
            <TouchableOpacity onPress={() => Linking.openURL(recipeDetail.strYoutube)}>
              <Ionicons name="logo-youtube" size={20} color="red" style={styles.icon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleTranslate}>
            <Ionicons name="language" size={20} color="blue" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: recipeDetail.strMealThumb }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* ScrollView로 스크롤 가능하도록 수정 */}
        <ScrollView style={styles.textContainer}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.description}>
              {paragraph}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between", // 헤더 아이템 정렬
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    alignSelf: "center",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 16, // 아이콘 간격
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  textContainer: {
    flex: 1, // 스크롤 가능 영역 확장
    width: "100%", // 가로 폭 조정
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16, // 문단 간 간격 추가
    textAlign: "justify",
    lineHeight: 24, // 텍스트 간격 조정
  },
});

export default RecipeDetailScreen;
