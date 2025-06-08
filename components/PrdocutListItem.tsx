import { Product } from "@/assets/types/product";
import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
    product : Product
}
export const ProductListItem = ({product} : Props) => {
    return (
        <Link asChild href={{
            pathname: `/products/${product.slug}`,
            params: { title: product.title }
        }}>
        <Pressable style={styles.item}>
         <View style={styles.itemImageContainer}>
            <Image source={product.heroImage} style={styles.itemImage} />
         </View>
         <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>{product.title}</Text>
            <Text style={styles.itemPrice}>${product.price}</Text>
         </View>
        </Pressable></Link>
    );
}

const styles = StyleSheet.create({
    item : {
        width : '48%',
        backgroundColor : 'white',
        marginVertical : 8,
        borderRadius : 10,
        overflow : 'hidden'
    },
    itemImageContainer : {
        borderRadius : 10,
        width : '100%',
        height : 150,
    },
    itemImage : {
        width : '100%',
        height : '100%',
        resizeMode : 'cover'
    },
    itemTextContainer : {
        padding : 8,
        alignItems : 'flex-start',
        gap : 4,
    },
    itemTitle : {
        fontSize : 16,
        color : '#888'
    },
    itemPrice : {
        fontSize : 14,
        fontWeight : 'bold',
        color : 'black'
    }
})