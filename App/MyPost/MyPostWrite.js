import React, { useState, useEffect, useContext } from "react";
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
import * as Location from "expo-location";
import { styles } from "../MyPost/MyPostWrite.style";
import NavigateBefore from "../components/NavigateBefore";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth, firestore1, storage } from "../../firebase";
import { PostContext } from "../PostContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const MyPostWrite = ({ navigation }) => {
  const { addPost } = useContext(PostContext);
  const [images, setImages] = useState(Array(5).fill(null));
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceOrExchange, setPriceOrExchange] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [nickname, setNickname] = useState("닉네임 없음");
  const [location, setLocation] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // 닉네임 가져오기 및 위치 권한 요청
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("사용자가 로그인되어 있지 않습니다.");
          return;
        }

        const userDoc = await firestore1.collection("users").doc(currentUser.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setNickname(userData.nickname || "닉네임 없음");
        } else {
          console.log("사용자 문서를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("닉네임을 가져오는 중 오류 발생:", error);
      }
    };

    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("권한 필요", "위치 정보 접근 권한이 필요합니다.");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation.coords);
      } catch (error) {
        console.error("위치 정보를 가져오는 중 오류 발생:", error);
        Alert.alert(
          "위치 오류",
          "현재 위치를 가져올 수 없습니다. 위치 서비스를 활성화하고 다시 시도해주세요."
        );
      }
    };

    fetchNickname();
    requestLocationPermission();

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

  // 이미지 추가 함수
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
        setImages((prevImages) => {
          const newImages = [...prevImages];
          const emptyIndex = newImages.indexOf(null);
          if (emptyIndex !== -1) {
            newImages[emptyIndex] = pickerResult.assets[0].uri;
          } else {
            Alert.alert("슬롯 초과", "더 이상 이미지를 추가할 수 없습니다.");
          }
          return newImages;
        });
      }
    } catch (error) {
      Alert.alert("오류 발생", "이미지를 선택하는 동안 문제가 발생했습니다.");
    }
  };

  // 카테고리 제거 함수
  const removeCategory = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.filter((item) => item !== category)
    );
  };

  // 이미지 업로드
  const uploadImagesToStorage = async (images) => {
    const imageUrls = [];
    try {
      for (const uri of images) {
        if (uri) {
          const response = await fetch(uri);
          const blob = await response.blob();
          const fileName = uri.split("/").pop();
          const imageRef = ref(storage, `images/${fileName}`);
          await uploadBytes(imageRef, blob);
          const downloadURL = await getDownloadURL(imageRef);
          imageUrls.push(downloadURL);
        }
      }
      return imageUrls;
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      Alert.alert("오류", "이미지 업로드 중 문제가 발생했습니다.");
      return [];
    }
  };

  // Firestore에 게시글 저장
  const savePostToFirestore = async (post, imageUrls) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("로그인 필요", "로그인 상태에서만 게시글을 저장할 수 있습니다.");
        return;
      }

      await firestore1.collection("posts").add({
        ...post,
        userUID: currentUser.uid,
        createdAt: new Date(),
        images: imageUrls,
        location, // 위치 정보 저장
      });

      Alert.alert("성공", "게시글이 저장되었습니다.");
    } catch (error) {
      console.error("게시글 저장 오류:", error);
      Alert.alert("오류", "게시글 저장 중 오류가 발생했습니다.");
    }
  };

  // 유효성 검사 후 게시글 저장
  const validateAndSubmit = async () => {
    if (images.filter((image) => image !== null).length === 0) {
      Alert.alert("입력 오류", "사진을 하나 이상 추가해야 합니다.");
      return;
    }
    if (title.length < 5) {
      Alert.alert("입력 오류", "제목은 5글자 이상 작성해야 합니다.");
      return;
    }
    if (description.length < 20) {
      Alert.alert("입력 오류", "소개글은 20글자 이상 작성해야 합니다.");
      return;
    }
    if (!location || !location.latitude || !location.longitude) {
      Alert.alert("위치 오류", "현재 위치를 확인할 수 없습니다.");
      return;
    }

    const post = {
      title,
      description,
      categories: selectedCategories,
      priceOrExchange,
      expirationDate: `${year}-${month}-${day}`,
      createdAt: new Date(),
    };

    const imageUrls = await uploadImagesToStorage(images.filter((image) => image !== null));

    if (imageUrls.length > 0) {
      await savePostToFirestore(post, imageUrls);
      navigation.navigate("TabNavigator", { screen: "내 게시판" });
    } else {
      Alert.alert("오류", "이미지 업로드 실패. 게시글이 저장되지 않았습니다.");
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
          {/* Header */}
          <View style={styles.header}>
            <NavigateBefore onPress={() => navigation.goBack()} />
            <Text style={styles.title}>게시물 추가하기</Text>
          </View>

          {/* Author Section */}
          <View style={styles.authorSection}>
            <Image
              source={require("../../start-expo/assets/avatar.png")}
              style={styles.authorImage}
            />
            <View>
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
                    onPress={() => removeCategory(category)}
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
              placeholder="예: 5000원, 나눔, 교환"
              value={priceOrExchange}
              onChangeText={setPriceOrExchange}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={validateAndSubmit}>
              <Text style={styles.submitButtonText}>추가하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MyPostWrite;
