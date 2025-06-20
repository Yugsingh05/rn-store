import { Stack } from "expo-router";

export default function OrdersLayout(){
    return (
        <Stack screenOptions={{
            headerShown: true,
        }}>
            <Stack.Screen
                name="index"
            />
            <Stack.Screen
                name="[slug]"
            />
        </Stack>
    )
}