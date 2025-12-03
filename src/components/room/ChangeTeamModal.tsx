import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modal } from "../ui";
import type { Team } from "../../state/models";

type Props = {
  visible: boolean;
  teams: Team[];
  currentTeamId?: string;
  onSelectTeam: (teamId: string) => void;
  onCancel: () => void;
};

export function ChangeTeamModal({
  visible,
  teams,
  currentTeamId,
  onSelectTeam,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} onClose={onCancel}>
      <Text style={styles.modalTitle}>Cambiar de equipo</Text>
      <Text style={styles.modalText}>Selecciona tu nuevo equipo:</Text>

      <View style={styles.teamButtons}>
        {teams.map((team) => (
          <TouchableOpacity
            key={team.id}
            style={[
              styles.teamBtn,
              team.id === currentTeamId && styles.teamBtnCurrent,
            ]}
            onPress={() => {
              onSelectTeam(team.id);
              onCancel();
            }}
          >
            <Text
              style={[
                styles.teamBtnText,
                team.id === currentTeamId && styles.teamBtnTextCurrent,
              ]}
            >
              {team.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
        <Text style={styles.cancelBtnText}>Cancelar</Text>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222",
  },
  modalText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  teamButtons: {
    gap: 8,
    marginBottom: 16,
  },
  teamBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "transparent",
  },
  teamBtnCurrent: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  teamBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  teamBtnTextCurrent: {
    color: "#007AFF",
  },
  cancelBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
});
