import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, SafeAreaView } from "react-native";
import { styles } from "../Ifm/Ifm.Style";
import { MaterialIcons } from "@expo/vector-icons";
import NavigateBefore from "../../../components/NavigateBefore";

const IfmScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0); 

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
            // 비밀번호를 확인하는 로직을 추가할 수 있습니다.
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
            <Text style={styles.highlightText}>동길님</Text>
            <Text>의 나눔으로{"\n"} 500g의 CO</Text>
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
