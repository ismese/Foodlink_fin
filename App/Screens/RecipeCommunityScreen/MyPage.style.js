import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  postContainer: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  
  myIngredientsSection: {
    padding: 15,
    borderBottomWidth: 6,
    borderBottomColor: "#F2F3F6",
  },
  myIngredientsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    color: "#2E2F33",
    fontSize: 18,
    fontWeight: "700",
  },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreText: {
    color: "#8C8C8C",
    fontSize: 13,
    fontWeight: "600",
  },
  ingredientsListContainer: {
    flexDirection: "row",
  },
  addImageButton: {
    width: 48,
    height: 48,
    marginTop: 19,
    borderRadius: 10,
    backgroundColor: "#F2F3F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    borderWidth: 1,
    borderColor: "#F2F3F6",
  },
  addImageText: {
    fontSize: 30,
    color: "gray",
    fontWeight: "300",
  },
  boardSection: {
    flex: 1,
    padding: 15,
  },
  boardHeader: {
    flexDirection: "row", // 텍스트와 버튼을 가로로 배치
    alignItems: "center", // Y축 중앙 정렬
    justifyContent: "space-between", // 양쪽 끝으로 배치
    marginBottom: 10,
  },
  addPostButton: {
    backgroundColor: "FFFFFF", // 버튼 색상
    width: 30, // 버튼 너비
    height: 30, // 버튼 높이
    borderRadius: 10, // 동그란 버튼
    justifyContent: "center",
    alignItems: "center",
  },
  addPostButtonText: {
    color: "#2D754E", // 버튼 텍스트 색상
    fontSize: 30, // 텍스트 크기
    fontFamily: "Inter-regular",
  },
  boardTabs: {
    flexDirection: "row",
    marginBottom: 15,
  },
  tabActive: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#F2F3F6",
    paddingVertical: 10,
  },
  tabActiveText: {
    color: "#2D754E",
    fontSize: 14,
    fontWeight: "700",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    paddingVertical: 10,
  },
  tabText: {
    color: "#868B94",
    fontSize: 14,
    fontWeight: "700",
  },
  recipeListContainer: {
    flex: 1, // RecipeList 영역을 확장하고 스크롤 가능하게 설정
  },
  communityContent: {
    padding: 20,
    alignItems: "center",
  },
  communityText: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
  },
  ingredientImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
});