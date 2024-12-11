import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9E9",
    backgroundColor: "white",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // 제목과 점 세 개 버튼을 양쪽 끝으로 배치
    alignItems: "center",
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter-bold",
    color: "black",
  },
  optionsButton: {
    padding: 5, // 클릭 영역 확보
  },
  content: {
    fontSize: 14,
    color: "#8C8C8C",
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  infoText: {
    fontSize: 12,
    color: "#8C8C8C",
  },
  infoSeparator: {
    fontSize: 12,
    color: "#8C8C8C",
    marginHorizontal: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  actionText: {
    
    fontSize: 12,
    color: "#8C8C8C",
    marginLeft: 4,
  },
});