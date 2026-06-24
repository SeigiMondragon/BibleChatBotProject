import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ChatPage from "../pages/ChatPage";
import RegisterPage from "../pages/RegisterPage";

import AuthPage from "../pages/AuthPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import SearchPage from "../pages/SearchPage";

import AuthLayout from "../layout/AuthLayout";
import ChatLayout from "../layout/ChatLayout";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <Toaster position="top-center" className="bg-secondary" />
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth" replace />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="reset-password/:selectorParam/:tokenParam"
            element={<ResetPasswordPage />}
          />
        </Route>

        <Route path="/chat" element={<ChatLayout />}>
          <Route path=":convoID?" element={<ChatPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
