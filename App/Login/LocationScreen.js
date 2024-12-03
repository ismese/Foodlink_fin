import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, SafeAreaView, Alert } from "react-native";
import { styles } from "../styles/LocationScreen.style";
import MapScreen from "../components/mapContainer";
import NavigateBefore from "../components/NavigateBefore";
import NavigateAfter from "../components/NavigateAfter";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Location from "expo-location";  // Expo Location API 사용

const db = getFirestore();
const auth = getAuth();

const LocationScreen = ({ navigation }) => {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [difficultyModalVisible, setDifficultyModalVisible] = useState(false);

  // 위치 정보를 Firebase Firestore에 저장하는 함수
  const saveLocation = async (latitude, longitude) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Firestore의 users 컬렉션에서 현재 사용자 문서에 위치 정보 업데이트
        const userRef = doc(db, "users", user.uid); // 로그인된 사용자의 문서 참조
        await updateDoc(userRef, {
          latitude: latitude,
          longitude: longitude,
        });
        // 위치 저장 성공 후 Alert 띄우고 OK 누르면 NewHomeScreen으로 이동
        Alert.alert(
          "위치 저장 성공", 
          "위치 정보가 성공적으로 저장되었습니다.", 
          [
            { text: "OK", onPress: () => navigation.navigate("NewHomeScreen") } // "NewHomeScreen"으로 이동
          ]
        );
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("위치 저장 실패", "위치 정보 저장에 실패했습니다.");
    }
  };

  // 위치 정보를 가져오는 함수
  const getLocation = async () => {
    try {
      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("위치 권한", "위치 권한을 허용해야 위치 정보를 가져올 수 있습니다.");
        return;
      }

      // 현재 위치를 가져옴
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      console.log("현재 위치:", latitude, longitude);
      saveLocation(latitude, longitude);  // 위치 정보 저장 함수 호출
    } catch (error) {
      console.error(error);
      Alert.alert("위치 가져오기 실패", "위치 정보를 가져오는 데 실패했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
  
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <NavigateBefore />
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>거주 지역</Text>
          <Text>
            <Text style={styles.location}>아산시 탕정면</Text>
            <Text style={styles.subtitle}> 지역을 인증해주세요.</Text>
          </Text>
        </View>

        <View style={styles.mapContainer}>
          <MapScreen />
        </View>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>왜 지역을 인증할까요?</Text>
            <NavigateAfter onPress={() => setInfoModalVisible(true)} />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>인증에 어려움이 있으신가요?</Text>
            <NavigateAfter onPress={() => setDifficultyModalVisible(true)} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            getLocation(); // 위치 인증 버튼 클릭 시 위치 정보를 가져오고 저장
          }}
        >
          <Text style={styles.buttonText}>위치 인증하기</Text>
        </TouchableOpacity>

        {/* 정보 모달 */}
        <Modal
          visible={infoModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setInfoModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>왜 지역을 인증할까요?</Text>
              <Text style={styles.modalContent}>
                위치 데이터 수집 및 처리{"\n"}
                애플리케이션은 사용자의 GPS 데이터를 추출하여 거주지역을 확인합니다. 해당 데이터는 등록된 지역 내 서비스를 적절히 제공할 수 있도록 활용됩니다.{"\n\n"}
                데이터 사용 제한{"\n"}
                수집된 개인정보는 서비스 제공을 위한 목적으로만 처리되며, 제3자와 공유되지 않습니다. 모든 데이터는 개인정보 보호 정책에 따라 관리되며, 사용자의 서비스 범위 내에서만 제공됩니다.
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setInfoModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 어려움 모달 */}
        <Modal
          visible={difficultyModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setDifficultyModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>인증에 어려움이 있으신가요?</Text>
              <Text style={styles.modalContent}>
                위치 서비스 활성화{"\n"}
                - 위치 정보가 활성화된 경우, 먼저 기기의 GPS 기능이 활성화되었는지 확인해주세요.{"\n"}
                - iOS 및 Android의 위치 설정에서 애플리케이션이 정확한 위치 정보를 사용할 수 있도록 권한 설정을 확인하세요.{"\n\n"}
                네트워크 연결 확인{"\n"}
                - 인증 절차를 위해 인터넷 연결이 필요합니다. Wi-Fi 또는 모바일 데이터를 사용하여 연결된 상태를 확인한 후 다시 시도해주세요.
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setDifficultyModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default LocationScreen;
