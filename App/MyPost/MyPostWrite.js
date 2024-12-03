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
import * as ImagePicker from "expo-image-picker"; // ImagePicker 추가
import { styles } from "../MyPost/MyPostWrite.style";
import NavigateBefore from "../components/NavigateBefore"; // NavigateBefore 컴포넌트
import Ionicons from "react-native-vector-icons/Ionicons";
import { PostContext } from "../PostContext"; // PostContext import

const MyPostWrite = ({ navigation }) => {
  const { addPost } = useContext(PostContext); // PostContext에서 addPost 가져오기
  const [images, setImages] = useState(Array(5).fill(null)); // 사진 상태
  const [selectedCategories, setSelectedCategories] = useState([]); // 선택된 카테고리
  const [selectedItem, setSelectedItem] = useState("---"); // 선택된 식자재
  const [year, setYear] = useState(""); // 년 입력
  const [month, setMonth] = useState(""); // 월 입력
  const [day, setDay] = useState(""); // 일 입력
  const [title, setTitle] = useState(""); // 제목 입력
  const [description, setDescription] = useState(""); // 소개글 입력
  const [priceOrExchange, setPriceOrExchange] = useState(""); // 가격/나눔/교환 입력
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); // 키보드 상태

  useEffect(() => {
    // 키보드 이벤트 리스너 등록
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      // 컴포넌트가 언마운트될 때 리스너 제거
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
    } catch (err) {
      Alert.alert("오류 발생", "이미지를 선택하는 동안 문제가 발생했습니다.");
    }

    // 상태 변경 함수는 버튼 클릭 이벤트 핸들러에서 실행
    const newPost = {
      mages: imageArray[0], // 첫 번째 이미지 URI
    };

    addPost(newPost); // Context에 추가
    navigation.goBack(); // MyScreen으로 돌아가기
  };

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
 
  const validateAndSubmit = () => {
    if (images.filter((image) => image !== null).length === 0) {
      Alert.alert("입력 오류", "사진을 하나 이상 추가해야 합니다.");
      return;
    }
    if (title.length < 1) {
      Alert.alert("입력 오류", "제목은 5글자 이상 작성해야 합니다.");
      return;
    }
    if (description.length < 1) {
      Alert.alert("입력 오류", "소개글은 20글자 이상 작성해야 합니다.");
      return;
    }
    const yearInt = parseInt(year, 10);
    if (!year || yearInt <= 2023) {
      Alert.alert("입력 오류", "유통기한의 년도는 2024년 이후여야 합니다.");
      return;
    }
    const monthInt = parseInt(month, 10);
    if (!month || monthInt < 1 || monthInt > 12) {
      Alert.alert("입력 오류", "월은 1월에서 12월 사이여야 합니다.");
      return;
    }
    const dayInt = parseInt(day, 10);
    if (!day || dayInt < 1 || dayInt > 31) {
      Alert.alert("입력 오류", "일은 1일부터 31일까지 작성해야 합니다.");
      return;
    }
    if (selectedCategories.length === 0) {
      Alert.alert("입력 오류", "카테고리를 한 개 이상 선택해야 합니다.");
      return;
    }
  
    // 새로운 게시물 추가
    addPost({
      id: Date.now().toString(),
      title,
      description,
      categories: selectedCategories,
      date: new Date().toLocaleString(),
      images: images.filter((image) => image !== null),
      priceOrExchange,
    });
  
    Alert.alert("추가 완료", "게시물이 추가되었습니다.");
  
    // "내 게시판" 탭으로 이동
    navigation.navigate("TabNavigator", {
      screen: "내 게시판",
    });
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={isKeyboardVisible} // 키보드가 올라왔을 때만 동작
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <NavigateBefore onPress={() => navigation.goBack()} />
            <Text style={styles.title}>게시물 추가하기</Text>
            <View style={styles.emptySpace} />
          </View>

          {/* 작성자 정보 */}
          <View style={styles.authorSection}>
            <Image
              source={require("../../start-expo/assets/avatar.png")} // Avatar 이미지
              style={styles.authorImage}
            />
            <View style={styles.authorTextContainer}>
              <Text style={styles.authorName}>동길님</Text>
              <Text style={styles.authorDescription}>
                등록할 식자재를 선택해주세요
              </Text>
            </View>
          </View>

          {/* 이미지 추가 섹션 */}
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

          {/* 내용 섹션 */}
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

          {/* 유통기한 섹션 */}
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

          {/* 카테고리 섹션 */}
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

          {/* 가격/나눔/교환 섹션 */}
          <View style={styles.inputSection}>
            <Text style={styles.labelText}>가격 혹은 나눔, 교환을 작성해주세요.</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="예: 5000원, 나눔, 교환"
              value={priceOrExchange}
              onChangeText={setPriceOrExchange}
            />
          </View>

          {/* 추가하기 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={() => navigation.goBack()}>
              <Text style={styles.submitButtonText}>추가하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    
  );
};

export default MyPostWrite;
