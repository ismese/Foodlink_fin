
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff", // 전체 배경을 흰색으로 설정
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 24,
  },
  
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
  searchArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  selectedCategoriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  selectedItemTouchable: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  selectedItem: {
    color: "#fff",
    fontSize: 14,
  },
  postContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  imageContainer: {
    width: 127,
    height: 109,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  imagePlaceholder: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: "#D9D9D9",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    backgroundColor: "#B1F47F",
    borderRadius: 3,
    marginRight: 5,
  },
  title: {
    flex: 1,
    color: "#521212",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  infoText: {
    color: "#8C8C8C",
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 16,
  },
  infoSeparator: {
    color: "#8C8C8C",
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 16,
  },
  price: {
    color: "#2D754E",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    color: "#8C8C8C",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  emptyListContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 20, 
  },
  
});

