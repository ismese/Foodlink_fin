import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 24,
  },
  listContainer: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Inter-bold",
    color: '#333',
    marginBottom: 0,
    marginLeft: 11,
  },
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    width: '45%', 
    alignItems: "flex-start",
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginVertical: 0,
    alignSelf: "stretch",
    marginHorizontal: 10,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  
  separator: {
    borderWidth: 1, // 테두리를 사용하여 선을 만듭니다.
    borderColor: '#D9D9D9', // 선 색상
    borderStyle: "dotted", // 점선 스타일
    marginTop: 10, // 상단 여백
    marginHorizontal: 5,
  },
  
});

export default styles;
