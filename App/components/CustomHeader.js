import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import headerStyles from '../styles/header.style';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({ title }) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태 추가
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목 상태

  const getTitleStyle = () => {
    if (title.length >= 3) {
      return [headerStyles.headerTitle, { left: '46%' }];
    } else if (title.length < 2) {
      return [headerStyles.headerTitle, { left: '52%' }];
    } else {
      return [headerStyles.headerTitle, { left: '50%' }];
    }
  };
  
  // 항목 제거
  const removeItem = (item) => {
    Alert.alert(
      '항목 제거',
      `${item}을(를) 제거하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () =>
            setSelectedItems((prevItems) => prevItems.filter((i) => i !== item)),
        },
      ],
      { cancelable: true }
    );
  };

  // 검색 실행
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      Alert.alert('검색어를 입력하세요.');
      return;
    }
    navigation.navigate('SearchSearch', { searchQuery: searchQuery.trim() });

  };

  return (
    <SafeAreaView style={headerStyles.header}>
      {/* 상단 헤더 */}
      <View style={headerStyles.headerTop}>
        <TouchableOpacity onPress={() => navigation.navigate('HeartScreen')}>
          <Ionicons name="heart-outline" size={22} color="#2D754E" />
        </TouchableOpacity>
        <Text style={getTitleStyle()}>{title}</Text>
        <View style={headerStyles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('IfmScreen')}>
            <Ionicons name="person-outline" size={22} color="#2D754E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 검색 및 카테고리 */}
      {(title === '홈' || title === '동네 지도') && (
        <>
          {/* 검색 및 거주지 선택 */}
          <View style={headerStyles.headerBottom}>
            <TouchableOpacity style={headerStyles.locationDropdown}>
              <Text style={headerStyles.locationText}>거주지</Text>
              <Ionicons name="chevron-down-outline" size={16} color="#2D754E" />
            </TouchableOpacity>

            <View style={headerStyles.searchBar}>
              <Ionicons name="search-outline" size={16} color="gray" />
              <TextInput
                placeholder="검색"
                placeholderTextColor="gray"
                style={headerStyles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery} // 검색어 상태 업데이트
                onSubmitEditing={handleSearch} // Enter 키로 검색 실행
              />
              {searchQuery.trim() !== '' && (
                <TouchableOpacity
                  style={headerStyles.clearButton}
                  onPress={() => setSearchQuery('')} // 검색어 초기화
                >
                  <Ionicons name="close-circle-outline" size={16} color="gray" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 카테고리 선택 및 선택된 항목 */}
          <View style={headerStyles.categoryContainer}>
            <TouchableOpacity
              style={headerStyles.categoryIcon}
              onPress={() =>
                navigation.navigate('CategoryScreen', { setSelectedItems })
              }
            >
              <Ionicons name="grid-outline" size={24} color="#2D754E" />
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={headerStyles.selectedItemsContainer}
            >
              {selectedItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => removeItem(item)}
                  style={headerStyles.selectedItemTouchable}
                >
                  <Text style={headerStyles.selectedItem}>{item}</Text>
                  
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CustomHeader;
