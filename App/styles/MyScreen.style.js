import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 10,
    },
    safeArea: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    profileCard: {
      marginVertical: 20,
      padding: 20,
      backgroundColor: "#fff",
      borderRadius: 10,
      alignItems: "center",
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    profileText: {
      textAlign: "center",
      fontSize: 17,
      fontFamily: "Inter-Bold",
      fontWeight: "600",
      color: "rgba(0, 0, 0, 0.8)",
      marginBottom: 14,
    },
    highlightText: {
      color: "#2D754E",
      fontSize: 18,
      fontFamily: "Inter-Bold",
      fontWeight: "600",
      lineHeight: 20,
    },
    smallText: {
      fontSize: 10,
      color: "rgba(0, 0, 0, 0.8)",
    },
    ratingContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    stars: {
      flexDirection: "row",
      marginHorizontal: 10, 
    },
    separator: {
      height: 1,
      backgroundColor: "#F5F5F5",
      marginVertical: 5,
      alignSelf: "stretch",
      marginHorizontal: 10,
    },
    gridContainer: {
      marginVertical: 10,
      marginHorizontal: 0,
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 8,       //내 핸드폰 기준 1, 진영 8
      justifyContent: "flex-start",
    },
    gridItem: {
      width: 115,
      height: 115,
      backgroundColor: "#FFFFFF",
      borderRadius: 5,
      margin: 2,
      justifyContent: "center",
      alignItems: "center",
    },  
    gridImage: {
      width: "100%", // 부모 크기에 맞춤
      height: "100%", // 부모 크기에 맞춤
      borderRadius: 5,
      marginBottom: 5,
      resizeMode: "cover",
    },
    gridText: {
      color: "#555",
      fontSize: 14,
      fontFamily: "Inter",
      textAlign: "center",
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
      width: "100%", 
      paddingHorizontal: 20,
    },
    actionButton: {
      backgroundColor: "#F5F5F5",
      padding: 10,
      borderRadius: 15, 
      justifyContent: "center",
      alignItems: "center",
    },
    actionButtonIcon: {
      fontSize: 24,
      color: "#2D754E", 
    },
  
  });
  