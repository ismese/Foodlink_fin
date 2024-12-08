import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { app2 } from "../../../../firebase"; // 본인 Firebase Firestore 초기화

const RecipeList = () => {
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
    Alert.alert(
      "삭제 확인",
      "정말로 이 레시피를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
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
          },
        },
      ],
      { cancelable: true }
    );
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
      data={recipes}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
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
              <Text style={styles.recipeAuthor}>작성자: {item.nickname || "작성자 없음"}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("ModifyRecipe", { recipe: item })}
            >
              <Text style={styles.editButtonText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteRecipe(item.id)}
            >
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  recipeCard: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
  },
  recipeImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F2F3F6",
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
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    borderRadius: 5,
    flex: 0.48,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    paddingVertical: 8,
    borderRadius: 5,
    flex: 0.48,
  },
  editButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
});

export default RecipeList;