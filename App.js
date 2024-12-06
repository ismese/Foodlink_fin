import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./App/components/TabNavigator";
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

import MyScreen from "./App/Screens/Myscreen/MyScreen"; // MyScreen import
import MyPostWrite from "./App/MyPost/MyPostWrite"; // MyPostWrite import
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
import { auth } from "./firebase"; // Firebase 인증 모듈 import

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);  // 유저가 로그인되어 있으면 true, 아니면 false
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
          {/* 로그인 화면 */}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />

          {/* 메인 화면 */}
          <Stack.Screen name="Main" component={TabNavigator} />

          {/* 기타 스크린들 */}
          <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
          <Stack.Screen name="HeartScreen" component={HeartScreen} />
          <Stack.Screen name="IfmScreen" component={IfmScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="LocationScreen" component={LocationScreen} />
          <Stack.Screen name="CustomHeader" component={CustomHeader} />
          <Stack.Screen name="NewHomeScreen" component={NewHomeScreen} />
          <Stack.Screen name="SignUpmodify" component={SignUpmodify} />
          <Stack.Screen name="Locationmodify" component={Locationmodify} />
          <Stack.Screen name="MyScreen" component={MyScreen} />
          <Stack.Screen name="MyPostWrite" component={MyPostWrite} />
          <Stack.Screen name="FeedScreen" component={FeedScreen} />
          <Stack.Screen name="BoardScreen" component={BoardScreen} />
          <Stack.Screen name="MyPostModify" component={MyPostModify} />
          <Stack.Screen name="MyIngredientsScreen" component={MyIngredientsScreen} />
          <Stack.Screen name="IngredientDetailScreen" component={IngredientDetailScreen} />
          <Stack.Screen name="RecipePost" component={RecipePost} />
          <Stack.Screen name="MyRecipeList" component={MyRecipeList} />
          <Stack.Screen name="CmPost" component={CmPost} />
          <Stack.Screen name="MyCmPost" component={MyCmPost} />
          <Stack.Screen name="CmPostChat" component={CmPostChat} />
          <Stack.Screen name="CmPostList" component={CmPostList} />
          <Stack.Screen name="MyRecipePost" component={MyRecipePost} />
          <Stack.Screen name="AddCmPost" component={AddCmPost} />
          <Stack.Screen name="Page" component={Page} />
          <Stack.Screen name="ModifyCmPost" component={ModifyCmPost} />
          <Stack.Screen name="ModifyRecipe" component={ModifyRecipe} />
          <Stack.Screen name="MyFoodWrite" component={MyFoodWrite} />
          <Stack.Screen name="NewIngredients" component={NewIngredients} />
          <Stack.Screen name="ChatList" component={ChatList} />
        </Stack.Navigator>
      </NavigationContainer>
    </PostProvider>
  );
}
