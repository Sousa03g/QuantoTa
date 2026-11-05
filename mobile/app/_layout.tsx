import "../global.css";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#0D1117" },
            headerTintColor: "#00C853",
            headerTitleStyle: { color: "#F0F6FC", fontWeight: "700" },
            contentStyle: { backgroundColor: "#0D1117" },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="match/[id]" options={{ title: "Partida" }} />
          <Stack.Screen name="league/[id]" options={{ title: "Liga" }} />
          <Stack.Screen name="team/[id]" options={{ title: "Time" }} />
          <Stack.Screen name="player/[id]" options={{ title: "Jogador" }} />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
