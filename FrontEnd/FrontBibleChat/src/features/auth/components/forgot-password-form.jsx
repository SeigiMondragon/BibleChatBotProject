import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BibleBotLogo from "@/assets/BibleBotLogo.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authServices } from "../api/auth-api";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await authServices.forgotPassword(data.email);

      if (response.success) {
        toast.success(response.message || "Password reset email sent");
        return;
      }

      toast.error(response.message || "Unable to send password reset email");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Unable to send password reset email";
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
          <Mail className="absolute top-2/3 left-3 -translate-y-1/2 text-secondary" />
          <Input
            className="mt-3 ps-10 font-bold border-3 border-primary placeholder:muted-foreground sm:mt-5 min-w-sm rounded-3xl sm:py-5"
            placeholder="email@gmail.com"
            {...register("email")}
          />
        </div>

        <Button
          className="w-full py-5 rounded-3xl max-w-sm bg-primary text-white"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
