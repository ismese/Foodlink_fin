import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActionSheetIOS,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { app2 } from "../../../../firebase"; // 본인 Firebase Firestore 초기화

const MyRecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [userNickname, setUserNickname] = useState(""); // 현재 사용자 닉네임
  const db = getFirestore(app2); // 본인 Firebase Firestore
  const usersDb = getFirestore(); // 형 Firebase Firestore
  const auth = getAuth();
  const navigation = useNavigation();

  // 현재 로그인된 사용자 닉네임 가져오기
  const fetchUserNickname = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        const userDocRef = doc(usersDb, "users", user.uid); // 'users' 컬렉션에서 UID로 사용자 문서 가져오기
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserNickname(userDoc.data().nickname || "익명");
          console.log("사용자 닉네임:", userDoc.data().nickname);
        } else {
          console.log("사용자 문서를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("닉네임 가져오기 실패:", error);
      }
    } else {
      console.log("로그인된 사용자 없음");
    }
  };

  // Firestore에서 사용자가 쓴 레시피만 가져오기
  const fetchRecipes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recipe"));
      const fetchedRecipes = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((recipe) => recipe.nickname === userNickname); // 현재 사용자의 닉네임과 일치하는 레시피 필터링
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error("레시피 데이터 가져오기 실패:", error);
    }
  };

  // 레시피 삭제 핸들러
  const handleDeleteRecipe = async (recipeId) => {
    try {
      await deleteDoc(doc(db, "recipe", recipeId)); // Firestore에서 해당 레시피 삭제
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      ); // 로컬 상태 업데이트
      Alert.alert("삭제 성공", "레시피가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("레시피 삭제 중 오류:", error);
      Alert.alert("삭제 실패", "레시피를 삭제하지 못했습니다.");
    }
  };

  // 옵션 버튼 핸들러
  const showOptions = (recipe) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["게시글 수정", "삭제", "닫기"],
        destructiveButtonIndex: 1, // "삭제"를 빨간색으로 표시
        cancelButtonIndex: 2, // "닫기" 버튼의 인덱스
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // 수정 화면으로 이동
          navigation.navigate("ModifyRecipe", { recipe }); // recipe 데이터 전달
        } else if (buttonIndex === 1) {
          Alert.alert(
            "게시물 삭제",
            "정말로 삭제하시겠습니까?",
            [
              { text: "취소", style: "cancel" },
              {
                text: "삭제",
                onPress: () => handleDeleteRecipe(recipe.id),
              },
            ],
            { cancelable: true }
          );
        }
      }
    );
  };

  // 데이터가 홀수일 때 빈 카드 추가
  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  useEffect(() => {
    fetchUserNickname(); // 닉네임 가져오기
  }, []);

  useEffect(() => {
    if (userNickname) {
      fetchRecipes(); // 닉네임을 가져온 후 레시피 필터링
    }
  }, [userNickname]);

  return (
    <FlatList
      data={formatData(recipes, 2)} // 2열 데이터 정렬
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => {
        if (item.empty) {
          return <View style={[styles.recipeCard, styles.invisibleCard]} />;
        }
        return (
          <View style={styles.recipeCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate("NewIngredients", { recipe: item })}
            >
              <View style={styles.recipeImage}>
                {item.images && item.images.length > 0 ? (
                  <Image source={{ uri: item.images[0] }} style={styles.image} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>이미지 없음</Text>
                  </View>
                )}
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{item.title || "제목 없음"}</Text>
                <Text style={styles.recipeAuthor}>{item.nickname || "작성자 없음"}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => showOptions(item)}
            >
              <MaterialIcons name="more-vert" size={14} color="#8E8E8E" />
            </TouchableOpacity>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between", // 각 열의 아이템 사이 간격
    marginBottom: 10,
  },
  recipeCard: {
    flex: 1, // 2열로 나누기 위해 flex를 1로 설정
    marginHorizontal: 5, // 카드 간격
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2, // 그림자 효과 (Android)
    shadowColor: "#000", // 그림자 효과 (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative", // 옵션 버튼 위치 조정을 위해
  },
  invisibleCard: {
    backgroundColor: "transparent",
    elevation: 0, // 그림자 제거
  },
  recipeImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F2F3F6", // 회색 배경
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  recipeInfo: {
    padding: 10,
    position: "relative",
  },
  recipeTitle: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recipeAuthor: {
    color: "#8C8C8C",
    fontSize: 12,
    marginBottom: 5,
  },
  optionsButton: {
    position: "absolute",
    right: 0,
    bottom: 30,
    padding: 5,
  },
});

export default MyRecipeList;