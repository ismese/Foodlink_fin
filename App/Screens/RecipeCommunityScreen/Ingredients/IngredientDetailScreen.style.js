import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-bold',
    color: '#2E2F33',
  },
  emptySpace: {
    width: 24,
  },
  ingredientDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  image: {
    width: 120,
    height: 120, 
    borderRadius: 5,
  },
  infoContainer: {
    flex:1,
    marginLeft: 15,
  },
  expirationContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  flexOne: {
    flex: 1,
  },
  expirationLabel: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: '700',
    lineHeight: 20,
  },
  expirationDate: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryText: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 20,
  },
  itemName: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: '700',
    lineHeight: 20,
  },
  
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  detailContainer: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  toggleButton: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#2D754E",
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  ingredientsScroll: {
    marginVertical: 10,
  },
  ingredientButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  ingredientSelected: {
    backgroundColor: "#2D754E",
  },
  ingredientText: {
    color: "#000",
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  recipeDetails: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "500",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#888",
  },
  separator: {
    marginVertical: 15,
    marginLeft: 30,
    alignItems: "flex-start",
  },
  separatorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  userMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F2F3F6",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 15,
    borderRadius: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F3F6",
    borderRadius: 20,
    marginRight: 10,
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userMessage: {
    flex: 1,
  },
  userName: {
    color: "#2D754E",
    fontSize: 15,
    fontWeight: "600",
  },
  message: {
    color: "black",
    fontSize: 13,
    fontWeight: "600",
  },
  ingredientName: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
  },
  
  buttonContainer: {
    paddingTop: 15,
    backgroundColor: "#FFFFFF",
  },
  submitButton: {
    alignSelf: "center", // 화면 중앙에 배치
    height: 35, // 버튼 높이
    width: 160, // 버튼 너비
    backgroundColor: "#2D754E", // 버튼 배경색
    justifyContent: "center", // 텍스트 세로 정렬
    alignItems: "center", // 텍스트 가로 정렬
    borderRadius: 10, // 버튼 모서리 둥글기
    marginVertical: 5, // 위아래 여백
  },
  submitButtonText: {
    color: "#FFFFFF", // 텍스트 색상
    fontSize: 16, // 텍스트 크기
    fontWeight: "600", // 텍스트 두께
  },
  
});

export default styles;