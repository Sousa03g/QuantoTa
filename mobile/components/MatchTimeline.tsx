import React from "react";
import { View, Text } from "react-native";
import { MatchEvent } from "@/services/matches";

interface MatchTimelineProps {
  events: MatchEvent[];
}

export function MatchTimeline({ events }: MatchTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ color: "#8B949E", fontSize: 13 }}>Nenhum evento registrado ainda.</Text>
      </View>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "GOAL":
        return { icon: "⚽", bg: "#00C853" };
      case "CARD":
        return { icon: "🟨", bg: "#FFD700" };
      case "RED_CARD":
        return { icon: "🟥", bg: "#FF4444" };
      case "SUBST":
        return { icon: "🔄", bg: "#4488FF" };
      default:
        return { icon: "📌", bg: "#21262D" };
    }
  };

  return (
    <View style={{ paddingVertical: 8 }}>
      {events.map((event, index) => {
        const { icon } = getEventIcon(event.type);
        return (
          <View
            key={event.id || index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#161B22",
            }}
          >
            <Text style={{ width: 40, color: "#8B949E", fontWeight: "700", fontSize: 12 }}>
              {event.minute}'
            </Text>

            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#21262D",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 14 }}>{icon}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "#F0F6FC", fontWeight: "600", fontSize: 13 }}>
                {event.playerName || "Evento"}
              </Text>
              {event.detail ? (
                <Text style={{ color: "#8B949E", fontSize: 11, marginTop: 2 }}>
                  {event.detail}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
