import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChatPage from "../pages/ChatPage";
import AuthPage from "../pages/AuthPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}

export default App;
