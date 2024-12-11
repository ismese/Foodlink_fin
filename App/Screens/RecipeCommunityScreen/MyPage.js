import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { styles } from "../RecipeCommunityScreen/MyPage.style";
import CmPostList from "./Community/CmPostList"; // CmPostList 컴포넌트
import RecipeList from "../RecipeCommunityScreen/Recipe/RecipeList"; // RecipeList 컴포넌트
import * as ImagePicker from "expo-image-picker";
import { getFirestore, collection, getDocs, addDoc, query, where, getDoc, doc } from "firebase/firestore"; // Firestore 관련 추가
import { app2 } from "../../../firebase";
import { uploadImageToCloudinary } from "../../services/cloudinaryService"; // Cloudinary 업로드 함수 추가
import { getAuth } from "firebase/auth"; // Firebase 인증 추가

const MyPage = () => {
  const navigation = useNavigation();
  const [ingredients, setIngredients] = useState([]); // Firestore 이미지 데이터 상태
  const [selectedTab, setSelectedTab] = useState("레시피"); // 현재 선택된 탭 상태
  const [nickname, setNickname] = useState("사용자"); // 닉네임 상태 추가
  const db = getFirestore(app2); // Firestore 데이터베이스 가져오기
  const auth = getAuth(); // Firebase 인증 가져오기
  const usersDb = getFirestore(); // 형 Firestore 가져오기

  // 🔥 로그인한 사용자의 닉네임 가져오기 (형의 Firestore에서 가져오기)
  const fetchUserNickname = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("로그인된 사용자가 없습니다.");

      const uid = user.uid;
      const userRef = doc(usersDb, "users", uid); // 형 Firestore에서 사용자 문서 참조
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setNickname(userData.nickname || "사용자");
        console.log("닉네임 가져오기 성공:", userData.nickname);
      } else {
        console.error("형 Firestore에서 사용자 정보를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("닉네임을 가져오는 중 오류:", err);
    }
  };

  // 🔥 Firestore에서 URL 불러오기 (닉네임 필터링)
  const fetchIngredients = async () => {
    try {
      const q = query(
        collection(db, "냉장고"),
        where("nickname", "==", nickname) // 현재 로그인한 사용자의 닉네임으로 필터링
      );
      const querySnapshot = await getDocs(q);
      const imageList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        url: doc.data().url,
        nickname: doc.data().nickname || "사용자", // 닉네임 추가
      }));
      setIngredients(imageList);
    } catch (error) {
      console.error("식자재 데이터 로드 실패:", error);
    }
  };

  // 🔥 화면 로드 시 Firestore에서 이미지 URL 불러오기 및 닉네임 불러오기
  useEffect(() => {
    fetchUserNickname();
  }, []);

  useEffect(() => {
    if (nickname) {
      fetchIngredients();
    }
  }, [nickname]);

  // Navigation Focus 시 데이터 갱신
  useFocusEffect(
    React.useCallback(() => {
      fetchIngredients();
    }, [nickname])
  );

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

    if (!pickerResult.canceled) {
      try {
        // Cloudinary에 이미지 업로드
        const uploadedUrl = await uploadImageToCloudinary(pickerResult.assets[0].uri);

        // Firestore에 URL 저장 + 업로드 시간 추가
        const docRef = await addDoc(collection(db, "냉장고"), {
          url: uploadedUrl,
          createdAt: new Date(), // 업로드 시간 추가
          nickname: nickname, // 사용자 닉네임 추가
        });

        // 상태 업데이트
        setIngredients((prev) => [
          ...prev,
          { id: docRef.id, url: uploadedUrl, createdAt: new Date(), nickname: nickname },
        ]);

        Alert.alert("이미지 추가", "이미지가 성공적으로 추가되었습니다!");
      } catch (error) {
        console.error("이미지 업로드 및 저장 실패:", error);
        Alert.alert("오류", "이미지 업로드 중 문제가 발생했습니다.");
      }
    }
  };

  // + 버튼 클릭 핸들러
  const handleAddPost = () => {
    if (selectedTab === "레시피") {
      navigation.navigate("MyRecipePost"); // 레시피 탭의 + 버튼
    } else if (selectedTab === "커뮤니티") {
      navigation.navigate("MyCmPost"); // 커뮤니티 탭의 + 버튼
    }
  };

  return (
    <View style={styles.container}>
      {/* 내 식자재 Section */}
      <View style={styles.myIngredientsSection}>
        <View style={styles.myIngredientsHeader}>
          <Text style={styles.headerText}>내 식자재</Text>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => navigation.navigate("MyIngredientsScreen")}
          >
            <Text style={styles.moreText}>더 보기</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.ingredientsListContainer}
        >
          {/* 사진 추가 버튼 */}
          <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>

          {/* 식자재 이미지 */}
          {ingredients.map((item) => (
            <View key={item.id} style={styles.ingredientImage}>
              <Image source={{ uri: item.url }} style={styles.ingredientImage} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 게시판 Section */}
      <View style={styles.boardSection}>
        {/* 게시판 헤더 */}
        <View style={styles.boardHeader}>
          <Text style={styles.headerText}>게시판</Text>
          <TouchableOpacity style={styles.addPostButton} onPress={handleAddPost}>
            <Text style={styles.addPostButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.boardTabs}>
          <TouchableOpacity
            style={selectedTab === "레시피" ? styles.tabActive : styles.tab}
            onPress={() => setSelectedTab("레시피")}
          >
            <Text
              style={
                selectedTab === "레시피"
                  ? styles.tabActiveText
                  : styles.tabText
              }
            >
              레시피
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTab === "커뮤니티" ? styles.tabActive : styles.tab}
            onPress={() => setSelectedTab("커뮤니티")}
          >
            <Text
              style={
                selectedTab === "커뮤니티"
                  ? styles.tabActiveText
                  : styles.tabText
              }
            >
              커뮤니티
            </Text>
          </TouchableOpacity>
        </View>

        {/* 레시피 탭 */}
        {selectedTab === "레시피" && (
          <View style={styles.recipeListContainer}>
            <RecipeList />
          </View>
        )}

        {/* 커뮤니티 */}
        {selectedTab === "커뮤니티" && (
          <View style={styles.postContainer}>
            <CmPostList navigation={navigation} />
          </View>
        )}
      </View>
    </View>
  );
};

export default MyPage;
