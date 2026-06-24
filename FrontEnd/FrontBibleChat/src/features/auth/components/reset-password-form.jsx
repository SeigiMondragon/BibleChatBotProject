import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BibleBotLogo from "@/assets/BibleBotLogo.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { authServices } from "../api/auth-api";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Must be at least 8 characters long" })
      .max(32, { message: "Cannot exceed 32 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must contain at least one special character",
      }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

function ResetPasswordForm() {
  const { selectorParam = "", tokenParam = "" } = useParams();
  const selector = selectorParam.replace(/^v=/, "");
  const token = tokenParam.replace(/^t=/, "");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const hasResetParams = Boolean(selector && token);

  const onSubmit = async (data) => {
    if (!hasResetParams) {
      toast.error("Reset password link is invalid");
      return;
    }

    try {
      const response = await authServices.resetPassword({
        password: data.password,
        selector,
        token,
      });

      if (response.success) {
        toast.success(response.message || "Password reset successfully");
        navigate("/auth");
        return;
      }

      toast.error(response.message || "Unable to reset password");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Unable to reset password";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center"
    >
      <img
        src={BibleBotLogo}
        alt="Bible Chat Bot"
        className=" h-auto w-36 sm:w-44 lg:w-56"
      />

      <div className="flex w-full flex-col items-center sm:gap-y-3">
        <div className="relative">
          <KeyRound className="absolute top-2/3 left-3 -translate-y-1/2 text-secondary" />
          <Input
            className="mt-3 ps-10 pe-12 font-bold border-3 border-primary placeholder:muted-foreground sm:mt-5 min-w-sm rounded-3xl sm:py-5"
            placeholder="new password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-2/3 -translate-y-1/2 text-secondary"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="w-full max-w-sm text-xs text-destructive">
            {errors.password.message}
          </p>
        )}

        <div className="relative">
          <KeyRound className="absolute top-2/3 left-3 -translate-y-1/2 text-secondary" />
          <Input
            className="mt-3 ps-10 pe-12 font-bold border-3 border-primary placeholder:muted-foreground sm:mt-5 min-w-sm rounded-3xl sm:py-5"
            placeholder="confirm password"
            type={showPasswordConfirmation ? "text" : "password"}
            {...register("passwordConfirmation")}
          />
          <button
            type="button"
            className="absolute right-3 top-2/3 -translate-y-1/2 text-secondary"
            onClick={() => setShowPasswordConfirmation((prev) => !prev)}
            aria-label={
              showPasswordConfirmation ? "Hide password" : "Show password"
            }
          >
            {showPasswordConfirmation ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.passwordConfirmation && (
          <p className="w-full max-w-sm text-xs text-destructive">
            {errors.passwordConfirmation.message}
          </p>
        )}

        <Button
          className="w-full py-5 rounded-3xl max-w-sm bg-primary text-white"
          type="submit"
          disabled={isSubmitting || !hasResetParams}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
