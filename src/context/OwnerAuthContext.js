// src/context/OwnerAuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const OwnerAuthContext = createContext(null);

export function OwnerAuthProvider({ children }) {
  const [owner, setOwner] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if this user has an owner profile (distinguishes owners from your admin account)
        const profileSnap = await getDoc(doc(db, "owners", currentUser.uid));
        if (profileSnap.exists()) {
          setOwner(currentUser);
          setOwnerProfile(profileSnap.data());
        } else {
          setOwner(null);
          setOwnerProfile(null);
        }
      } else {
        setOwner(null);
        setOwnerProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async ({ fullName, email, mobile, whatsapp, password }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "owners", cred.user.uid), {
      uid: cred.user.uid,
      fullName, email, mobile, whatsapp,
      createdAt: serverTimestamp(),
    });
    return cred.user;
  };

  const login = async (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = async () => signOut(auth);

  return (
    <OwnerAuthContext.Provider value={{ owner, ownerProfile, loading, signup, login, logout }}>
      {children}
    </OwnerAuthContext.Provider>
  );
}

export function useOwnerAuth() {
  const context = useContext(OwnerAuthContext);
  if (!context) throw new Error("useOwnerAuth must be used within an OwnerAuthProvider");
  return context;
}