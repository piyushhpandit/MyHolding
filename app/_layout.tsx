import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" />
      <Stack.Screen name="HoldingScreen" />
    </Stack>
  );
}
