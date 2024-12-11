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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "../../../styles/RecipeCommunity/ModfiyRecipe.style";
import NavigateBefore from "../../../components/NavigateBefore"; // NavigateBefore 컴포넌트
import * as ImagePicker from "expo-image-picker"; // 이미지 추가 라이브러리
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { app2 } from "../../../../firebase"; // Firebase 초기화
import { uploadImageToCloudinary } from "../../../services/cloudinaryService"; // Cloudinary 업로드 유틸리티

const ModifyRecipe = ({ navigation, route }) => {
  const { recipe } = route.params; // 전달받은 레시피 데이터
  const [images, setImages] = useState(recipe.images || Array(5).fill(null));
  const [title, setTitle] = useState(recipe.title || "");
  const [ingredients, setIngredients] = useState(recipe.ingredients || "");
  const [instructions, setInstructions] = useState(recipe.instructions || "");
  const db = getFirestore(app2);

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

    if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
      const selectedImage = pickerResult.assets[0].uri; // 선택한 이미지 URI
      try {
        const uploadedImageUrl = await uploadImageToCloudinary(selectedImage);
        setImages((prevImages) => {
          const newImages = [...prevImages];
          const emptyIndex = newImages.indexOf(null);
          if (emptyIndex !== -1) {
            newImages[emptyIndex] = uploadedImageUrl;
          } else {
            Alert.alert("슬롯 초과", "더 이상 이미지를 추가할 수 없습니다.");
          }
          return newImages;
        });
      } catch (error) {
        console.error("Cloudinary 업로드 실패:", error);
        Alert.alert("오류", "Cloudinary 업로드에 실패했습니다.");
      }
    } else {
      Alert.alert("오류", "이미지를 선택하지 않았습니다.");
    }
  };

  // 이미지 삭제 핸들러
  const handleDeleteImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = null; // 선택한 이미지를 null로 설정
      return newImages;
    });
  };

  // 레시피 수정 핸들러
  const handleUpdateRecipe = async () => {
    if (!title || !ingredients || !instructions || images.every((img) => img === null)) {
      Alert.alert("오류", "모든 필드를 입력하고 이미지를 추가해주세요.");
      return;
    }

    try {
      const recipeDocRef = doc(db, "recipe", recipe.id);
      await updateDoc(recipeDocRef, {
        title,
        ingredients,
        instructions,
        images: images.filter((img) => img !== null), // null이 아닌 이미지만 저장
      });
      Alert.alert("성공", "레시피가 성공적으로 수정되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.error("레시피 수정 중 오류:", error);
      Alert.alert("오류", "레시피 수정에 실패했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <NavigateBefore onPress={() => navigation.goBack()} />
              <Text style={styles.title}>레시피 수정</Text>
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
                  <View
                    key={index}
                    style={[
                      styles.recipeImagePlaceholder,
                      !uri && { backgroundColor: "#F2F3F6" },
                    ]}
                  >
                    {uri ? (
                      <>
                        <Image source={{ uri }} style={styles.recipeImage} />
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteImage(index)}
                        >
                          <Text style={styles.deleteButtonText}>삭제</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text style={styles.placeholderText}>이미지 없음</Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* 제목 섹션 */}
            <View style={styles.inputSection}>
              <Text style={styles.labelText}>제목을 수정해주세요.</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="제목을 입력하세요"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* 재료 섹션 */}
            <View style={styles.inputSection}>
              <Text style={styles.labelText}>재료를 수정해주세요.</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="재료를 입력하세요"
                value={ingredients}
                onChangeText={setIngredients}
              />
            </View>

            {/* 조리 순서 섹션 */}
            <View style={styles.inputSection}>
              <Text style={styles.labelText}>조리순서를 수정해주세요.</Text>
              <TextInput
                style={styles.textArea}
                placeholder="조리 순서를 입력하세요"
                multiline
                value={instructions}
                onChangeText={setInstructions}
              />
            </View>

            {/* 수정하기 버튼 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleUpdateRecipe}>
                <Text style={styles.submitButtonText}>수정하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ModifyRecipe;
