import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles/BottomSheet.style"; // 하단 시트 스타일 파일
import * as Location from "expo-location"; // 위치 정보를 가져오기 위해 expo-location 사용
import firebase from "firebase/compat/app";
import "firebase/compat/firestore"; // Firestore 사용

const BottomSheet = ({ post, navigation }) => {
  const [distance, setDistance] = useState(null); // 거리 상태 관리
  const db = firebase.firestore();
  const auth = firebase.auth();

  useEffect(() => {
    if (!post) return; // post가 없으면 거리 계산 수행하지 않음

    const calculateDistance = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("위치 권한이 허용되지 않았습니다.");
          setDistance("위치 정보 없음");
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        const { latitude: userLat, longitude: userLng } = userLocation.coords;

        if (post.location) {
          const { latitude: postLat, longitude: postLng } = post.location;
          const distance = getDistanceFromLatLonInKm(userLat, userLng, postLat, postLng);
          setDistance(distance.toFixed(1)); // 소수점 첫째 자리까지 거리 표시
        } else {
          setDistance("위치 정보 없음");
        }
      } catch (error) {
        console.error("거리 계산 중 오류 발생:", error);
        setDistance("위치 정보 없음");
      }
    };

    calculateDistance();
  }, [post]);

  const handlePostClick = () => {
    if (post) {
      navigation.navigate("FeedScreen", { post }); // FeedScreen으로 이동
    }
  };

  const handleFavorite = async () => {
    try {
      const userUID = auth.currentUser?.uid;
      if (!userUID) {
        Alert.alert("오류", "로그인된 사용자가 없습니다.");
        return;
      }

      const userDocRef = db.collection("users").doc(userUID); // Firestore 사용자 문서 참조
      const userDoc = await userDocRef.get(); // 사용자 데이터 가져오기

      let favorites = [];
      if (userDoc.exists) {
        const userData = userDoc.data();
        favorites = userData.favorites || [];
      }

      // 중복 확인
      if (!favorites.some((fav) => fav.id === post.id)) {
        favorites.push({
          id: post.id,
          title: post.title,
          priceOrExchange: post.priceOrExchange,
          createdAt: post.createdAt.toDate(), // Firestore 타임스탬프를 JS Date로 변환
          location: post.location,
          images: post.images,
        });

        // Firestore 업데이트
        await userDocRef.update({ favorites });

        Alert.alert("찜 성공", "게시물이 찜 목록에 추가되었습니다.");
      } else {
        Alert.alert("중복", "이미 찜한 게시물입니다.");
      }
    } catch (error) {
      console.error("찜한 게시물 저장 중 오류 발생:", error);
      Alert.alert("오류", "찜한 게시물을 저장하는 중 문제가 발생했습니다.");
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구의 반지름 (단위: km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // km 단위 거리
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // post가 없으면 아무것도 렌더링하지 않음
  if (!post) {
    return null;
  }

  return (
    <View style={styles.bottomSheet}>
      <TouchableOpacity onPress={handlePostClick} style={styles.postContainer}>
        <View style={styles.imageContainer}>
          {post.images?.[0] ? (
            <Image
              source={{ uri: post.images[0] }}
              style={styles.imagePlaceholder}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{post.title || "제목 없음"}</Text>
          </View>

          <View style={styles.infoContainer}>
            <MaterialIcons name="location-on" size={12} color="#8C8C8C" />
            <Text style={styles.infoText}>
              {distance ? `${distance}km` : "거리 정보 없음"}
            </Text>
            <Text style={styles.infoSeparator}>·</Text>
            <Text style={styles.infoText}>
              {post.createdAt ? calculateTimeAgo(post.createdAt) : "시간 정보 없음"}
            </Text>
          </View>

          <Text style={styles.price}>
            {post.priceOrExchange ? `${post.priceOrExchange}원` : "가격 정보 없음"}
          </Text>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
              <MaterialIcons name="favorite" size={20} color="#F44336" />
              <Text style={styles.actionText}>찜</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const calculateTimeAgo = (createdAt) => {
  const now = new Date();
  const postDate = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) return `1분 전`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  return `${Math.floor(diffInSeconds / 86400)}일 전`;
};

export default BottomSheet;
