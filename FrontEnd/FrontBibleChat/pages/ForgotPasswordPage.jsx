import { useNavigate } from "react-router-dom";
import AuthPageLayout from "../src/features/auth/components/auth-page-layout";
import ForgotPasswordForm from "../src/features/auth/components/forgot-password-form";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const handleSignIn = () => navigate("/auth");

  return (
    <AuthPageLayout
      footerText="Remember your password?"
      footerActionText="Sign In"
      onFooterAction={handleSignIn}
    >
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
};

export default ForgotPasswordPage;
