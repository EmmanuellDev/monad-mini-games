import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ChessGame from './components/ChessGame';
import Navigation from './components/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/games" element={<ChessGameRoute />} />
        <Route path="*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

// This component handles ChessGame at "/games"
function ChessGameRoute() {
  // You can enhance this later with URL params or state
  return <ChessGame roomCode="" mode="local" />;
}

// This is your existing logic for other pages
function MainApp() {
  const [page, setPage] = useState("home");
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState(""); // "local", "create", "join"

  if (page === "game") {
    return <ChessGame roomCode={roomCode} mode={mode} />;
  }

  return (
    <Navigation
      onStartGame={() => {
        setMode("local");
        setPage("game");
      }}
      onCreateRoom={(code) => {
        setRoomCode(code);
        setMode("create");
        setPage("game");
      }}
      onJoinRoom={(code) => {
        setRoomCode(code);
        setMode("join");
        setPage("game");
      }}
    />
  );
}
