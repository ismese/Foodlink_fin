import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { styles } from "../../RecipeCommunityScreen/Ingredients/MyFoodWrite.style";
import NavigateBefore from "../../../components/NavigateBefore";
import Ionicons from "react-native-vector-icons/Ionicons";

const MyFoodWrite = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [selectedItem, setSelectedItem] = useState("---"); 
  const [year, setYear] = useState(""); 
  const [month, setMonth] = useState(""); 
  const [day, setDay] = useState(""); 

  const removeCategory = (category) => {
    Alert.alert(
      "카테고리 제거",
      `${category}을(를) 제거하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "확인",
          onPress: () =>
            setSelectedCategories((prev) =>
              prev.filter((item) => item !== category)
            ),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <NavigateBefore onPress={() => navigation.goBack()} />
          <Text style={styles.title}>식자재 추가하기</Text>
          <View style={styles.emptySpace} />
        </View>

        <View style={styles.authorSection}>
          <Image
            source={require("../../../../start-expo/assets/avatar.png")}
            style={styles.authorImage}
          />
          <View style={styles.authorTextContainer}>
            <Text style={styles.authorName}>동길님</Text>
            <Text style={styles.authorDescription}>
              등록하시는 식자재는 {selectedItem}입니다.
            </Text>
          </View>
        </View>

        <View>
        <Image
            source={require("../../../../start-expo/assets/avatar.png")} 
            style={styles.foodImage}
          />
        </View>

        <View style={styles.inputSection}>
          <View style={styles.expirationDateContainer}>
            <Text style={styles.labelText}>유통기한을 선택해주세요.</Text>
            <View style={styles.dateInputs}>
              <TextInput
                style={styles.dateInput}
                placeholder="년"
                keyboardType="numeric"
                value={year}
                onChangeText={setYear}
                maxLength={4}
              />
              <TextInput
                style={styles.dateInput}
                placeholder="월"
                keyboardType="numeric"
                value={month}
                onChangeText={setMonth}
                maxLength={2}
              />
              <TextInput
                style={styles.dateInput}
                placeholder="일"
                keyboardType="numeric"
                value={day}
                onChangeText={setDay}
                maxLength={2}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.labelText}>카테고리를 선택해주세요.</Text>
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={styles.categoryIcon}
              onPress={() =>
                navigation.navigate("CategoryScreen", {
                  setSelectedItems: setSelectedCategories,
                })
              }
            >
              <Ionicons name="grid-outline" size={22} color="green" />
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedCategoriesContainer}
            >
              {selectedCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.selectedItemTouchable}
                  onPress={() => removeCategory(category)}
                >
                  <Text style={styles.selectedItem}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.labelText2}>특이사항을 작성해주세요.</Text>
          <TextInput
            style={styles.textArea}
            placeholder="허위 식자재와 사기 등 위법행위에 대한 작성은 Food Link를 이용 제재 당할 수 있습니다."
            multiline
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.submitButtonText}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyFoodWrite;