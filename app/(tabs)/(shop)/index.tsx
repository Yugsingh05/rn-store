import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { ProductListItem } from '@/components/PrdocutListItem';
import { ListHeader } from '@/components/ListHeader';
import { GetProductsAndCategories } from '@/api/api';

export default function HomeScreen() {

  const {data , error , isLoading} = GetProductsAndCategories();

  if(isLoading) return <ActivityIndicator/>

  if(error) return <Text>Error {error?.message || 'Failed to fetch data'}</Text>

  if(!data) return <Text>Loading...</Text>

  return (
   <View>
    <FlatList data={data?.products}
     renderItem={({ item }) => <ProductListItem product={item} />}
     keyExtractor={item => item.id.toString()}
     numColumns={2}
     ListHeaderComponent={<ListHeader categories={data.category}/>}
     contentContainerStyle = {styles.flatListContent}
     columnWrapperStyle={styles.flatListColumn}
     style = {{paddingHorizontal : 10  , paddingVertical : 5}}
     
     />
   </View>
  // <Auth/>
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
