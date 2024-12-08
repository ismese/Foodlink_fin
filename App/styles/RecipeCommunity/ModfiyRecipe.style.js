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
    paddingVertical:15,
    marginTop: 5,
    marginBottom:20,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 15,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  
  removeImageText: {
    color: "white",
    fontSize: 12,
  },
  placeholderText: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  
  addImageBox: {
    width: 40,
    height: 40,
    marginTop: 19,
    borderRadius: 10,
    backgroundColor: "#F2F3F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    marginTop:5,
  },
  addImageText: {
    fontSize: 25,
    color: "gray",
    fontWeight: "400",
  },
  recipeImagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3, // 이미지 사이 간격
  },  
  recipeImages: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  recipeImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F2F3F6", // 기본 회색 배경
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  inputSection: {
    marginTop: 10,
    paddingHorizontal:20,
  },
  // @@을 작성해주세요.
  labelText: {
    fontSize: 16,
    fontFamily: "Inter-bold",
    color: "#2E2F33",
    marginBottom: 8,
  },
  //제목, 재료 작성란
  inputBox: {
    height: 40,
    backgroundColor: "#F2F3F6",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  //조리 순서 작성란
  textArea: {
    height: 230,
    backgroundColor: "#F2F3F6",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
    textAlignVertical: "top",
    marginBottom: 65,
  },
  buttonContainer: {
    paddingTop: 15,
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
});