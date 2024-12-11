import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
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
    fontWeight: "700",
  },
  emptySpace: {
    width: 30,
  },
  Postcontainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  postImage: {
    width: 360,
    height: 250,
    borderRadius: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  
  profileContainer: {
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 15,
    marginHorizontal: 5,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 10, 
  },
  separator: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginVertical: 0,
    alignSelf: "stretch",
    marginHorizontal: 10,
  },
  
  textContainer: {
    flexDirection: "column", 
  },
  nameText: {
    color: "#2E2F33",
    fontSize: 18,
    fontFamily: "Inter-bold",
  },

  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ownerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  ownerTextWrapper: {
    flexDirection: "column",
  },
  ownerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E2F33",
  },
  locationText: {
    fontSize: 12,
    color: "#777777",
    marginTop: 4,
  },
  categoryInfo: {
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10,
  },
  categoryDot: {
    width: 8,
    height: 8,
    backgroundColor: "#FDFF8E", 
    borderRadius: 4,
    marginRight: 8,
  },
  Subtitle: {
    fontSize: 20,
    fontFamily: "Inter-bold",
    color: "#333333",
    textAlign: "left", 
  },
  descriptionSection: {
    height: "35%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    alignItems: "flex-start", 

  },
  description: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#2E2F33",
    lineHeight: 24,
    textAlign: "left", 
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#EAEAEA",
    backgroundColor: "#FFFFFF",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
    textAlign: "left", 
  },
  chatButton: {
    backgroundColor: "#2D754E",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  chatButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  expirationText: {
    textAlign: "left", 
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
  },
  expirationDate: {
    textAlign: "left", 
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
  },

  infoRow: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
  },
  categoryText: {
    fontSize: 13,
    color: "#777777",
  },
  timeAgo: {
    fontSize: 13,
    color: "#777777",
  },
  
});

export default styles;
