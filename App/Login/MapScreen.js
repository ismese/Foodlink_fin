import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { firestore } from '../../firebase'; // Firebase Firestore 가져오기

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [posts, setPosts] = useState([]); // Firestore에서 가져온 판매 글 데이터

  // 현재 사용자 위치 가져오기
  useEffect(() => {
    let locationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('위치 권한이 거부되었습니다.');
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
    const unsubscribe = firestore.collection('posts').onSnapshot((snapshot) => {
      const loadedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(loadedPosts);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
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
            description={post.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  map: {
    flex: 0.7,
    borderRadius: 10,
  },
});

export default MapScreen;
