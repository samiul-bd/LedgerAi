import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import AccountList from "./components/AccountList";
import AddAccount from "./components/AddAccount";
import AddJournalEntry from "./components/AddJournalEntry";
import JournalList from "./components/JournalList";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/accounts" element={<AccountList />} />
        <Route path="/add-account" element={<AddAccount />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/add-journal" element={<AddJournalEntry />} />
        <Route path="/journals" element={<JournalList />} />
      </Routes>
    </Router>
  );
};

export default App;
