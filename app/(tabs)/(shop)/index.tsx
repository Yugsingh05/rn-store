import { FlatList, StyleSheet, View } from 'react-native';


import { PRODUCTS } from '@/assets/products';
import { ProductListItem } from '@/components/PrdocutListItem';
import { ListHeader } from '@/components/ListHeader';

export default function HomeScreen() {
  return (
   <View>
    <FlatList data={PRODUCTS}
     renderItem={({ item }) => <ProductListItem product={item} />}
     keyExtractor={item => item.id.toString()}
     numColumns={2}
     ListHeaderComponent={ListHeader}
     contentContainerStyle = {styles.flatListContent}
     columnWrapperStyle={styles.flatListColumn}
     style = {{paddingHorizontal : 10  , paddingVertical : 5}}
     
     />
   </View>
  );
}

const styles = StyleSheet.create({
  flatListContent : {
    paddingBottom : 20,
  },
  flatListColumn : {
    justifyContent : 'space-between'
  }
});
