import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../styles/LoginScreen.style";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
      .then(() => {
        navigation.navigate("NewHomeScreen");
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.screen}
      enableOnAndroid={true}
      resetScrollToCoords={{ x: 0, y: 0 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>🍴FoodLink🍴</Text>
        <Text style={styles.subtitle}>로그인</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../start-expo/assets/avatar.png")}
            style={styles.avatar}
          />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ID"
            placeholderTextColor="#2d754e"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#2d754e"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
