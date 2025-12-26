// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";

import { db } from "./firebase";
import { doc, getDoc, onSnapshot, setDoc, updateDoc, increment } from "firebase/firestore";

const ROOM_ID = "our-little-space";

function App() {
  const [counter, setCounter] = useState(0);
  const [note, setNote] = useState("Today I'm grateful for you 💕");
  const [myMood, setMyMood] = useState("😊");
  const [theirMood, setTheirMood] = useState("😎");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const roomRef = doc(db, "rooms", ROOM_ID);

    getDoc(roomRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(roomRef, {
          note,
          myMood,
          theirMood,
          createdAt: Date.now(),
          counter: 0,
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
        if (typeof data.counter === "number") setCounter(data.counter);
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

  const handlePlusOne = async () => {
  try {
    const roomRef = doc(db, "rooms", ROOM_ID);
    await updateDoc(roomRef, {
      counter: increment(1),
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.error(err);
    alert("Couldn’t update counter.");
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
                  <section className="section">
          <h2>our poop counter 💩</h2>

          <div className="counter-box">
            <div className="counter-number">{counter}</div>

            <button className="counter-btn" onClick={handlePlusOne}>
              +1 💗
            </button>
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
