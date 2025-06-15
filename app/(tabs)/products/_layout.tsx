import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function ProductLayout() {
    return (
       <Stack screenOptions={{
           headerShown: true,
           headerStyle: {
               backgroundColor: 'white',
           },
           headerShadowVisible: false,
       }}>
        <Stack.Screen
        name="[slug]"
        options={({navigation, route}) => ({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
            ),
        })}/>
       </Stack>
    )
}