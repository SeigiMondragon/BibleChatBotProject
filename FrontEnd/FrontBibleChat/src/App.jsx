import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChatPage from "../pages/ChatPage";
import AuthPage from "../pages/AuthPage";
import ChatLayout from "../layout/chatlayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/chat" element={<ChatLayout />}>
        <Route index element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default App;
