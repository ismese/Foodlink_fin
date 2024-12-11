import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { styles } from "../../RecipeCommunityScreen/Ingredients/MyFoodWrite.style";
import NavigateBefore from "../../../components/NavigateBefore";
import Ionicons from "react-native-vector-icons/Ionicons";
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firestore2, firestore1 } from "../../../../firebase"; // 두 번째 DB (현재 DB)와 형 DB

const MyFoodWrite = ({ navigation, route }) => {
  const [nickname, setNickname] = useState("사용자"); // 로그인 사용자 닉네임
  const [selectedCategories, setSelectedCategories] = useState([]); // 카테고리 선택
  const [selectedItem, setSelectedItem] = useState(""); // 사용자가 입력한 아이템명
  const [year, setYear] = useState(""); // 유통기한 (년)
  const [month, setMonth] = useState(""); // 유통기한 (월)
  const [day, setDay] = useState(""); // 유통기한 (일)
  const [description, setDescription] = useState(""); // 특이사항 입력
  const { image } = route.params; // 전달받은 이미지 정보

  const auth = getAuth(); // 로그인 사용자 정보 가져오기

  // 🔥 형 DB에서 닉네임 불러오기
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(firestore1, "users", user.uid); // 형 DB에서 사용자 UID에 해당하는 문서 참조
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setNickname(userData.nickname || "사용자");
          } else {
            console.error("형 DB에서 사용자 정보를 찾을 수 없습니다.");
          }
        }
      } catch (error) {
        console.error("형 DB에서 닉네임 불러오기 오류:", error);
      }
    };

    fetchNickname();
  }, []);

  // 🔥 null 데이터 문서 삭제
  const deleteNullDocs = async (subcollectionRef) => {
    try {
      const existingDocs = await getDocs(subcollectionRef);

      existingDocs.forEach(async (docSnapshot) => {
        const data = docSnapshot.data();
        if (
          (!data.categories || data.categories.length === 0) &&
          (!data.description || data.description === null) &&
          (!data.expirationDate || data.expirationDate === null) &&
          (!data.selectedItem || data.selectedItem === "")
        ) {
          // null 데이터 문서 삭제
          await deleteDoc(doc(subcollectionRef, docSnapshot.id));
          console.log(`null 데이터 문서 삭제: ${docSnapshot.id}`);
        }
      });
    } catch (error) {
      console.error("null 데이터 문서 삭제 중 오류:", error);
    }
  };

  // 🔥 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    try {
      // 🔥 유효성 검사
      if (!selectedItem) {
        Alert.alert("오류", "등록하실 식자재를 입력해주세요.");
        return;
      }

      if (!year || !month || !day) {
        Alert.alert("오류", "유통기한을 정확히 입력해주세요.");
        return;
      }

      if (selectedCategories.length === 0) {
        Alert.alert("오류", "최소한 하나의 카테고리를 선택해주세요.");
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("오류", "로그인된 사용자가 없습니다.");
        return;
      }

      const expirationDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // 유통기한 (yyyy-MM-dd)

      // 🔥 상위 문서 ID로 "상세정보" 컬렉션 경로 설정
      const mainDocRef = doc(firestore2, "냉장고", image.id);
      const subcollectionRef = collection(mainDocRef, "상세정보");

      // 🔥 Firestore에 상세정보 추가
      await setDoc(doc(subcollectionRef), {
        categories: selectedCategories, // 선택된 카테고리
        expirationDate: expirationDate, // 유통기한
        description: description || null, // 특이사항
        selectedItem: selectedItem, // 사용자가 입력한 아이템명
        nickname: nickname, // 사용자 닉네임
        createdAt: new Date().toISOString(), // 생성 날짜
      });

      // 🔥 null 데이터 문서 삭제
      await deleteNullDocs(subcollectionRef);

      Alert.alert("성공", "상세정보가 성공적으로 저장되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      Alert.alert("오류", "상세정보 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <NavigateBefore onPress={() => navigation.goBack()} />
              <Text style={styles.title}>상세정보 추가하기</Text>
              <View style={styles.emptySpace} />
            </View>

            <View style={styles.authorSection}>
              <Image
                source={require("../../../../start-expo/assets/avatar.png")} 
                style={styles.authorImage}
              />
              <View style={styles.authorTextContainer}>
                <Text style={styles.authorName}>{nickname}님</Text>
                <Text style={styles.authorDescription}>
                  등록하시는 식자재는 
                  <TextInput
                    style={styles.textInput}
                    placeholder="---"
                    value={selectedItem}
                    onChangeText={setSelectedItem}
                  />
                  입니다.
                </Text>
              </View>
            </View>

            <View>
              <Image
                source={{ uri: image?.url || "https://via.placeholder.com/150" }}
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
                  <Ionicons name="grid-outline" size={22} color="#2D754E" />
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
                placeholder="특이사항을 입력하세요."
                multiline
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                <Text style={styles.submitButtonText}>저장하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default MyFoodWrite;
