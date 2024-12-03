import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, SafeAreaView } from "react-native";
import { styles } from "../Modify/Locationmodify.style";
import MapScreen from "../../components/mapContainer";
import NavigateBefore from "../../components/NavigateBefore";
import NavigateAfter from "../../components/NavigateAfter";

const Locationmodify = ({ navigation }) => {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [difficultyModalVisible, setDifficultyModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity 
        style={styles.navigateContainer}
        onPress={() => navigation.navigate("IfmScreen")} 
      >
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
          onPress={() => navigation.navigate("IfmScreen")}
        >
          <Text style={styles.buttonText}>변경하기</Text>
        </TouchableOpacity>

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

export default Locationmodify;
