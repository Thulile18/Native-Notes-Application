export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
};

export type Note = {
  id: string;
  userId: string;
  title: string;
  text: string;
  category: string;
  dateAdded: string; // saved as a date string
  dateEdited: string; // empty string until the note is edited
};
