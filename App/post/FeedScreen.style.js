import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 16,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 16,
  },
  backText: {
    fontSize: 22,
    color: "Black",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  titleSection: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderColor: "#EAEAEA",
    borderRadius: 8,
  },
  titleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryDot: {
    width: 6,
    height: 6,
    backgroundColor: "#FFD700",
    borderRadius: 3,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: 14,
    color: "#777",
  },
  timeAgo: {
    fontSize: 14,
    color: "#777",
  },
  descriptionSection: {
    padding: 15,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 8,
    height: 250,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 8,
  },

  favoriteButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  priceLabel: {
    fontSize: 16,
    color: "#555",
    marginRight: 10, // 가격과 텍스트 사이의 간격
    fontWeight: "bold"
  },
  
  favoriteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#EAEAEA",
    backgroundColor: "#F9F9F9",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteButton: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  favoriteIcon: {
    fontSize: 18,
    color: "#4CAF50",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  chatButton: {
    backgroundColor: "#2D754E",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  chatButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  ownerInfo: {
  paddingHorizontal: 16,
  paddingVertical: 10,
  backgroundColor: "white",
  borderRadius: 8,
  marginHorizontal: 16,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: "#E0E0E0",
},
ownerText: {
  fontSize: 16,
  color: "#333",
  fontWeight: "bold",
  marginBottom: 4,
},
expirationText: {
  fontSize: 14,
  color: "#777",
},
categoryText: {
  fontSize: 14,
  color: "#555",
  marginTop: 4,
},

});

export default styles;
