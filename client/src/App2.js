import MessengerABI from "./artifacts/contracts/Messenger.sol/Messenger.json"
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Contacts from "./components/Contacts";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <Router>
      <Routes>
        { <Route path="/" element={<Login setUser={setUser} />} />}
        {user && !selectedContact && (
          <Route
            path="/contacts"
            element={<Contacts user={user} setSelectedContact={setSelectedContact} />}
          />
        )}
        {user && selectedContact && (
          <Route
            path="/chat"
            element={<Chat user={user} selectedContact={selectedContact} />}
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
