import React from 'react';
import { View, Text, Image, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../../../Screens/RecipeCommunityScreen/Ingredients/NewIngredients.style';
import NavigateBefore from '../../../components/NavigateBefore';
import { Ionicons } from '@expo/vector-icons';

const NewIngredients = ({ navigation }) => {
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
          <Image style={styles.recipeImage} source={require("../../../../start-expo/assets/avatar.png")} />
        </View>

        {/* Recipe Title */}
        <View style={styles.recipeTitleContainer}>
          <Text style={styles.recipeTitle}>[고구마 요리] 초간단 요리 고구마 맛탕 만들기</Text>
        </View>

        {/* Recipe Info
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Ionicons name="person" size={15} color="#000000" />
            <Text style={styles.infoText}>2인분</Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="time-outline" size={15} color="#000000" />
            <Text style={styles.infoText}>30분 이내</Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="star-outline" size={15} color="#000000" />
            <Text style={styles.infoText}>아무나</Text>
          </View>
        </View> */}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Ingredients */}
        <View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>재료</Text>
            <View style={styles.ingredientsContainer}>
              <Text style={styles.ingredient}>#고구마</Text>
              <Text style={styles.ingredient}>#소금</Text>
              <Text style={styles.ingredient}>#설탕</Text>
              <Text style={styles.ingredient}>#식용류</Text>
              <Text style={styles.ingredient}>#검은깨</Text>
              <Text style={styles.ingredient}>#올리고당</Text>
            </View>
          </View>

          {/* Steps */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>조리순서</Text>
            <ScrollView style={styles.stepsContainer}>
              
              <Text style={styles.stepText}>
                조리에 대한 내용이 들어갈 자리
              </Text>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewIngredients;
