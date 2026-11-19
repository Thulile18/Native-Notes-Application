import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { STORAGE_KEYS } from "../constants/theme";
import { User } from "../types";
import { getUsers, saveUsers } from "../utils/storage";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (username: string, email: string, password: string) => Promise<string>;
  login: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  updateProfile: (
    username: string,
    email: string,
    currentPassword: string,
    newPassword: string
  ) => Promise<string>;
};

const AuthContext = createContext<AuthContextType | null>(null);
// We never save the real password. We save a scrambled version (a hash).
// The user id is added to the password so two people with the same password
// do not get the same hash.
async function hashPassword(password: string, userId: string) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + userId
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // When the app opens, check if someone was already logged in.
  useEffect(() => {
    async function loadLoggedInUser() {
      const savedId = await AsyncStorage.getItem(STORAGE_KEYS.currentUserId);
      if (savedId !== null) {
        const users = await getUsers();
        const foundUser = users.find((u) => u.id === savedId);
        if (foundUser) {
          setUser(foundUser);
        }
      }
      setLoading(false);
    }
    loadLoggedInUser();
  }, []);

  // Each function below returns an error message.
  // An empty string "" means everything worked.

  async function register(username: string, email: string, password: string) {
    if (username === "" || email === "" || password === "") {
      return "Please fill in all fields.";
    }
    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    const users = await getUsers();
    const emailTaken = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (emailTaken) {
      return "That email is already registered.";
    }

    const newId = Date.now().toString();
    const newUser: User = {
      id: newId,
      username: username,
      email: email,
      passwordHash: await hashPassword(password, newId),
    };

    users.push(newUser);
    await saveUsers(users);
    await AsyncStorage.setItem(STORAGE_KEYS.currentUserId, newId);
    setUser(newUser);
    return "";
  }

  async function login(email: string, password: string) {
    if (email === "" || password === "") {
      return "Please enter your email and password.";
    }

    const users = await getUsers();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!foundUser) {
      return "Email or password is wrong.";
    }

    const hash = await hashPassword(password, foundUser.id);
    if (hash !== foundUser.passwordHash) {
      return "Email or password is wrong.";
    }

    await AsyncStorage.setItem(STORAGE_KEYS.currentUserId, foundUser.id);
    setUser(foundUser);
    return "";
  }

  async function logout() {
    await AsyncStorage.removeItem(STORAGE_KEYS.currentUserId);
    setUser(null);
  }

  async function updateProfile(
    username: string,
    email: string,
    currentPassword: string,
    newPassword: string
  ) {
    if (user === null) {
      return "You are not logged in.";
    }
    if (username === "" || email === "") {
      return "Username and email cannot be empty.";
    }
    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }
    if (newPassword !== "" && newPassword.length < 6) {
      return "New password must be at least 6 characters.";
    }

    // Ask for the current password before changing anything.
    const currentHash = await hashPassword(currentPassword, user.id);
    if (currentHash !== user.passwordHash) {
      return "Current password is wrong.";
    }

    const users = await getUsers();
    const emailTaken = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== user.id
    );
    if (emailTaken) {
      return "That email is used by another account.";
    }

    let newHash = user.passwordHash;
    if (newPassword !== "") {
      newHash = await hashPassword(newPassword, user.id);
    }

    const updatedUser: User = {
      id: user.id,
      username: username,
      email: email,
      passwordHash: newHash,
    };

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    await saveUsers(updatedUsers);
    setUser(updatedUser);
    return "";
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
