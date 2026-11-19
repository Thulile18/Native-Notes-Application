import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/theme";
import { Note, User } from "../types";

// AsyncStorage only saves strings, so we use JSON.stringify to save
// and JSON.parse to read.
export async function getUsers(): Promise<User[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.users);
  if (data === null) {
    return [];
  }
  return JSON.parse(data);
}

export async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

export async function getNotes(): Promise<Note[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.notes);
  if (data === null) {
    return [];
  }
  return JSON.parse(data);
}

export async function saveNotes(notes: Note[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
}
