import React from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import styles from './Category.style';

const CategoryScreen = ({ navigation, route }) => {
  const { setSelectedItems } = route.params;
  const categories = {
    농산물: [
      { id: '1', name: '과일', icon: '🍎' },
      { id: '2', name: '채소', icon: '🫑' },
      { id: '3', name: '곡류', icon: '🌾' },
      { id: '4', name: '견과류', icon: '🥜' },
    ],
    
    축산물: [
      { id: '5', name: '육류', icon: '🍖' },
      { id: '6', name: '계란', icon: '🥚' },
      { id: '7', name: '유제품', icon: '🧈' },
    ],
    수산물: [
      { id: '8', name: '생선', icon: '🐟' },
      { id: '9', name: '해산물', icon: '🦞' },
      { id: '10', name: '건어물', icon: '🦑' },
    ],
    기타: [
      { id: '11', name: '조미료', icon: '🧂' },
      { id: '12', name: '가공식품', icon: '🥟' },
      { id: '13', name: '간식', icon: '🍪' },
    ],
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryName) => {
    Alert.alert(
      '카테고리',
      `${categoryName} 선택하였습니다.`,
      [
        {
          text: '확인',
          onPress: () => {
            setSelectedItems((prevItems) =>
              prevItems.includes(categoryName) ? prevItems : [...prevItems, categoryName]
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 카테고리 렌더링 함수
  const renderCategory = ({ item: category }) => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          category === '농산물' && { marginTop: 20 }, 
        ]}
      >
        {category}
      </Text>
      
    {/* 구분선 */}
    <View style={styles.separator} />

      <View style={styles.items}>
        {categories[category].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => handleCategorySelect(item.name)}
          >
            <Text style={styles.itemText}>
              {item.icon} {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>전체 서비스</Text>
      </View>

      <FlatList
        data={Object.keys(categories)} 
        keyExtractor={(item) => item}
        renderItem={renderCategory}
        contentContainerStyle={styles.listContainer}
      />
      
    </SafeAreaView>
  );
};

export default CategoryScreen;
