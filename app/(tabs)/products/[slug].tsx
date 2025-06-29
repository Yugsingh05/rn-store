import { GetProductBySlug } from "@/api/api";
import { useCartStore } from "@/store/cart-store";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

const ProductDetails = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const toast = useToast();

  const {data : products , isLoading , error} = GetProductBySlug(slug as string);

  const { items, addItem, incrementItem, decrementItem } = useCartStore();

  const cartItem = items.find((item) => item.id === products?.data.id);

  const initialQuantity = cartItem ? cartItem.quantity : 1;

  const [quantity, setQuantity] = useState(initialQuantity);

  if(isLoading) return <ActivityIndicator/>

  if(error) return <Text>Error {error?.message || 'Failed to fetch data'}</Text>

  if (!products) return <Redirect href={"/+not-found"} />;


  const increaseQuantity = () => {
    if(quantity < products.data.maxQuantity){
        setQuantity(prev => prev + 1);
        incrementItem(products.data?.id);
    }
    else {
        toast.show('Cannot add more than maximum quantity', {
            type : 'warning',
            placement : 'top'
        })
    }
  };
  const decreaseQuantity = () => {
    if(quantity > 1){
        setQuantity(prev => prev - 1);
        decrementItem(products.data?.id);
    }
    else {
        toast.show('Cannot add less than minimum quantity', {
            type : 'warning',
            placement : 'top'
        })
    }
  };

  const addToCart = () => {
    console.log(products);
    addItem({
        id : products.data.id,
        title : products.data.title as string,
        image : products.data.imagesUrl as string[],
        price : products.data.price,
        quantity 
    })
    toast.show('Added tq cart',{
        type : 'success',
        placement : 'top',
        duration : 1500
    })
  };
  const totalPrice = (products.data.price * quantity).toFixed(2);

  return (
    <>
      <Stack.Screen 
        options={{
          title: products.data.title as string,
          headerStyle: {
            backgroundColor: 'white',
          },
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container}>
        <Image source={{uri : products.data.heroImage}} style={styles.heroImage} />

        <View style={styles.content}>
          <Text style={styles.title}>Title : {products.data.title}</Text>
          <Text style={styles.slug}>Slug : {products.data.slug}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              Unit Price : ${products.data.price.toFixed(2)}
            </Text>
            <Text style={styles.price}>Total Price : ${totalPrice}</Text>
          </View>

          <FlatList
            data={products.data.imagesUrl}
            keyExtractor={(items, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>{quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={increaseQuantity}
              disabled={quantity >= products.data.maxQuantity}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.addToCartButton,
                { opacity: quantity === 0 ? 0.5 : 1 },
              ]}
              onPress={addToCart}
              disabled={quantity === 0}
            >
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  slug: {
    fontSize: 18,
    color: "#555",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  price: {
    fontWeight: "bold",
    color: "#000",
  },

  imagesContainer: {
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorMessage: {
    fontSize: 18,
    color: "#f00",
    textAlign: "center",
    marginTop: 20,
  },
  content: {
    padding: 16,
    flex: 1,
  },
});
