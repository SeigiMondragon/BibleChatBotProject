import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ChatPage from "../pages/ChatPage";
import RegisterPage from "../pages/RegisterPage";

import AuthPage from "../pages/AuthPage";
import SearchPage from "../pages/SearchPage";

import AuthLayout from "../layout/AuthLayout";
import ChatLayout from "../layout/chatlayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth" replace />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="/chat" element={<ChatLayout />}>
        <Route path=":convoID?" element={<ChatPage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>
    </Routes>
  );
}

export default App;
