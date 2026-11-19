import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Href, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { CATEGORIES, COLORS } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { globalStyles } from "../../src/styles/globalStyles";
import { Note } from "../../src/types";
import { getNotes, saveNotes } from "../../src/utils/storage";

export default function NoteFormScreen() {
  const { user } = useAuth();
  const router = useRouter();

  // id is only there when we are editing. category is the tab we came from.
  const { id, category } = useLocalSearchParams<{ id?: string; category?: string }>();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [error, setError] = useState("");
  // Runs every time this page is shown. It fills in the form (edit)
  // or clears the form (add).
  useFocusEffect(
    useCallback(() => {
      async function setupForm() {
        setError("");
        if (id) {
          const allNotes = await getNotes();
          const note = allNotes.find((n) => n.id === id);
          if (note) {
            setTitle(note.title);
            setText(note.text);
            setSelectedCategory(note.category);
          }
        } else {
          setTitle("");
          setText("");
          setSelectedCategory(category ? category : CATEGORIES[0]);
        }
      }
      setupForm();
    }, [id, category])
  );

  async function handleSave() {
    if (user === null) {
      return;
    }
    if (text.trim() === "") {
      setError("The note text cannot be empty.");
      return;
    }

    const allNotes = await getNotes();

    if (id) {
      // EDIT: change the note that has this id and add the edited time.
      const updatedNotes = allNotes.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            title: title,
            text: text,
            category: selectedCategory,
            dateEdited: new Date().toISOString(),
          };
        }
        return n;
      });
      await saveNotes(updatedNotes);
    } else {
      // ADD: make a new note.
      const newNote: Note = {
        id: Date.now().toString(),
        userId: user.id,
        title: title,
        text: text,
        category: selectedCategory,
        dateAdded: new Date().toISOString(),
        dateEdited: "",
      };
      allNotes.push(newNote);
      await saveNotes(allNotes);
    }

    // Go to the tab of the category the note was saved in, e.g. "/work"
    router.navigate(("/" + selectedCategory.toLowerCase()) as Href);
  }

  function handleCancel() {
    router.navigate(("/" + (category ? category : CATEGORIES[0]).toLowerCase()) as Href);
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={globalStyles.title}>{id ? "Edit Note" : "Add Note"}</Text>

        {error !== "" && <Text style={globalStyles.errorText}>{error}</Text>}

        <Text style={globalStyles.label}>Title (optional)</Text>
        <TextInput
          style={globalStyles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={globalStyles.label}>Note</Text>
        <TextInput
          style={[globalStyles.input, styles.textArea]}
          value={text}
          onChangeText={setText}
          multiline={true}
        />

        <Text style={globalStyles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.categoryTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={globalStyles.button} onPress={handleSave}>
          <Text style={globalStyles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCancel}>
          <Text style={globalStyles.linkText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
});
