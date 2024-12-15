import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { firestore2 } from "../../../../firebase"; // Firestore 연결
import { styles } from "../../../styles/RecipeCommunity/ModifyCmPost.style";
import NavigateBefore from "../../../components/NavigateBefore";

const ModifyCmPost = ({ navigation, route }) => {
  const { post } = route.params; // 전달받은 게시물 데이터
  const [title, setTitle] = useState(post.title || ""); // 제목 상태
  const [content, setContent] = useState(post.content || ""); // 내용 상태

  const handleSave = async () => {
    try {
      // Firestore의 문서 참조 생성
      const postRef = doc(firestore2, "community", post.id); // 문서 ID 사용
      
      // Firestore 문서 업데이트
      await updateDoc(postRef, {
        title,       // 업데이트된 제목
        content,     // 업데이트된 내용
        updatedAt: new Date(), // 수정된 시간 기록
      });

      alert("게시물이 성공적으로 수정되었습니다.");
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      console.error("게시물 수정 중 오류 발생: ", error);
      alert("게시물 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <NavigateBefore onPress={() => navigation.goBack()} />
            <Text style={styles.title}>게시물 수정</Text>
            <View style={styles.emptySpace} />
          </View>

          {/* 수정 제목 섹션 */}
          <View style={styles.inputSection}>
            <Text style={styles.labelText}>제목을 작성해주세요.</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="제목을 입력하세요"
              value={title}
              onChangeText={setTitle}
              returnKeyType="done"
            />
          </View>

          {/* 수정 글 섹션 */}
          <View style={styles.inputSection}>
            <Text style={styles.labelText}>글을 작성해주세요.</Text>
            <TextInput
              style={styles.textArea}
              placeholder="사기 등 위법행위에 대한 작성은 Food Link 이용을 제재 당할 수 있습니다."
              multiline
              value={content}
              onChangeText={setContent}
              returnKeyType="done"
            />
          </View>

          {/* 저장하기 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
              <Text style={styles.submitButtonText}>저장하기</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ModifyCmPost;
