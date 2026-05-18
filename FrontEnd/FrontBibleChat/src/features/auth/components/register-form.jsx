import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BibleBotLogo from "@/assets/BibleBotLogo.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "../schemas/RegisterSchema";
import { authServices } from "../api/auth-api";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, User } from "lucide-react";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ resolver: zodResolver(RegisterSchema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await authServices.register(
        data.email,
        data.username,
        data.password,
      );

      if (response.success) {
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
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
          <User className="absolute top-2/3 left-3 -translate-y-1/2 text-secondary" />
          <Input
            className="mt-3 ps-10 font-bold border-3 border-primary  placeholder:muted-foreground sm:mt-5 min-w-sm rounded-3xl  sm:py-5"
            placeholder="username"
            {...register("username")}
          />
        </div>

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
            className="mt-3 ps-10  font-bold border-3 border-primary  placeholder:muted-foreground  sm:mt-5 min-w-sm rounded-3xl  sm:py-5"
            placeholder="********"
            type="password"
            {...register("password")}
          />
        </div>

        <Button
          className="w-full py-5 rounded-3xl max-w-sm bg-primary text-white"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
