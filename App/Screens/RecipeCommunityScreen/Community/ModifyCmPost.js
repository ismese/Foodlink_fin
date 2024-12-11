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
import { styles } from "../../../styles/RecipeCommunity/ModifyCmPost.style";
import NavigateBefore from "../../../components/NavigateBefore"; // NavigateBefore 컴포넌트

const ModifyCmPost = ({ navigation, route }) => {
  const { post } = route.params; // 전달받은 게시물 데이터
  const [title, setTitle] = useState(post.title || ""); // 전달받은 게시물의 제목으로 초기화
  const [content, setContent] = useState(post.content || ""); // 전달받은 게시물의 내용으로 초기화

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
              value={title} // 입력 필드에 전달받은 제목 표시
              onChangeText={setTitle} // 입력 필드 변경 시 상태 업데이트
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
              value={content} // 입력 필드에 전달받은 내용 표시
              onChangeText={setContent} // 입력 필드 변경 시 상태 업데이트
              returnKeyType="done"
            />
          </View>

          {/* 저장하기 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.submitButtonText}>저장하기</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ModifyCmPost;