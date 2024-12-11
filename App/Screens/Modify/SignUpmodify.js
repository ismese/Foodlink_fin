import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native";
import { styles } from "../Modify/SignUpmodify.style";
import NavigateBefore from "../../components/NavigateBefore";
import { auth, firestore1 } from "../../../firebase"; // firestore1으로 명확하게 import
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore 메서드 추가

const SignUpmodify = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    nickname: "",
    phone: "",
    birthdate: { year: "", month: "", day: "" }, // 초기값 설정
    newPassword: "",  // 새로운 비밀번호 추가
    confirmPassword: ""  // 비밀번호 확인 추가
  });

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(firestore1, "users", user.uid); // Firestore 문서 참조
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserInfo({
              email: user.email,
              nickname: data.nickname || "",
              phone: data.phone || "",
              birthdate: data.birthdate || { year: "", month: "", day: "" },
              newPassword: "",
              confirmPassword: ""
            });
          }
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 실패: ", error);
      }
    };

    fetchUserInfo();
  }, []);

  // 사용자 정보 업데이트
  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      // 🔹 비밀번호 변경 로직
      if (userInfo.newPassword) {
        if (userInfo.newPassword !== userInfo.confirmPassword) {
          Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
          return;
        }

        try {
          await user.updatePassword(userInfo.newPassword);
          console.log("비밀번호가 성공적으로 수정되었습니다.");
          
          await user.reload();
          await auth.signOut();
          Alert.alert("알림", "비밀번호가 변경되었습니다. 다시 로그인 해주세요.");
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }], // 로그인 화면으로 리셋
          });
          return; // 비밀번호 변경 후 바로 리턴
        } catch (error) {
          console.error("비밀번호 수정 실패: ", error);
          Alert.alert("오류", "비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
          return;
        }
      }

      // 🔹 Firestore에 사용자 정보 업데이트 (기존 latitude, longitude 유지)
      const docRef = doc(firestore1, "users", user.uid);
      await updateDoc(docRef, {
        nickname: userInfo.nickname,
        phone: userInfo.phone,
        birthdate: userInfo.birthdate
      });

      Alert.alert("알림", "정보가 성공적으로 수정되었습니다.");
      console.log("정보가 성공적으로 수정되었습니다.");
      navigation.pop();  // goBack 대신 pop을 사용하여 이전 화면으로 돌아가기

    } catch (error) {
      console.error("정보 수정 실패: ", error);
      Alert.alert("오류", "정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.pop()}  // pop을 사용하여 이전 화면으로 이동
            style={{ position: "absolute", top: 20, left: 25, zIndex: 10 }}
          >
            <NavigateBefore />
          </TouchableOpacity>
          <Text style={styles.headerText}>정보 수정하기</Text>
          <View style={styles.rectangle} />
        </View>

        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.label}>아이디*</Text>
          <TextInput style={styles.inputBox} value={userInfo.email} editable={false} />

          <Text style={styles.label}>비밀번호*</Text>
          <TextInput
            style={styles.inputBox}
            value={userInfo.newPassword}
            onChangeText={(text) => setUserInfo({ ...userInfo, newPassword: text })}
            secureTextEntry
          />

          <Text style={styles.label}>비밀번호 확인*</Text>
          <TextInput
            style={styles.inputBox}
            value={userInfo.confirmPassword}
            onChangeText={(text) => setUserInfo({ ...userInfo, confirmPassword: text })}
            secureTextEntry
          />

          <Text style={styles.label}>닉네임*</Text>
          <TextInput
            style={styles.inputBox}
            value={userInfo.nickname}
            onChangeText={(text) => setUserInfo({ ...userInfo, nickname: text })}
          />

          <Text style={styles.label}>휴대폰*</Text>
          <TextInput
            style={styles.inputBox}
            value={userInfo.phone}
            onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
          />

          <Text style={styles.label}>생년월일</Text>
          <View style={styles.dropdownContainer}>
            <TextInput
              style={styles.dropdownItem}
              value={userInfo.birthdate.year}
              onChangeText={(text) => setUserInfo({ ...userInfo, birthdate: { ...userInfo.birthdate, year: text } })}
            />
            <TextInput
              style={styles.dropdownItem}
              value={userInfo.birthdate.month}
              onChangeText={(text) => setUserInfo({ ...userInfo, birthdate: { ...userInfo.birthdate, month: text } })}
            />
            <TextInput
              style={styles.dropdownItem}
              value={userInfo.birthdate.day}
              onChangeText={(text) => setUserInfo({ ...userInfo, birthdate: { ...userInfo.birthdate, day: text } })}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.buttonContainer} onPress={handleUpdate}>
            <Text style={styles.buttonText}>수정하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpmodify;
