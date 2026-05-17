import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BibleBotLogo from "@/assets/BibleBotLogo.svg";
import Blob from "@/assets/Blob.svg";
import Blob2 from "@/assets/Blob2.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthSchema } from "../src/schemas/AuthSchema";
import { authServices } from "../services/AuthServices";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound } from "lucide-react";
const AuthPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(AuthSchema) });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const response = await authServices.login(data.email, data.password);
      console.log("This is the response", response);
      if (response.success) {
        navigate("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = () => navigate("/register");

  return (
    <div className="relative min-h-screen overflow-hidden bg-white lg:flex">
      <div className="flex min-h-[42vh] flex-col items-center justify-center px-6 pt-24 text-center sm:px-10 lg:min-h-screen lg:flex-1 lg:items-center lg:px-16 lg:pt-0 lg:text-center">
        <p className="text-3xl text-primary sm:text-4xl lg:text-5xl">
          Just <span className="text-primary font-bold">Ask</span>
        </p>
        <p className="text-3xl text-special sm:text-4xl lg:text-5xl">and</p>
        <p className="text-3xl text-primary font-bold sm:text-4xl lg:text-5xl">
          Receive
        </p>
        <p className="mt-4 max-w-md text-sm italic text-special sm:text-base lg:mt-5">
          "A <span className="text-primary font-bold">Bible Chat Bot</span> for
          your Biblical Queries!"
        </p>
      </div>

      {/* Background Screen */}
      <div className="flex min-h-[58vh] flex-col justify-center gap-y-5 px-6 pb-8 pt-4 sm:px-10 lg:min-h-screen lg:flex-1 lg:px-16 lg:py-0">
        {/*Body*/}
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
                className="mt-3 ps-10  font-bold border-3 border-primary  placeholder:muted-foreground  sm:mt-5 min-w-sm rounded-3xl  sm:py-5"
                placeholder="••••••••"
                type="password"
                {...register("password")}
              />
            </div>

            <Button
              className="w-full py-5 rounded-3xl max-w-sm bg-primary text-white"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
        <div className="w-full flex justify-center">
          <hr className="w-[70%]  border border-t border-primary" />
        </div>
        <div className="w-full flex justify-center lg:text-left">
          <p className="text-primary">
            Don't have an account?{" "}
            <span
              className="text-special cursor-pointer hover:underline"
              onClick={handleRegister}
            >
              Sign Up
            </span>
          </p>
        </div>
        <p className="text-center text-muted-foreground text-xs">
          Copyright 2026 Bible Chat Bot | All rights reserved
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
