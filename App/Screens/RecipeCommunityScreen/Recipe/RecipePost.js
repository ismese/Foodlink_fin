import React, { useState, useEffect } from "react"; // useState와 useEffect를 추가로 가져옵니다
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
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "../../../styles/RecipeCommunity/RecipePost.style";
import NavigateBefore from "../../../components/NavigateBefore"; // NavigateBefore 컴포넌트
import * as ImagePicker from "expo-image-picker"; // 이미지 추가 라이브러리
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
import { app2 } from "../../../../firebase"; // Firebase 초기화
import { uploadImageToCloudinary } from "../../../services/cloudinaryService"; // Cloudinary 업로드 유틸리티
import { getAuth } from "firebase/auth"; // Firebase Auth 가져오기

const RecipePost = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [nickname, setNickname] = useState(""); // 사용자 닉네임 상태 추가

  const auth = getAuth(); // 형 Firebase Auth
  const db = getFirestore(app2); // 본인 Firebase Firestore
  const usersDb = getFirestore(); // 형 Firebase Firestore

  // 사용자 닉네임 가져오기
  useEffect(() => {
    const fetchNickname = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(usersDb, "users", user.uid); // 형 Firebase의 'users' 컬렉션에서 UID로 사용자 정보 가져오기
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const fetchedNickname = userDoc.data().nickname || "익명";
            console.log("가져온 닉네임:", fetchedNickname); // 디버깅 로그
            setNickname(fetchedNickname);
          } else {
            console.log("사용자 문서 없음"); // 디버깅 로그
          }
        } catch (error) {
          console.error("닉네임 가져오기 실패:", error); // 에러 로그
        }
      } else {
        console.log("로그인된 사용자 없음"); // 디버깅 로그
      }
    };

    fetchNickname();
  }, [auth, usersDb]);

  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("권한 필요", "사진 라이브러리 접근 권한이 필요합니다.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!pickerResult.canceled) {
      try {
        const uploadedImageUrl = await uploadImageToCloudinary(
          pickerResult.assets[0].uri
        );
        setImages((prevImages) => [...prevImages, uploadedImageUrl]);
      } catch (error) {
        Alert.alert("오류", "이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handleAddRecipe = async () => {
    if (!title || !ingredients || !instructions || images.length === 0) {
      Alert.alert("오류", "모든 필드를 입력하고 이미지를 추가해주세요.");
      return;
    }

    try {
      await addDoc(collection(db, "recipe"), {
        title,
        ingredients,
        instructions,
        images,
        createdAt: new Date().toISOString(),
        nickname, // 닉네임 추가
      });
      Alert.alert("성공", "레시피가 성공적으로 추가되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.error("레시피 추가 중 오류:", error);
      Alert.alert("오류", "레시피 추가에 실패했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* KeyboardAvoidingView로 키보드가 가리지 않도록 설정 */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <NavigateBefore onPress={() => navigation.goBack()} />
              <Text style={styles.title}>레시피 추가</Text>
              <View style={styles.emptySpace} />
            </View>

            {/* 이미지 추가 섹션 */}
            <View style={styles.imageSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recipeImagesContainer}
              >
                <TouchableOpacity style={styles.addImageBox} onPress={handleAddImage}>
                  <Text style={styles.addImageText}>+</Text>
                </TouchableOpacity>
                {images.map((uri, index) => (
                  <View key={index} style={styles.recipeImagePlaceholder}>
                    <Image source={{ uri }} style={styles.recipeImage} />
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* 제목 섹션 */}
            <View style={styles.inputSection}>
              <Text style={styles.labelText}>제목을 작성해주세요.</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="제목을 입력하세요"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* 재료 섹션 */}
            <View style={styles.inputSection}>
              <Text style={styles.labelText}>재료를 작성해주세요.</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="재료를 입력하세요"
                value={ingredients}
                onChangeText={setIngredients}
              />
            </View>

            {/* 조리 순서 섹션 */}
            <View style={styles.inputSection}>
              <Text style={styles.labelText}>조리 순서를 작성해주세요.</Text>
              <TextInput
                style={styles.textArea}
                placeholder="조리 순서를 입력하세요"
                multiline
                value={instructions}
                onChangeText={setInstructions}
              />
            </View>

            {/* 추가하기 버튼 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleAddRecipe}>
                <Text style={styles.submitButtonText}>추가하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RecipePost;
