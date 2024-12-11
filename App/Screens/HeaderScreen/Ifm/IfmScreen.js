import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert, SafeAreaView } from "react-native";
import { styles } from "../Ifm/Ifm.Style";
import { MaterialIcons } from "@expo/vector-icons";
import NavigateBefore from "../../../components/NavigateBefore";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { getFirestore, doc, deleteDoc, onSnapshot } from "firebase/firestore";

const IfmScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0); // Firestore에서 가져온 평균 별점
  const [nickname, setNickname] = useState(""); // 사용자 닉네임 상태
  const [co2Reduction, setCo2Reduction] = useState(0); // 절감된 CO2 상태

  const auth = getAuth(); // Firebase 인증 초기화
  const db = getFirestore(); // Firestore 초기화

  // 사용자 정보 실시간 구독
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    // Firestore에서 사용자 데이터 구독
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeUser = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setNickname(userData.nickname || "사용자");
          setRating(userData.averageRating || 0); // 평균 별점
          setCo2Reduction(userData.carbonFootprint || 0); // 탄소 배출 절감량
        }
      },
      (error) => {
        console.error("사용자 데이터 구독 중 오류:", error);
        Alert.alert("오류", "사용자 데이터를 가져오는 중 문제가 발생했습니다.");
      }
    );

    // 컴포넌트가 언마운트될 때 구독 해제
    return () => {
      unsubscribeUser();
    };
  }, [auth, db]);

  const handleInquiry = () => {
    Alert.alert(
      "관리자 문의",
      "kimjin11444@gmail.com로 문의바랍니다.",
      [{ text: "확인", style: "cancel" }],
      { cancelable: true }
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "로그아웃",
      "로그아웃 하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "로그아웃",
          onPress: () => {
            console.log("로그아웃 완료");
            navigation.navigate("LoginScreen");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = () => {
    Alert.prompt(
      "탈퇴하기",
      "비밀번호를 입력하세요.",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "확인",
          onPress: async (password) => {
            if (!password) {
              Alert.alert("오류", "비밀번호를 입력해주세요.");
              return;
            }

            const user = auth.currentUser;

            if (!user) {
              Alert.alert("오류", "로그인된 사용자가 없습니다.");
              return;
            }

            if (!user.email) {
              Alert.alert("오류", "사용자 이메일 정보를 가져올 수 없습니다.");
              return;
            }

            // 비밀번호 재인증
            const credential = EmailAuthProvider.credential(user.email, password);

            try {
              await reauthenticateWithCredential(user, credential);
              console.log("재인증 성공");

              // Firestore 사용자 데이터 삭제
              const userDocRef = doc(db, "users", user.uid);
              await deleteDoc(userDocRef);
              console.log("Firestore 사용자 데이터 삭제 성공");

              // Firebase Auth 사용자 삭제
              await deleteUser(user);
              console.log("Firebase Auth 사용자 삭제 성공");

              Alert.alert("탈퇴 완료", "계정이 성공적으로 삭제되었습니다.");
            } catch (error) {
              console.error("계정 삭제 중 오류:", error);
              if (error.code === "auth/wrong-password") {
                Alert.alert("오류", "비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
              } else if (error.code === "auth/invalid-credential") {
                Alert.alert("오류", "유효하지 않은 자격 증명입니다. 다시 로그인 후 시도해주세요.");
              } else {
                Alert.alert("오류", "계정 삭제 중 문제가 발생했습니다.");
              }
            }
          },
        },
      ],
      "secure-text" // 비밀번호 입력을 위한 secure 텍스트
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.navigateContainer}>
            <NavigateBefore onPress={() => navigation.goBack()} />
          </TouchableOpacity>
          <Text style={styles.headerText}>내 정보</Text>
        </View>

        <View style={styles.profileCard}>
          <Image source={require("../../../../start-expo/assets/avatar.png")} style={styles.profileImage} />
          <Text style={styles.profileText}>
            <Text style={styles.highlightText}>{nickname || "사용자"}</Text>
            <Text>의 나눔으로{"\n"} {co2Reduction.toFixed(0)}g의 CO</Text>
            <Text style={styles.smallText}>2</Text>
            <Text> 배출을 절감했습니다.</Text>
          </Text>
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((value) => (
                <MaterialIcons
                  key={value}
                  name={value <= rating ? "star" : "star-border"}
                  size={30}
                  color="#FFD700"
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.options}>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate("SignUpmodify")}>
            <Text style={styles.optionText}>· 계정 / 정보 수정하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate("Locationmodify")}>
            <Text style={styles.optionText}>· 동네 변경하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={handleInquiry}>
            <Text style={styles.optionText}>· 관리자에게 문의하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
            <Text style={styles.optionText}>· 로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={handleDeleteAccount}>
            <Text style={styles.optionText}>· 탈퇴하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Team Project. Food Link{"\n"}Fiqma
          </Text>
          <Text style={styles.creditsText}>© 차나핑, 김세은, 김진영, 박준우, 안성수</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IfmScreen;
