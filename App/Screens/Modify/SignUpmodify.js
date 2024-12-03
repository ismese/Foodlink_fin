import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { styles } from "../Modify/SignUpmodify.style";
import NavigateBefore from "../../components/NavigateBefore";
import { auth, firestore } from "../../../firebase"; // firebase.js에서 firestore와 auth import

const SignUpmodify = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    nickname: "",
    phone: "",
    birthdate: { year: "", month: "", day: "" }, // 초기값 설정
    newPassword: "",  // 새로운 비밀번호 추가
    confirmPassword: ""  // 비밀번호 확인 추가
  });

  useEffect(() => {
    const user = auth.currentUser; // 로그인한 사용자 정보 가져오기
    if (user) {
      // Firestore에서 사용자 정보 가져오기
      firestore.collection("users").doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setUserInfo({
            email: user.email,
            nickname: data.nickname,
            phone: data.phone,
            birthdate: data.birthdate || { year: "", month: "", day: "" }, // Firestore에서 받아온 데이터가 없을 경우 기본값 설정
            newPassword: "", // 비밀번호 초기화
            confirmPassword: "" // 비밀번호 확인 초기화
          });
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    const user = auth.currentUser;
    if (user) {
      // 비밀번호 수정
      if (userInfo.newPassword && userInfo.newPassword === userInfo.confirmPassword) {
        user.updatePassword(userInfo.newPassword).then(() => {
          console.log("비밀번호가 성공적으로 수정되었습니다.");
          
          // 비밀번호 변경 후 사용자 정보를 갱신 (세션 갱신)
          user.reload().then(() => {
            // 비밀번호가 갱신된 후 로그아웃 처리
            auth.signOut().then(() => {
              console.log("비밀번호가 변경되었습니다. 다시 로그인 해주세요.");
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              }); // 로그인 화면으로 이동
            }).catch((error) => {
              console.error("로그아웃 실패: ", error);
            });
          }).catch((error) => {
            console.error("세션 갱신 실패: ", error);
          });
          
        }).catch((error) => {
          console.error("비밀번호 수정 실패: ", error);
        });
      } else if (userInfo.newPassword !== userInfo.confirmPassword) {
        console.log("비밀번호가 일치하지 않습니다.");
        return;
      }

      // Firestore에서 데이터 덮어쓰기 (기존 데이터를 삭제하고 새로운 데이터로 업데이트)
      firestore.collection("users").doc(user.uid).set({
        nickname: userInfo.nickname,
        phone: userInfo.phone,
        birthdate: userInfo.birthdate
      }).then(() => {
        console.log("정보가 성공적으로 수정되었습니다.");
        navigation.goBack(); // 이전 화면으로 돌아가기
      }).catch((error) => {
        console.error("정보 수정 실패: ", error);
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              top: 20,
              left: 25, 
              zIndex: 10,
            }}
          >
            <NavigateBefore />
          </TouchableOpacity>
          <Text style={styles.headerText}>정보 수정하기</Text>
          <View style={styles.rectangle} />
        </View>

        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.label}>아이디*</Text>
          <TextInput
            style={styles.inputBox}
            value={userInfo.email}
            editable={false} // 아이디는 수정 불가능
            placeholder="6자 이상의 영문 혹은 영문과 숫자를 조합"
            placeholderTextColor="#c6c6c6"
          />

          <Text style={styles.label}>비밀번호*</Text>
          <TextInput
            style={styles.inputBox}
            value={userInfo.newPassword}
            onChangeText={(text) => setUserInfo({ ...userInfo, newPassword: text })}
            placeholder="8자 이상의 영문 혹은 영문과 숫자를 조합"
            placeholderTextColor="#c6c6c6"
            secureTextEntry
          />

          <Text style={styles.label}>비밀번호 확인*</Text>
          <TextInput
            style={styles.inputBox}
            value={userInfo.confirmPassword}
            onChangeText={(text) => setUserInfo({ ...userInfo, confirmPassword: text })}
            placeholder="비밀번호를 한 번 더 입력해주세요"
            placeholderTextColor="#c6c6c6"
            secureTextEntry
          />

          <Text style={styles.label}>닉네임*</Text>
          <TextInput
            style={styles.inputBox}
            value={userInfo.nickname}
            onChangeText={(text) => setUserInfo({ ...userInfo, nickname: text })}
            placeholder="2자 이상의 한글 혹은 한글과 숫자를 조합"
            placeholderTextColor="#c6c6c6"
          />

          <Text style={styles.label}>이메일*</Text>
          <TextInput
            style={styles.inputBox}
            value={userInfo.email}
            editable={false} // 이메일도 수정 불가능
            placeholder="예) sunmoon123@sunmoon.kr"
            placeholderTextColor="#c6c6c6"
            keyboardType="email-address"
          />

          <Text style={styles.label}>휴대폰*</Text>
          <TextInput
            style={styles.inputBox}
            value={userInfo.phone}
            onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
            placeholder="숫자만 입력해주세요"
            placeholderTextColor="#c6c6c6"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>생년월일</Text>
          <View style={styles.dropdownContainer}>
            <TextInput
              style={styles.dropdownItem}
              value={userInfo.birthdate.year}
              onChangeText={(text) => setUserInfo({ ...userInfo, birthdate: { ...userInfo.birthdate, year: text } })}
              placeholder="년도"
            />
            <TextInput
              style={styles.dropdownItem}
              value={userInfo.birthdate.month}
              onChangeText={(text) => setUserInfo({ ...userInfo, birthdate: { ...userInfo.birthdate, month: text } })}
              placeholder="월"
            />
            <TextInput
              style={styles.dropdownItem}
              value={userInfo.birthdate.day}
              onChangeText={(text) => setUserInfo({ ...userInfo, birthdate: { ...userInfo.birthdate, day: text } })}
              placeholder="일"
            />
          </View>
        </ScrollView>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleUpdate}
          >
            <Text style={styles.buttonText}>수정하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpmodify;