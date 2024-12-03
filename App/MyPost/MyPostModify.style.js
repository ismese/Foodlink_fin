import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 50,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-bold",
    color: "#2E2F33",
  },
  emptySpace: {
    width: 30,
  },
  imageSection: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginTop: 5,
    marginBottom: 15,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 25,
    backgroundColor: "#FFFFFF",
  },
  authorImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginRight: 10,
  },
  authorTextContainer: {
    flexDirection: "column",
  },
  authorName: {
    marginBottom: 3,
    fontSize: 18,
    fontFamily: "Inter-bold",
    color: "#2D754E",
    letterSpacing: 0.32,
  },
  authorDescription: {
    fontSize: 16,
    fontFamily: "Inter-bold",
    color: "#2E2F33",
    letterSpacing: 0.1,
  },
  addImageBox: {
    width: 40,
    height: 40,
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: "#F2F3F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  addImageText: {
    fontSize: 25,
    color: "gray",
    fontWeight: "400",
  },
  foodImagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3, // 이미지 사이 간격
  },
  foodImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F2F3F6", // 기본 회색 배경
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    // flexDirection: "row",
    // justifyContent: "flex-start",
    // alignItems: "center",
  },
  inputSection: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
  labelText: {
    fontSize: 16,
    fontFamily: "Inter-bold",
    color: "#2E2F33",
    marginBottom: 8,
  },
  inputBox: {
    height: 40,
    backgroundColor: "#F2F3F6",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    backgroundColor: "#F2F3F6",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  buttonContainer: {
    paddingTop: 0,
    backgroundColor: "#FFFFFF",
  },
  submitButton: {
    alignSelf: "center", // 화면 기준 정중앙으로 배치
    height: 40,
    width: 307,
    backgroundColor: "#2D754E",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  // 카테고리 섹션
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: 1,
  },
  categoryIcon: {
    marginLeft: 0,
  },
  selectedCategoriesContainer: {
    flexDirection: "row",
    marginLeft: 10,
    alignItems: "center",
    maxHeight: 30,
  },
  selectedItemTouchable: {
    marginRight: 8,
  },
  selectedItem: {
    fontSize: 13,
    fontFamily: "Inter-bold",
    color: "#2D754E",
    backgroundColor: "#F5F5F5",
    padding: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  expirationDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  dateInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateInput: {
    width: 60,
    height: 40,
    marginHorizontal: 5,
    backgroundColor: "#F2F3F6",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
});
