import { useNavigate } from "react-router-dom";
import RegisterForm from "../src/features/auth/components/register-form";
import AuthPageLayout from "../src/features/auth/components/auth-page-layout";
const RegisterPage = () => {
  const navigate = useNavigate();
  const handleSignIn = () => navigate("/auth");
  return (
    <AuthPageLayout
      footerText="Already have an account?"
      footerActionText="Sign In"
      onFooterAction={handleSignIn}
    >
      <RegisterForm />
    </AuthPageLayout>
  );
};

export default RegisterPage;
