import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { globalStyles } from "../../src/styles/globalStyles";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {
    const message = await register(username, email, password);
    setError(message);
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Register</Text>

      {error !== "" && <Text style={globalStyles.errorText}>{error}</Text>}

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

      <Text style={globalStyles.label}>Password</Text>
      <TextInput
        style={globalStyles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
        <Text style={globalStyles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={globalStyles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
