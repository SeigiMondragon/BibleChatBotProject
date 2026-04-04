import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChatPage from "../pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
    </Routes>
  );
}

export default App;
