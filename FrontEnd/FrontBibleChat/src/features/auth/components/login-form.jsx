import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BibleBotLogo from "@/assets/BibleBotLogo.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthSchema } from "../schemas/AuthSchema";

import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "../../auth/hooks/use-auth";
import { toast } from "sonner";
const LoginForm = () => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(AuthSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  console.log(loginMutation);
  const onSubmit = async (data) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          toast.success("Signed in successfully");
          navigate("/chat");
        },
        onError: (error) => {
          const message = error?.response?.data?.message || "Sign in failed";
          toast.error(message);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center"
    >
      {/*Header*/}
      <img
        src={BibleBotLogo}
        alt="Bible Chat Bot"
        className=" h-auto w-36 sm:w-44 lg:w-56"
      />
      <div className="flex w-full flex-col  items-center sm:gap-y-3">
        <div className="relative">
          <Mail className="absolute top-2/3 left-3 -translate-y-1/2 text-secondary" />
          <Input
            className="mt-3 ps-10 font-bold border-3 border-primary  placeholder:muted-foreground sm:mt-5 min-w-sm rounded-3xl  sm:py-5"
            placeholder="email@gmail.com"
            {...register("email")}
          />
        </div>

        <div className="relative">
          <KeyRound className="absolute top-2/3 left-3 -translate-y-1/2 text-secondary" />
          <Input
            className="mt-3 ps-10 pe-12 font-bold border-3 border-primary placeholder:muted-foreground sm:mt-5 min-w-sm rounded-3xl sm:py-5"
            placeholder="********"
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

        <Button
          className="w-full py-5 rounded-3xl max-w-sm bg-primary text-white"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
