import React, { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

// This component decides where the user is allowed to be.
function ProtectedNavigation() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    // segments[0] is the folder name, e.g. "(auth)" or "(app)"
    const inAuthFolder = segments[0] === "(auth)";

    if (user === null && !inAuthFolder) {
      // Not logged in, but trying to see a private page -> go to login
      router.replace("/login");
    } else if (user !== null && inAuthFolder) {
      // Logged in, but trying to see login/register -> go to the notes
      router.replace("/work");
    }
  }, [user, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedNavigation />
    </AuthProvider>
  );
}
