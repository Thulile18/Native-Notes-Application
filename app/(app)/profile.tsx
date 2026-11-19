import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { globalStyles } from "../../src/styles/globalStyles";

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const [username, setUsername] = useState(user ? user.username : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSave() {
    const result = await updateProfile(username, email, currentPassword, newPassword);

    if (result === "") {
      setMessage("Profile updated.");
      setIsError(false);
      setCurrentPassword("");
      setNewPassword("");
    } else {
      setMessage(result);
      setIsError(true);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1, flexDirection: "column", padding: 20 }}>
        <Text style={globalStyles.title}>My Profile</Text>

        {message !== "" && (
          <Text
            style={
              isError
                ? globalStyles.errorText
                : { color: COLORS.primary, textAlign: "center", marginBottom: 10 }
            }
          >
            {message}
          </Text>
        )}

        <Text style={globalStyles.label}>Username</Text>
        <TextInput
          style={globalStyles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={globalStyles.label}>Email</Text>
        <TextInput
          style={globalStyles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={globalStyles.label}>Current password (required to save)</Text>
        <TextInput
          style={globalStyles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={true}
        />

        <Text style={globalStyles.label}>New password (leave empty to keep it)</Text>
        <TextInput
          style={globalStyles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={globalStyles.button} onPress={handleSave}>
          <Text style={globalStyles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, { backgroundColor: COLORS.danger }]}
          onPress={logout}
        >
          <Text style={globalStyles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
