import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapScreen from "../Login/MapScreen";
import MyScreen from "../Screens/Myscreen/MyScreen";
import RecipeCommunityScreen from "../Screens/RecipeCommunityScreen/Page";
import ChatScreen from "../Screens/ChatScreen/ChatScreen";
import CustomHeader from "./CustomHeader";
import BoardScreen from "../Board/BoardScreen";

const Tab = createBottomTabNavigator();

const TAB_TITLES = {
  홈: "홈",
  커뮤니티: "커뮤니티",
  "동네 지도": "동네 지도",
  채팅: "채팅",
  "내 게시판": "내 게시판",
};

const ICONS = {
  홈: { focused: "home", unfocused: "home-outline" },
  커뮤니티: { focused: "people", unfocused: "people-outline" },
  "동네 지도": { focused: "map", unfocused: "map-outline" },
  채팅: { focused: "chatbubble", unfocused: "chatbubble-outline" },
  "내 게시판": { focused: "clipboard", unfocused: "clipboard-outline" },
};

// "홈" 탭에 사용할 기본 컴포넌트 설정
const DefaultHomeScreen = () => {
  return (
    <MapScreen /> // 기본적으로 MapScreen을 렌더링
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarStyle: {
          height: 70,
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused
            ? ICONS[route.name]?.focused || "help-circle"
            : ICONS[route.name]?.unfocused || "help-circle-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="홈"
        component={BoardScreen} // HomeScreen 대신 DefaultHomeScreen으로 대체
        options={{
          header: () => <CustomHeader title="홈" />,
        }}
      />
      <Tab.Screen
        name="커뮤니티"
        component={RecipeCommunityScreen}
        options={{
          header: () => <CustomHeader title="커뮤니티" />,
        }}
      />
      <Tab.Screen
        name="동네 지도"
        component={MapScreen}
        options={{
          header: () => <CustomHeader title="동네 지도" />,
        }}
      />
      <Tab.Screen
        name="채팅"
        component={ChatScreen}
        options={{
          header: () => <CustomHeader title="채팅" />,
        }}
      />
      <Tab.Screen
        name="내 게시판"
        component={MyScreen}
        options={{
          header: () => <CustomHeader title="내 게시판" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
