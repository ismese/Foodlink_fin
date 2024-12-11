import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import styles from "./MyIngredientsScreen.style";
import NavigateBefore from "../../../components/NavigateBefore";
import { uploadImageToCloudinary } from "../../../services/cloudinaryService";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Firebase 인증 추가
import { app2 } from "../../../../firebase";
import { useNavigation } from "@react-navigation/native";

const MyIngredientsScreen = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [nickname, setNickname] = useState("사용자"); // 닉네임 상태 추가
  const myDb = getFirestore(app2); // 내 Firestore
  const usersDb = getFirestore(); // 형 Firestore
  const auth = getAuth(); // 인증 추가
  const navigation = useNavigation();

  /**
   * 🔥 Firestore에서 URL 불러오기 (닉네임 필터링)
   */
  const fetchImageUrls = async () => {
    try {
      const q = query(
        collection(myDb, "냉장고"),
        where("nickname", "==", nickname) // 현재 로그인한 사용자의 닉네임으로 필터링
      );
      const querySnapshot = await getDocs(q);
      const urls = querySnapshot.docs.map((doc) => ({
        id: doc.id, // 문서 ID
        url: doc.data().url, // URL
        nickname: doc.data().nickname || "사용자", // 닉네임 추가
      }));
      setImageUrls(urls);
    } catch (error) {
      console.error("URL 불러오기 실패:", error);
    }
  };

  /**
   * 🔥 로그인한 사용자의 닉네임 가져오기 (형의 Firestore에서 가져오기)
   */
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

  /**
   * 🔥 화면 로드 시 Firestore에서 이미지 URL 불러오기 및 닉네임 불러오기
   */
  useEffect(() => {
    fetchUserNickname();
  }, []);

  useEffect(() => {
    if (nickname) {
      fetchImageUrls();
    }
  }, [nickname]);

  /**
   * 🔥 이미지 업로드 및 URL Firestore 저장
   */
  
  const handleCameraPress = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("사진 라이브러리 접근 권한이 필요합니다.");
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
  
      if (!result.canceled) {
        // 클라우드에 이미지 업로드 (예: Cloudinary)
        const uploadedUrl = await uploadImageToCloudinary(result.assets[0].uri);
  
        // Firestore에 URL 저장 + 사용자 닉네임 추가
        const docRef = await addDoc(collection(myDb, "냉장고"), {
          url: uploadedUrl,
          nickname: nickname, // 사용자 닉네임 추가
        });
  
        // 상세정보 서브 컬렉션 생성 및 데이터 저장
        const detailsRef = collection(myDb, `냉장고/${docRef.id}/상세정보`);
        await addDoc(detailsRef, {
          categories: [],
          expirationDate: null,
          description: null,
        });
  
        // 로컬 상태 업데이트
        const newImage = { id: docRef.id, url: uploadedUrl, nickname: nickname };
        setImageUrls((prev) => [newImage, ...prev]); // 최신순으로 추가
  
        // 성공 메시지와 MyFoodWrite 화면 이동
        Alert.alert("업로드 성공", "이미지가 성공적으로 추가되었습니다!", [
          {
            text: "확인",
            onPress: () => {
              navigation.navigate("MyFoodWrite", { image: newImage });
            },
          },
        ]);
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      Alert.alert("오류", "이미지 업로드 중 문제가 발생했습니다.");
    }
  };
  

  /**
   * 🔥 이미지 삭제
   */
  const handleDeleteImage = async (imageId) => {
    Alert.alert(
      "이미지 삭제",
      "이 이미지를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(myDb, "냉장고", imageId));
              setImageUrls((prev) => prev.filter((item) => item.id !== imageId));
              Alert.alert("삭제 성공", "이미지가 성공적으로 삭제되었습니다.");
            } catch (error) {
              console.error("이미지 삭제 실패:", error);
              Alert.alert("오류", "이미지 삭제 중 문제가 발생했습니다.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <NavigateBefore onPress={() => navigation.goBack()} />
          <Text style={styles.title}>내 냉장고</Text>
          <View style={styles.emptySpace} />
        </View>

        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
            <MaterialIcons name="camera-alt" size={40} color="#2D754E" />
          </TouchableOpacity>
          <Text style={styles.profileText}>
            <Text style={styles.highlightText}>{nickname}</Text>
            <Text> 냉장고에{"\n"} 식자재를 추가해보세요.</Text>
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.gridContainer}>
          {imageUrls.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              onPress={() => navigation.navigate("IngredientDetailScreen", { item })}
            >
              <Image source={{ uri: item.url }} style={styles.gridImage} />
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleDeleteImage(item.id)}
              >
                <Text style={styles.deleteIconText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {Array.from({ length: 12 - imageUrls.length }).map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptyGridItem} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyIngredientsScreen;