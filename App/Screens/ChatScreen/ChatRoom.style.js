import { StyleSheet } from 'react-native';

const chatRoomStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
  },
  // 상단 헤더 스타일
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  chatTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Inter-bold',
    color: 'black',
  },
  // 메시지 리스트
  messageContainer: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 10,
    maxWidth: '70%',
    marginHorizontal: 10, // 양쪽 여백 추가
  },
  selfMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2D754E',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderColor: '#2D754E',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    color: 'white',
  },
  otherMessageText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  // 입력창
  inputWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sendButton: {
    borderRadius: 25,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  dateDisplay: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dateText: {
    fontSize: 14,
    color: '#2D754E',
    fontWeight: 'bold',
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
 modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
  width: '70%',
},
modalTitle: {
  fontSize: 15,
  fontWeight: 'bold',
  marginBottom: 15,
},
stars: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '80%',
  marginBottom: 20,
},
starContainer: {
  padding: 5,
},
confirmButton: {
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 5,
  borderWidth: 1,      // 테두리 두께 설정
  borderColor: '#2D754E', // 테두리 색상 설정
},
confirmButtonText: {
  color: '#2D754E',
  fontSize: 13,
  fontWeight: 'bold',
},
closeButton: {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 10,
},

});

export default chatRoomStyles;
