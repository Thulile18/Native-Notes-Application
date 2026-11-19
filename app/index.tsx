import { Redirect } from "expo-router";
// The very first screen. It sends everyone to login,
// and the protection code in _layout.tsx moves logged in users on to the notes.
export default function Index() {
  return <Redirect href="/login" />;
}
