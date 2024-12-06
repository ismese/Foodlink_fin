import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert, SafeAreaView } from "react-native";
import { styles } from "../Ifm/Ifm.Style";
import { MaterialIcons } from "@expo/vector-icons";
import NavigateBefore from "../../../components/NavigateBefore";
import { getAuth } from "firebase/auth"; // Firebase Auth
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"; // Firestore 관련 함수 추가

const IfmScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0); 
  const [nickname, setNickname] = useState("");  // 사용자 닉네임 상태
  const [co2Reduction, setCo2Reduction] = useState(0);  // 절감된 CO2 상태

  // Firebase Auth와 Firestore를 사용하기 위한 초기화
  const auth = getAuth();
  const db = getFirestore();

  // 사용자 정보 및 탄소 배출 절감량 가져오는 함수
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        // Firestore에서 사용자 닉네임 가져오기
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname || "사용자");
        }

        // 거래 데이터에서 CO2 절감량 합산하기
        const transactionsRef = collection(db, "transactions");
        const q = query(transactionsRef, where("userId", "==", user.uid)); // 사용자 ID로 거래 데이터 조회
        const querySnapshot = await getDocs(q);
        
        let totalCo2 = 0;
        querySnapshot.forEach((doc) => {
          totalCo2 += doc.data().CO2_reduction || 0;  // 각 거래의 CO2 절감량 합산
        });
        setCo2Reduction(totalCo2);  // 총 CO2 절감량 업데이트
      }
    };

    fetchUserData();
  }, [auth, db]);

  const handleRating = (value) => {
    setRating(value); 
  };

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
    let password = ""; // 비밀번호를 저장할 변수
  
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
          onPress: (input) => {
            password = input; // 입력된 비밀번호를 저장
            if (password === "") {
              Alert.alert("오류", "비밀번호를 입력해주세요.");
              return;
            }
            console.log("계정 탈퇴 완료. 입력된 비밀번호:", password);
            navigation.navigate("LoginScreen");
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
          <TouchableOpacity 
            style={styles.navigateContainer}
          >
            <NavigateBefore onPress={() => navigation.goBack()} />
          </TouchableOpacity>
          <Text style={styles.headerText}>내 정보</Text>
        </View>

        <View style={styles.profileCard}>
          <Image source={require("../../../../start-expo/assets/avatar.png")} style={styles.profileImage} />
          <Text style={styles.profileText}>
            <Text style={styles.highlightText}>{nickname || "동길님"}</Text>
            <Text>의 나눔으로{"\n"} {co2Reduction.toFixed(2)}g의 CO</Text>
            <Text style={styles.smallText}>2</Text>
            <Text> 배출을 절감했습니다.</Text>
          </Text>
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity key={value} onPress={() => handleRating(value)}>
                  <MaterialIcons
                    name={value <= rating ? "star" : "star-border"}
                    size={30}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.options}>
          <TouchableOpacity 
            style={styles.optionItem} 
            onPress={() => navigation.navigate("SignUpmodify")}
          >
            <Text style={styles.optionText}>· 계정 / 정보 수정하기</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.optionItem} 
            onPress={() => navigation.navigate("Locationmodify")}
          >
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
