// src/components/GoogleLogin.jsx
import React from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

googleProvider.addScope("profile");
googleProvider.addScope("email");

function GoogleLogin({ user, setUser }) {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const signedInUser = result.user;
      setUser(signedInUser);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={user.photoURL || "https://www.gravatar.com/avatar/?d=mp"}
          alt="User"
          className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
        />
        <span className="font-medium text-gray-700">{user.displayName}</span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
    >
      Sign in
    </button>
  );
}

export default GoogleLogin;
