import LoginForm from "../src/features/auth/components/login-form";
import { useNavigate } from "react-router-dom";
import AuthPageLayout from "../src/features/auth/components/auth-page-layout";

const AuthPage = () => {
  const navigate = useNavigate();
  const handleRegister = () => navigate("/register");

  return (
    <AuthPageLayout
      footerText="Don't have an account?"
      footerActionText="Sign Up"
      onFooterAction={handleRegister}
      showForgotPasswordLink
    >
      <LoginForm />
    </AuthPageLayout>
  );
};

export default AuthPage;
