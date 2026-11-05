import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useLeagues } from "@/hooks/useLeague";
import { Loading } from "@/components/ui/Loading";
import { POPULAR_LEAGUES } from "@/constants/leagues";

export default function ExploreScreen() {
  const [search, setSearch] = useState("");
  const { data: leagues, isLoading } = useLeagues();

  const allLeagues = leagues && leagues.length > 0 ? leagues : POPULAR_LEAGUES;

  const filtered = allLeagues.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1117" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 }}>
        <Text style={{ color: "#F0F6FC", fontSize: 24, fontWeight: "800" }}>Ligas</Text>
      </View>

      {/* Search Input */}
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#161B22",
            borderColor: "#21262D",
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 14 }}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar campeonato ou país..."
            placeholderTextColor="#8B949E"
            style={{ color: "#F0F6FC", fontSize: 14, flex: 1 }}
          />
        </View>
      </View>

      {isLoading ? (
        <Loading message="Carregando campeonatos..." />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ color: "#8B949E", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
              🔥 Populares
            </Text>
          </View>

          {filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => router.push(`/league/${item.id}`)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#161B22",
                borderWidth: 1,
                borderColor: "#21262D",
                borderRadius: 12,
                padding: 14,
                marginHorizontal: 16,
                marginVertical: 4,
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: "#21262D",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>{(item as any).flag || "🏆"}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: "#F0F6FC", fontSize: 14, fontWeight: "700" }}>
                  {item.name}
                </Text>
                <Text style={{ color: "#8B949E", fontSize: 12, marginTop: 2 }}>
                  {item.country}
                </Text>
              </View>

              <Text style={{ color: "#30363D", fontSize: 18 }}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
