import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "../../../styles/RecipeCommunity/AddCmPost.style";
import NavigateBefore from "../../../components/NavigateBefore"; // NavigateBefore 컴포넌트
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app2 } from "../../../../firebase"; // Firebase 초기화

const AddCmPost = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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

  const handleAddPost = async () => {
    if (!title || !content) {
      Alert.alert("오류", "제목과 내용을 모두 작성해주세요.");
      return;
    }

    try {
      await addDoc(collection(db, "community"), {
        title,
        content,
        nickname, // 닉네임 추가
        createdAt: new Date().toISOString(),
      });
      Alert.alert("성공", "게시물이 성공적으로 추가되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.error("게시물 추가 중 오류:", error);
      Alert.alert("오류", "게시물 추가에 실패했습니다.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <NavigateBefore onPress={() => navigation.goBack()} />
            <Text style={styles.title}>커뮤니티 게시물 추가</Text>
            <View style={styles.emptySpace} />
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

          {/* 글 섹션 */}
          <View style={styles.inputSection}>
            <Text style={styles.labelText}>글을 작성해주세요.</Text>
            <TextInput
              style={styles.textArea}
              placeholder="사기 등 위법행위에 대한 작성은 Food Link 이용을 제재 당할 수 있습니다."
              multiline
              value={content}
              onChangeText={setContent}
            />
          </View>

          {/* 추가하기 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleAddPost}>
              <Text style={styles.submitButtonText}>추가하기</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddCmPost;