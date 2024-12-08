import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { styles } from "../../../styles/RecipeCommunity/MyCmPost.style";
import NavigateBefore from "../../../components/NavigateBefore";
import CmPostList from "./CmPostList"; // 게시물 리스트 컴포넌트 임포트
import MyCmPostList from "./MyCmPostList";

const MyCmPost = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <NavigateBefore onPress={() => navigation.goBack()} />
          <Text style={styles.title}>내 커뮤니티</Text>
          <View style={styles.emptySpace} />
        </View>

        {/* 게시물 리스트 */}
        <View style={styles.recipeListContainer}>
          <MyCmPostList navigation={navigation} />
        </View>

        {/* 추가하기 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.navigate("AddCmPost")}
          >
            <Text style={styles.submitButtonText}>추가하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyCmPost;