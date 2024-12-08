import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-bold',
    color: '#2E2F33',
  },
  emptySpace: {
    width: 24,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 17,
  },
  recipeImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  recipeTitleContainer: {
    alignItems: 'center',
    paddingBottom: 15,
  },
  recipeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.8)',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#F5F5F5', // 회색 배경 추가
    borderRadius: 10,
    marginHorizontal: 40,
    marginBottom: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'black',
    marginLeft: 3,
  },
  divider: {
    height: 6,
    backgroundColor: '#F2F3F6',
    marginVertical: 10,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter-bold',
    color: '#2E2F33',
    marginBottom: 10,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredient: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D754E',
    marginRight: 10,
  },
  stepsContainer: {
    marginTop: 0,
    height: "330",
  },
  stepText: {
    fontSize: 16,
    color: '#2E2F33',
    fontFamily: "Inter-medium",
    marginTop: 5,
    lineHeight: 20,
  },
});