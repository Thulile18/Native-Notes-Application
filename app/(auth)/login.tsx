import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { globalStyles } from "../../src/styles/globalStyles";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    const message = await login(email, password);
    setError(message);
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Login</Text>

      {error !== "" && <Text style={globalStyles.errorText}>{error}</Text>}

      <Text style={globalStyles.label}>Email</Text>
      <TextInput
        style={globalStyles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={globalStyles.label}>Password</Text>
      <TextInput
        style={globalStyles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={globalStyles.linkText}>No account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
}
