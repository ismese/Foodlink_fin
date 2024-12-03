import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E2F33",
  },
  emptySpace: {
    width: 24, 
  },
  profileCard: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  profileText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 14,
  },
  highlightText: {
    color: "#2D754E",
    fontSize: 18,
    fontWeight: "bold",
  },
  cameraButton: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  gridItem: {
    width: 120, 
    height: 120, 
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "transparent", 
    borderWidth: 0, 
  },
  gridImage: {
    width: "100%", 
    height: "100%",
    resizeMode: "cover",
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#767676",
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIconText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyGridItem: {
    width: 120, 
    height: 120,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "transparent", 
  },
});

export default styles;
