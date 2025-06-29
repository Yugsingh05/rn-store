import AuthProvider from "@/providers/AuthProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ Use this
import  QueryProivder  from "@/providers/QueryProvider";

export default function RootLayout() {
  return (
    
      <SafeAreaProvider>
        <AuthProvider>
          <QueryProivder>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
        </QueryProivder>
        </AuthProvider>
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
