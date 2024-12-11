import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#ffffff", // 배경색 설정
      },
    container: {
        alignItems: "center",
        flexDirection: "column",
        flex: 1,
        backgroundColor: "#ffffff",
    },
    header: {
        alignItems: "center",
        marginTop: 80,
    },
    title: {
        fontSize: 40,
        fontWeight: "700",
        color: "#000000",
        textAlign: "center",
        position: "absolute",
        top: 70,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2d754e",
        textAlign: "center",
        textShadowColor: "#00000040",
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
        position: "absolute",
        top: 120,
    },
    avatarContainer: {
      height: 156,
      width: 157,
      backgroundColor: "#ffffff",
      borderRadius: 78,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      marginTop: 200, // 이미지 상단 여백
      alignItems: "center", // 이미지의 수평 정렬
      justifyContent: "center", // 이미지의 수직 정렬
  },
  
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: 78,
    },
    body: {
        flex: 1,
        alignItems: "center",
        justifyContent: "top",
        backgroundColor: "#ffffff",
        top:45,
        width: "100%",
    },
    inputContainer: {
        width: "80%",
        marginBottom: 10,
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#2d754e",
        borderRadius: 15,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    loginButton: {
        width: 307,
        height: 40,
        backgroundColor: "#2d754e",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 70,
        marginTop: 50, // 이미지 상단 여백
    },
    loginButtonText: {
        color: "#ffffff",
        fontWeight: "600",
        fontSize: 16,
    },
    
    signupButtonContainer: {
        position: "absolute", // 절대 위치로 설정
        bottom: 20, // 화면 아래에서 20px 위로 설정
        alignItems: "center", // 수평 정렬
        width: "100%", // 컨테이너가 화면의 너비를 가득 채우도록 설정
    },
    signupButtonText: {
        color: "#bfbfbf",
        fontSize: 13,
        fontWeight: "600",
    },
    
    // homeIndicator: {
    //     width: "100%",
    //     height: 10,
    //     backgroundColor: "#cccccc",
    //     position: "absolute",
    //     bottom: 0,
    // },
});
