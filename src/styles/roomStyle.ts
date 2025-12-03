// app/rooms/roomStyles.ts
import { StyleSheet } from "react-native";

export const roomStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  codeRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 12,
    color: "#777",
  },
  codeValue: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  meta: {
    fontSize: 12,
    color: "#777",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#777",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    gap: 8,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
  },
  points: {
    fontSize: 14,
    fontWeight: "600",
    width: 70,
    textAlign: "right",
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#0055aa",
  },
  copyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  plusButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#0055aa",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 40,
    minHeight: 40,
  },
  plusButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 22,
    textAlign: "center",
  },
  teamBlock: {
    marginTop: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  teamName: {
    fontSize: 15,
    fontWeight: "600",
  },
  teamHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  teamPoints: {
    fontSize: 14,
    fontWeight: "600",
  },
  playerNameInTeam: {
    fontSize: 14,
    marginLeft: 8,
    marginTop: 2,
  },
  joinTeamButton: {
    marginTop: 4,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#0055aa",
    alignItems: "center",
  },
  joinTeamText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalCancel: {
    backgroundColor: "#ccc",
  },
  modalConfirm: {
    backgroundColor: "#cc3333",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
