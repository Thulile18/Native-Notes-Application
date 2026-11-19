import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { COLORS } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { Note } from "../types";
import { getNotes, saveNotes } from "../utils/storage";

type Props = {
  category: string;
};

export default function NotesList({ category }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Runs every time this screen is shown, so new or edited notes appear.
  useFocusEffect(
    useCallback(() => {
      async function loadNotes() {
        if (user === null) {
          return;
        }
        const allNotes = await getNotes();
        const myNotes = allNotes.filter(
          (n) => n.userId === user.id && n.category === category
        );
        setNotes(myNotes);
      }
      loadNotes();
    }, [user, category])
  );

  function getVisibleNotes() {
    // Split what the user typed into separate words.
    const words = searchText
      .toLowerCase()
      .split(" ")
      .filter((word) => word !== "");

    // Keep a note only if EVERY word is found in its title or text.
    const filtered = notes.filter((note) => {
      const content = (note.title + " " + note.text).toLowerCase();
      for (const word of words) {
        if (!content.includes(word)) {
          return false;
        }
      }
      return true;
    });

    // Sort by date added.
    filtered.sort((a, b) => {
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      if (sortOrder === "newest") {
        return dateB - dateA;
      }
      return dateA - dateB;
    });

    return filtered;
  }

  function toggleSort() {
    if (sortOrder === "newest") {
      setSortOrder("oldest");
    } else {
      setSortOrder("newest");
    }
  }

  function confirmDelete(id: string) {
    Alert.alert("Delete note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteNote(id) },
    ]);
  }

  async function deleteNote(id: string) {
    const allNotes = await getNotes();
    const remaining = allNotes.filter((n) => n.id !== id);
    await saveNotes(remaining);
    setNotes(notes.filter((n) => n.id !== id));
  }

  function openAddForm() {
    router.push({ pathname: "/note-form", params: { category: category } });
  }

  function openEditForm(id: string) {
    router.push({
      pathname: "/note-form",
      params: { id: id, category: category },
    });
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  const visibleNotes = getVisibleNotes();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search notes..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.smallButton} onPress={toggleSort}>
          <Text style={styles.smallButtonText}>
            Sort: {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={openAddForm}>
          <Text style={styles.smallButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={visibleNotes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes found.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            {item.title !== "" && <Text style={styles.noteTitle}>{item.title}</Text>}
            <Text style={styles.noteText}>{item.text}</Text>
            <Text style={styles.dateText}>Added: {formatDate(item.dateAdded)}</Text>
            {item.dateEdited !== "" && (
              <Text style={styles.dateText}>
                Edited: {formatDate(item.dateEdited)}
              </Text>
            )}

            <View style={styles.noteButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEditForm(item.id)}
              >
                <Text style={styles.smallButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={styles.smallButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 15,
    backgroundColor: COLORS.background,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  smallButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  smallButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  noteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: COLORS.text,
  },
  noteText: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.grey,
  },
  noteButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: COLORS.grey,
    fontSize: 16,
  },
});
