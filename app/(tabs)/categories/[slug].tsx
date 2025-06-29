import { GetCategoriesWithProducts } from "@/api/api";
import { ProductListItem } from "@/components/PrdocutListItem";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function Category() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data, isLoading, error } = GetCategoriesWithProducts(slug);

//   console.log("data" , data);

  if (isLoading) return <Text>Loading...</Text>;

  if (error)
    return <Text>Error {error?.message || "Failed to fetch data"}</Text>;
  if (!data) return <Redirect href={"/+not-found"} />;

  const { category, products } = data;

  return (
    <>
      <Stack.Screen
        options={{
          title: category.name as string,
          headerStyle: {
            backgroundColor: "white",
          },
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container}>
        <Image
          source={{ uri: category.imageUrl }}
          style={styles.categoryImage}
        />
        <Text style={styles.categoryName}>{category.name}</Text>

       {products !== null ?  <FlatList
                                        data={products}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => <ProductListItem product={item} />}
                                        numColumns={2}
                                        columnWrapperStyle={styles.productRow}
                                        contentContainerStyle={styles.productsList}
                                      /> : <Text>No products found</Text>}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  categoryImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  productsList: {
    flexGrow: 1,
  },
  productRow: {
    justifyContent: "space-between",
  },
  productContainer: {
    flex: 1,
    margin: 8,
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
});
