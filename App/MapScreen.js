import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { firestore1 } from "../firebase";
import { styles } from "./styles/MapScreen.style";
import BottomSheet from "./components/BottomSheet"; // 하단 시트 컴포넌트 가져오기

const categoryIcons = {
  과일: "🍎",
  채소: "🫑",
  곡류: "🌾",
  견과류: "🥜",
  육류: "🍖",
  계란: "🥚",
  유제품: "🧈",
  생선: "🐟",
  해산물: "🦞",
  건어물: "🦑",
  조미료: "🧂",
  가공식품: "🥟",
  간식: "🍪",
};

const categoryColors = {
  과일: "#A8D5BA",
  채소: "#A8D5BA",
  곡류: "#A8D5BA",
  견과류: "#A8D5BA",
  육류: "#F5B7B1",
  계란: "#F5B7B1",
  유제품: "#F5B7B1",
  생선: "#AEDFF7",
  해산물: "#AEDFF7",
  건어물: "#AEDFF7",
  조미료: "#FFE4B5",
  가공식품: "#FFE4B5",
  간식: "#FFE4B5",
};

const MapScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시물

  useEffect(() => {
    let locationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    })();

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!firestore1) {
      console.error("Firestore1 is not initialized properly.");
      return;
    }

    const unsubscribe = firestore1
      .collection("posts")
      .onSnapshot(
        (snapshot) => {
          const loadedPosts = snapshot.docs
            .map((doc) => {
              const data = doc.data();
              if (data.location && data.location.latitude && data.location.longitude) {
                return {
                  id: doc.id,
                  ...data,
                  latitude: data.location.latitude,
                  longitude: data.location.longitude,
                  categoryIcon: categoryIcons[data.categories[0]] || "📌",
                };
              }
              return null;
            })
            .filter((post) => post !== null);
          setPosts(loadedPosts);
        },
        (error) => {
          console.error("Error fetching posts from Firestore:", error);
        }
      );

    return () => unsubscribe();
  }, []);

  const handleMarkerPress = (post) => {
    setSelectedPost(post); // 선택된 게시물 설정
  };

  return (
    <View style={styles.container}>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <MapView
        style={styles.map}
        showsUserLocation={true}
        region={
          location && {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }
        }
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="현재 위치"
            description="이곳이 나의 현재 위치입니다."
            pinColor="blue"
            />
        )}

        {posts.map((post) => (
          <Marker
            key={post.id}
            coordinate={{
              latitude: post.latitude,
              longitude: post.longitude,
            }}
            onPress={() => handleMarkerPress(post)} // 클릭하면 하단 시트에 정보가 뜨도록
          >
            <View style={styles.customMarker}>
              <View
                style={[
                  styles.pinContainer,
                  {
                    backgroundColor: categoryColors[post.categories[0]] || "#ccc",
                    borderColor: categoryColors[post.categories[0]] || "#ccc",
                  },
                ]}
              >
                <Text style={styles.markerIcon}>{post.categoryIcon}</Text>
              </View>
              <View
                style={[
                  styles.pinTail,
                  {
                    backgroundColor: categoryColors[post.categories[0]] || "#ccc",
                  },
                ]}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* 하단 시트 컴포넌트 */}
      <BottomSheet post={selectedPost} navigation={navigation} />
    </View>
  );
};

export default MapScreen;
