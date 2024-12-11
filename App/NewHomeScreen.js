import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapScreen from '../App/MapScreen';
import MyScreen from './Screens/Myscreen/MyScreen';
import RecipeCommunityScreen from './Screens/RecipeCommunityScreen/Page';
import ChatScreen from './Screens/ChatScreen/ChatScreen';
import CustomHeader from './components/CustomHeader';
import BoardScreen from './Board/BoardScreen';

const Tab = createBottomTabNavigator();

const TAB_TITLES = {
  홈: '홈',
  커뮤니티: '커뮤니티',
  '동네 지도': '동네 지도',
  채팅: '채팅',
  '내 게시판': '내 게시판',
};

const ICONS = {
  홈: { focused: 'home', unfocused: 'home-outline' },
  커뮤니티: { focused: 'people', unfocused: 'people-outline' },
  '동네 지도': { focused: 'map', unfocused: 'map-outline' },
  채팅: { focused: 'chatbubble', unfocused: 'chatbubble-outline' },
  '내 게시판': { focused: 'clipboard', unfocused: 'clipboard-outline' },
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="홈"
      screenOptions={({ route }) => ({
        header: () => <CustomHeader title={TAB_TITLES[route.name]} />,
        tabBarStyle: {
          height: 50, 
          paddingBottom: 10, 
          paddingTop: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused ? ICONS[route.name].focused : ICONS[route.name].unfocused;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2D754E',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="홈" component={BoardScreen} />
      <Tab.Screen name="커뮤니티" component={RecipeCommunityScreen} />
      <Tab.Screen name="동네 지도" component={MapScreen} />
      <Tab.Screen name="채팅" component={ChatScreen} />
      <Tab.Screen name="내 게시판" component={MyScreen} />
    </Tab.Navigator>
  );
};

const HomeScreenContent = () => (
  <SafeAreaView style={styles.container}>
  <PostList/> 
  </SafeAreaView>
);


const CombinedHomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TabNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default CombinedHomeScreen;
