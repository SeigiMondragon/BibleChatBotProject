import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChatPage from "../pages/ChatPage";
import RegisterPage from "../pages/RegisterPage";

import AuthPage from "../pages/AuthPage";
import ChatLayout from "../layout/chatlayout";
import SearchPage from "../pages/SearchPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/chat" element={<ChatLayout />}>
        <Route path=":convoID?" element={<ChatPage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>
    </Routes>
  );
}

export default App;
