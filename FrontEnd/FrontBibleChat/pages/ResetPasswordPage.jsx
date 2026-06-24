import { useNavigate } from "react-router-dom";
import AuthPageLayout from "../src/features/auth/components/auth-page-layout";
import ResetPasswordForm from "../src/features/auth/components/reset-password-form";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const handleSignIn = () => navigate("/auth");

  return (
    <AuthPageLayout
      footerText="Remember your password?"
      footerActionText="Sign In"
      onFooterAction={handleSignIn}
    >
      <ResetPasswordForm />
    </AuthPageLayout>
  );
};

export default ResetPasswordPage;
