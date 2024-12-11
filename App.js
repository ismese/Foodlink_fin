import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./App/components/TabNavigator"; // TabNavigator import
import CategoryScreen from "./App/Screens/HeaderScreen/Category/CategoryScreen";
import HeartScreen from "./App/Screens/HeaderScreen/Heart/HeartScreen";
import IfmScreen from "./App/Screens/HeaderScreen/Ifm/IfmScreen";
import LoginScreen from "./App/Login/LoginScreen";
import SignUp from "./App/Login/SignUp";
import LocationScreen from "./App/Login/LocationScreen";
import CustomHeader from "./App/components/CustomHeader";
import NewHomeScreen from "./App/NewHomeScreen";
import SignUpmodify from "./App/Screens/Modify/SignUpmodify";
import Locationmodify from "./App/Screens/Modify/Locationmodify";
import FeedScreen from "./App/post/FeedScreen";
import MyScreen from "./App/Screens/Myscreen/MyScreen";
import MyPostWrite from "./App/MyPost/MyPostWrite";
import { PostProvider } from "./App/PostContext"; // PostProvider import
import BoardScreen from "./App/Board/BoardScreen";
import MyPostModify from "./App/MyPost/MyPostModify";
import MyIngredientsScreen from "./App/Screens/RecipeCommunityScreen/Ingredients/MyIngredientsScreen";
import IngredientDetailScreen from "./App/Screens/RecipeCommunityScreen/Ingredients/IngredientDetailScreen";
import RecipePost from "./App/Screens/RecipeCommunityScreen/Recipe/RecipePost";
import MyRecipeList from "./App/Screens/RecipeCommunityScreen/Recipe/MyReipeList";
import CmPostList from "./App/Screens/RecipeCommunityScreen/Community/CmPostList";
import CmPost from "./App/Screens/RecipeCommunityScreen/Community/CmPost";
import MyCmPost from "./App/Screens/RecipeCommunityScreen/Community/MyCmPost";
import CmPostChat from "./App/Screens/RecipeCommunityScreen/Community/CmPostChat";
import MyRecipePost from "./App/Screens/RecipeCommunityScreen/Recipe/MyRecipePost";
import AddCmPost from "./App/Screens/RecipeCommunityScreen/Community/AddCmPost";
import Page from "./App/Screens/RecipeCommunityScreen/Page";
import ModifyCmPost from "./App/Screens/RecipeCommunityScreen/Community/ModifyCmPost";
import ModifyRecipe from "./App/Screens/RecipeCommunityScreen/Recipe/ModfiyRecipe";
import MyFoodWrite from "./App/Screens/RecipeCommunityScreen/Ingredients/MyFoodWrite";
import NewIngredients from "./App/Screens/RecipeCommunityScreen/Ingredients/NewIngredients";
import ChatList from "./App/Screens/ChatScreen/ChatList";
import ChatScreen from "./App/Screens/ChatScreen/ChatScreen";
import { auth } from "./firebase"; // Firebase 인증 모듈 import
import SearchSearch from "./App/Search/SearchSearch";
import RecipeDetailScreen from "./App/Screens/RecipeCommunityScreen/Ingredients/RecipeDetailScreen";
// Stack Navigator 생성
const Stack = createStackNavigator();

// App 컴포넌트 정의
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Firebase 인증 상태 감지
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user); // 유저 로그인 상태에 따라 isLoggedIn 설정
    });

    return unsubscribe; // 컴포넌트 언마운트 시 구독 해제
  }, []);

  return (
    <PostProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "Main" : "LoginScreen"}
          screenOptions={{ headerShown: false }}
        >
          {/* 로그인 관련 스크린 */}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="LocationScreen" component={LocationScreen} />
          <Stack.Screen name="SignUpmodify" component={SignUpmodify} />
          <Stack.Screen name="Locationmodify" component={Locationmodify} />

          {/* TabNavigator 포함 메인 화면 */}
          <Stack.Screen name="Main" component={TabNavigator} />

          {/* 추가 스크린 */}
          <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
          <Stack.Screen name="HeartScreen" component={HeartScreen} />
          <Stack.Screen name="IfmScreen" component={IfmScreen} />
          <Stack.Screen name="CustomHeader" component={CustomHeader} />
          <Stack.Screen name="NewHomeScreen" component={NewHomeScreen} />
          <Stack.Screen name="FeedScreen" component={FeedScreen} />
          <Stack.Screen name="MyScreen" component={MyScreen} />
          <Stack.Screen name="BoardScreen" component={BoardScreen} />
          <Stack.Screen name="MyPostWrite" component={MyPostWrite} />
          <Stack.Screen name="MyPostModify" component={MyPostModify} />
          <Stack.Screen name="MyIngredientsScreen" component={MyIngredientsScreen} />
          <Stack.Screen name="IngredientDetailScreen" component={IngredientDetailScreen} />
          <Stack.Screen name="RecipePost" component={RecipePost} />
          <Stack.Screen name="MyRecipeList" component={MyRecipeList} />
          <Stack.Screen name="CmPostList" component={CmPostList} />
          <Stack.Screen name="CmPost" component={CmPost} />
          <Stack.Screen name="MyCmPost" component={MyCmPost} />
          <Stack.Screen name="CmPostChat" component={CmPostChat} />
          <Stack.Screen name="MyRecipePost" component={MyRecipePost} />
          <Stack.Screen name="AddCmPost" component={AddCmPost} />
          <Stack.Screen name="Page" component={Page} />
          <Stack.Screen name="ModifyCmPost" component={ModifyCmPost} />
          <Stack.Screen name="ModifyRecipe" component={ModifyRecipe} />
          <Stack.Screen name="MyFoodWrite" component={MyFoodWrite} />
          <Stack.Screen name="NewIngredients" component={NewIngredients} />
          <Stack.Screen name="ChatList" component={ChatList} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="SearchSearch" component={SearchSearch} />
          <Stack.Screen name="RecipeDetailScreen" component={RecipeDetailScreen} />
          </Stack.Navigator>
      </NavigationContainer>
    </PostProvider>
  );
}