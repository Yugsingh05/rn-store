import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function CategoryLayout() {
    return (
       <Stack screenOptions={{
           headerShown: true,
       }}>
        <Stack.Screen
            name="[slug]"
            options={({navigation}) => ({
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black"/>
                    </TouchableOpacity>
                )
            })}
        />
       </Stack>
    )
}