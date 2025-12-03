import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modal } from "../ui";

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ResetConfirmModal({ visible, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} onClose={onCancel}>
      <Text style={styles.modalTitle}>¿Resetear puntuaciones?</Text>
      <Text style={styles.modalText}>
        Esto pondrá todos los marcadores a 0.
      </Text>

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalBtn, styles.modalCancel]}
          onPress={onCancel}
        >
          <Text style={styles.modalBtnText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modalBtn, styles.modalConfirm]}
          onPress={onConfirm}
        >
          <Text style={styles.modalBtnText}>Resetear</Text>
        </TouchableOpacity>
      </View>
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
  modalButtons: {
    flexDirection: "row",
    gap: 8,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancel: {
    backgroundColor: "#e0e0e0",
  },
  modalConfirm: {
    backgroundColor: "#cc3333",
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});
