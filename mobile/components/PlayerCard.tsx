import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";

interface PlayerCardProps {
  id: number;
  name: string;
  position: string;
  number?: number;
  photo?: string;
  nationality?: string;
}

export function PlayerCard({ id, name, position, number, photo, nationality }: PlayerCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/player/${id}`)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#161B22",
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 16,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: "#21262D",
      }}
    >
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
          contentFit="cover"
        />
      ) : (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#21262D",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Text style={{ color: "#F0F6FC", fontWeight: "700" }}>
            {name.charAt(0)}
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={{ color: "#F0F6FC", fontSize: 14, fontWeight: "600" }}>{name}</Text>
        <Text style={{ color: "#8B949E", fontSize: 12, marginTop: 2 }}>
          {position} {number ? `• Camisa ${number}` : ""}
        </Text>
      </View>

      {nationality ? (
        <Text style={{ color: "#8B949E", fontSize: 11, fontWeight: "500" }}>
          {nationality}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
