const headerStyles = {
  header: {
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-bold',
    color: '#000000',
    position: 'absolute',
    left: '40%',
    top: '50%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  locationDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontFamily: 'Inter-bold',
    fontSize: 16,
    color: '#2D754E',
    marginRight: 5,
  },
  searchBar: {
    flex: 1,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    borderRadius: 15,
    marginTop: 7,
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    color: '#333',
  },
  categoryContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  categoryIcon: {
    padding: 8,
  },
  
  selectedItemsContainer: {
    flexDirection: 'row',
    marginLeft: 10, 
    alignItems: 'center',
    maxHeight: 30, 
  },
  selectedItemTouchable: {
    marginRight: 8,
  },
  selectedItem: {
    fontSize: 13,
    fontFamily: "Inter-bold",
    color: '#2D754E',
    backgroundColor: '#F5F5F5',
    padding:10,
    paddingVertical:6,
    borderRadius:10,

  },
  categoryContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  categoryIcon: {
    padding: 8,
  },
};

export default headerStyles;
