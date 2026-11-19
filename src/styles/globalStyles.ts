import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

// Styles shared by many screens.
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.text,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: COLORS.primary,
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: COLORS.danger,
    marginBottom: 10,
    textAlign: "center",
  },
});
