import React, { useState } from "react";
import { View, Text, Switch, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";

export default function SettingsScreen() {
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [matchStartAlerts, setMatchStartAlerts] = useState(true);
  const [redCardAlerts, setRedCardAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1117" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 }}>
        <Text style={{ color: "#F0F6FC", fontSize: 24, fontWeight: "800" }}>Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* User Card */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            marginHorizontal: 16,
            backgroundColor: "#161B22",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#21262D",
            gap: 14,
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#00C853",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#0D1117", fontSize: 22, fontWeight: "800" }}>Q</Text>
          </View>
          <View>
            <Text style={{ color: "#F0F6FC", fontSize: 16, fontWeight: "700" }}>Usuário QuantoTa?</Text>
            <Text style={{ color: "#8B949E", fontSize: 12, marginTop: 2 }}>Edição Gratuita</Text>
          </View>
        </View>

        {/* Notifications */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 6 }}>
          <Text style={{ color: "#8B949E", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
            🔔 Notificações
          </Text>
        </View>

        <View style={{ backgroundColor: "#161B22", borderRadius: 14, marginHorizontal: 16, borderWidth: 1, borderColor: "#21262D" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderBottomWidth: 1, borderBottomColor: "#21262D" }}>
            <View>
              <Text style={{ color: "#F0F6FC", fontSize: 14, fontWeight: "600" }}>Gols em Tempo Real</Text>
              <Text style={{ color: "#8B949E", fontSize: 12, marginTop: 2 }}>Avisar quando houver gol</Text>
            </View>
            <Switch value={goalAlerts} onValueChange={setGoalAlerts} trackColor={{ false: "#21262D", true: "#00C853" }} />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderBottomWidth: 1, borderBottomColor: "#21262D" }}>
            <View>
              <Text style={{ color: "#F0F6FC", fontSize: 14, fontWeight: "600" }}>Início das Partidas</Text>
              <Text style={{ color: "#8B949E", fontSize: 12, marginTop: 2 }}>Notificar apito inicial</Text>
            </View>
            <Switch value={matchStartAlerts} onValueChange={setMatchStartAlerts} trackColor={{ false: "#21262D", true: "#00C853" }} />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 }}>
            <View>
              <Text style={{ color: "#F0F6FC", fontSize: 14, fontWeight: "600" }}>Cartões Vermelhos</Text>
              <Text style={{ color: "#8B949E", fontSize: 12, marginTop: 2 }}>Notificar expulsões</Text>
            </View>
            <Switch value={redCardAlerts} onValueChange={setRedCardAlerts} trackColor={{ false: "#21262D", true: "#00C853" }} />
          </View>
        </View>

        {/* Appearance */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 6 }}>
          <Text style={{ color: "#8B949E", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
            🎨 Aparência
          </Text>
        </View>

        <View style={{ backgroundColor: "#161B22", borderRadius: 14, marginHorizontal: 16, borderWidth: 1, borderColor: "#21262D" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 }}>
            <View>
              <Text style={{ color: "#F0F6FC", fontSize: 14, fontWeight: "600" }}>Tema Escuro</Text>
              <Text style={{ color: "#8B949E", fontSize: 12, marginTop: 2 }}>Interface escura padrão</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: "#21262D", true: "#00C853" }} />
          </View>
        </View>

        {/* General */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 6 }}>
          <Text style={{ color: "#8B949E", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
            ℹ️ Sobre
          </Text>
        </View>

        <View style={{ backgroundColor: "#161B22", borderRadius: 14, marginHorizontal: 16, borderWidth: 1, borderColor: "#21262D" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 14, borderBottomWidth: 1, borderBottomColor: "#21262D" }}>
            <Text style={{ color: "#F0F6FC", fontSize: 14 }}>Versão do App</Text>
            <Text style={{ color: "#8B949E", fontSize: 14 }}>v1.0.0 (Build CI)</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 14 }}>
            <Text style={{ color: "#F0F6FC", fontSize: 14 }}>Provedor de Dados</Text>
            <Text style={{ color: "#00C853", fontSize: 14, fontWeight: "600" }}>API-Football</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
