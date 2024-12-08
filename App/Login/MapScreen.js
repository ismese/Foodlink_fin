import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { firestore1 } from '../../firebase'; // Firebase Firestore 가져오기

const categoryIcons = {
  과일: '🍎',
  채소: '🫑',
  곡류: '🌾',
  견과류: '🥜',
  육류: '🍖',
  계란: '🥚',
  유제품: '🧈',
  생선: '🐟',
  해산물: '🦞',
  건어물: '🦑',
  조미료: '🧂',
  가공식품: '🥟',
  간식: '🍪',
};

const MapScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [posts, setPosts] = useState([]); // Firestore에서 가져온 판매 글 데이터

  // 현재 사용자 위치 가져오기
  useEffect(() => {
    let locationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.');
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

  // Firestore에서 판매 글 데이터 가져오기
  useEffect(() => {
    // Firestore 객체 초기화 확인
    if (!firestore1) {
      console.error('Firestore1 is not initialized properly.');
      return;
    }

    const unsubscribe = firestore1
      .collection('posts') // Firestore 컬렉션 참조
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
                  categoryIcon: categoryIcons[data.categories[0]] || '📌', // 카테고리 아이콘 매핑
                };
              }
              return null; // 위치 정보가 없는 게시글은 제외
            })
            .filter((post) => post !== null); // null 값 제거
          setPosts(loadedPosts);
        },
        (error) => {
          console.error('Error fetching posts from Firestore:', error); // Firestore 오류 처리
        }
      );

    return () => unsubscribe();
  }, []);

  const handleMarkerPress = (post) => {
    navigation.navigate('FeedScreen', { post }); // FeedScreen으로 이동
  };

  return (
    <View style={styles.container}>
      {/* 에러 메시지 표시 */}
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
        {/* 현재 사용자 위치 표시 */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="현재 위치"
            description="이곳이 나의 현재 위치입니다."
            pinColor="blue" // 사용자 위치는 파란색 마커
          />
        )}

        {/* Firestore에서 가져온 판매 글 위치 표시 */}
        {posts.map((post) => (
          <Marker
            key={post.id}
            coordinate={{
              latitude: post.latitude,
              longitude: post.longitude,
            }}
            title={post.title}
            description={post.priceOrExchange} // 가격 또는 교환 정보
            onPress={() => handleMarkerPress(post)} // 마커 클릭 시 FeedScreen으로 이동
          >
            <View style={styles.customMarker}>
              <Text style={styles.markerIcon}>{post.categoryIcon}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
    borderRadius: 10,
    margin: 16, // padding을 제거하고 margin으로 변경
  },
  customMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
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
});

export default MapScreen;
