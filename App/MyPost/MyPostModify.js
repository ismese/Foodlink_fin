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
  Keyboard,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../MyPost/MyPostModify.style";
import NavigateBefore from "../components/NavigateBefore";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const MyPostModify = ({ navigation, route }) => {
  const { docId, postData } = route.params || {};
  const [nickname, setNickname] = useState("동길님"); // 초기값을 "동길님"으로 설정
  const [images, setImages] = useState(postData?.images || Array(5).fill(null));
  const [selectedCategories, setSelectedCategories] = useState(postData?.categories || []);
  const [year, setYear] = useState(postData?.expirationDate?.split("-")[0] || "");
  const [month, setMonth] = useState(postData?.expirationDate?.split("-")[1] || "");
  const [day, setDay] = useState(postData?.expirationDate?.split("-")[2] || "");
  const [title, setTitle] = useState(postData?.title || "");
  const [description, setDescription] = useState(postData?.description || "");
  const [priceOrExchange, setPriceOrExchange] = useState(postData?.priceOrExchange || "");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const db = getFirestore();
  const storage = getStorage();
  const auth = getAuth();

  useEffect(() => {
    if (!docId || !postData) {
      Alert.alert("오류", "게시물 ID가 유효하지 않거나 데이터가 없습니다.");
      navigation.goBack();
    }

    const fetchNickname = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("사용자가 인증되지 않았습니다.");
          return;
        }
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname || "사용자");
        }
      } catch (error) {
        console.error("닉네임 가져오기 오류:", error);
      }
    };

    fetchNickname();

    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleAddImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("권한 필요", "사진 라이브러리 접근 권한이 필요합니다.");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!pickerResult.canceled) {
        const newImageUri = pickerResult.assets[0].uri;
        setImages((prevImages) => {
          const newImages = [...prevImages];
          const emptyIndex = newImages.indexOf(null);
          if (emptyIndex !== -1) {
            newImages[emptyIndex] = newImageUri;
          } else {
            Alert.alert("슬롯 초과", "더 이상 이미지를 추가할 수 없습니다.");
          }
          return newImages;
        });
      }
    } catch (err) {
      Alert.alert("오류 발생", "이미지를 선택하는 동안 문제가 발생했습니다.");
    }
  };

  const uploadImagesToStorage = async () => {
    const uploadedImageUrls = [];
    try {
      for (const imageUri of images.filter((uri) => uri)) {
        const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
        const storageRef = ref(storage, `images/${docId}/${filename}`);
        const img = await fetch(imageUri);
        const bytes = await img.blob();
        await uploadBytes(storageRef, bytes);
        const downloadUrl = await getDownloadURL(storageRef);
        uploadedImageUrls.push(downloadUrl);
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      Alert.alert("오류", "이미지 업로드 중 문제가 발생했습니다.");
    }
    return uploadedImageUrls;
  };

  const validateAndSubmit = async () => {
    if (!docId) {
      Alert.alert("오류", "게시물 ID가 유효하지 않습니다.");
      return;
    }

    try {
      const postRef = doc(db, "posts", docId);
      const docSnap = await getDoc(postRef);
      if (!docSnap.exists()) {
        Alert.alert("오류", "수정하려는 게시물이 존재하지 않습니다.");
        return;
      }

      const existingData = docSnap.data();
      const uploadedImageUrls = await uploadImagesToStorage();

      const updatedData = {
        title: title.trim() || existingData.title,
        description: description.trim() || existingData.description,
        categories: selectedCategories.length > 0 ? selectedCategories : existingData.categories,
        expirationDate: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : existingData.images,
        priceOrExchange: priceOrExchange.trim() || existingData.priceOrExchange,
        location: existingData.location,
        userUID: existingData.userUID,
        createdAt: existingData.createdAt,
      };

      await updateDoc(postRef, updatedData);

      Alert.alert("수정 완료", "게시물이 성공적으로 수정되었습니다.", [
        { text: "확인", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("게시물 수정 중 오류 발생:", error);
      Alert.alert("수정 실패", "게시물을 수정하는 동안 문제가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={isKeyboardVisible}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <NavigateBefore onPress={() => navigation.goBack()} />
            <Text style={styles.title}>게시물 수정하기</Text>
            <View style={styles.emptySpace} />
          </View>

          <View style={styles.authorSection}>
            <Image
              source={require("../../start-expo/assets/avatar.png")}
              style={styles.authorImage}
            />
            <View style={styles.authorTextContainer}>
              <Text style={styles.authorName}>{nickname}</Text>
              <Text style={styles.authorDescription}>
                등록할 식자재를 선택해주세요
              </Text>
            </View>
          </View>

          <View style={styles.imageSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.foodImagesContainer}
            >
              <TouchableOpacity style={styles.addImageBox} onPress={handleAddImage}>
                <Text style={styles.addImageText}>+</Text>
              </TouchableOpacity>
              {images.map((uri, index) => (
                <View
                  key={index}
                  style={[styles.foodImagePlaceholder, !uri && { backgroundColor: "#F2F3F6" }]}
                >
                  {uri && <Image source={{ uri }} style={styles.foodImage} />}
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.labelText}>제목을 작성해주세요.</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="제목을 입력하세요"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.labelText}>소개글을 작성해주세요.</Text>
            <TextInput
              style={styles.textArea}
              placeholder="허위 식자재와 사기 등 위법행위에 대한 작성은 Food Link를 이용 제재 당할 수 있습니다."
              multiline
              value={description}
              onChangeText={setDescription}
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
                <Ionicons name="grid-outline" size={24} color="green" />
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
                    onPress={() =>
                      setSelectedCategories((prev) =>
                        prev.filter((cat) => cat !== category)
                      )
                    }
                  >
                    <Text style={styles.selectedItem}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.labelText}>가격 혹은 나눔, 교환을 작성해주세요.</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="예: 5000원, 무료 나눔, 물물교환 제안 등"
              value={priceOrExchange}
              onChangeText={setPriceOrExchange}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={validateAndSubmit}>
              <Text style={styles.submitButtonText}>수정하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MyPostModify;
