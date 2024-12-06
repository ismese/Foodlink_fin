import { StyleSheet } from 'react-native';

const chatStyles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "white",
  },
  
  chatList: {
    padding: 10,
  },
  
  chatItem: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatDetails: {
    flexDirection: 'ro',
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D754E',
  },
  chatLastMessage: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
  },
  chatLastMessageTime: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default chatStyles;
