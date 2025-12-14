// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";

import { db } from "./firebase";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

const ROOM_ID = "our-little-space"; // can be any id you like

function App() {
  const [note, setNote] = useState("Today I’m grateful for you 💕");
  const [myMood, setMyMood] = useState("😊");
  const [theirMood, setTheirMood] = useState("😎");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Subscribe to Firestore so both of you see the same data
  useEffect(() => {
    const roomRef = doc(db, "rooms", ROOM_ID);

    // One-time create doc if it doesn't exist yet
    getDoc(roomRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(roomRef, {
          note,
          myMood,
          theirMood,
          createdAt: Date.now(),
        });
      }
    });

    // Real-time listener
    const unsub = onSnapshot(roomRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (typeof data.note === "string") setNote(data.note);
        if (typeof data.myMood === "string") setMyMood(data.myMood);
        if (typeof data.theirMood === "string") setTheirMood(data.theirMood);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const roomRef = doc(db, "rooms", ROOM_ID);
      await setDoc(
        roomRef,
        {
          note,
          myMood,
          theirMood,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving:", err);
      alert("Oops, something went wrong saving to the cloud.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app">
      <div className="bg-layer" />

      <div className="card">
        <h1 className="title">our little space 💌</h1>

        {loading ? (
          <p style={{ textAlign: "center", opacity: 0.6 }}>loading us…</p>
        ) : (
          <>
            <section className="section">
              <h2>today&apos;s love note</h2>
              <textarea
                className="note-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </section>

            <section className="section moods">
              <div>
                <h3>my mood</h3>
                <select
                  value={myMood}
                  onChange={(e) => setMyMood(e.target.value)}
                >
                  <option>😊</option>
                  <option>🥹</option>
                  <option>😴</option>
                  <option>😡</option>
                  <option>🤪</option>
                </select>
              </div>
              <div>
                <h3>your mood</h3>
                <select
                  value={theirMood}
                  onChange={(e) => setTheirMood(e.target.value)}
                >
                  <option>😎</option>
                  <option>🤓</option>
                  <option>🥰</option>
                  <option>😵‍💫</option>
                  <option>🫠</option>
                </select>
              </div>
            </section>

            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "saving…" : "save for us ✨"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
