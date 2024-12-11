import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    height: '70%', // 높이를 화면의 70%로 줄임
    borderRadius: 10,
    margin: 16,
  },
  customMarker: {
    alignItems: 'center',
  },
  pinContainer: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  pinTail: {
    width: 10,
    height: 10,
    transform: [{ rotate: '45deg' }],
    marginTop: -5,
  },
  markerIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  errorText: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,0,0,0.7)',
    color: 'white',
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSheet: {
	position: "absolute",
	bottom: 0,
	left: 0,
	right: 0,
	backgroundColor: "#fff",
	padding: 16,
	borderTopLeftRadius: 16,
	borderTopRightRadius: 16,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: -2 },
	shadowOpacity: 0.1,
	shadowRadius: 4,
	elevation: 5,
  },
  postImage: {
	width: "100%",
	height: 150,
	borderRadius: 8,
	marginBottom: 8,
  },
  postTitle: {
	fontSize: 18,
	fontWeight: "bold",
	color: "#333",
	marginBottom: 4,
  },
  postDescription: {
	fontSize: 14,
	color: "#666",
  },
  
});
