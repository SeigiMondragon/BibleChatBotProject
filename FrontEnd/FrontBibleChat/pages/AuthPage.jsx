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

  return (
    <div className="relative min-h-screen overflow-hidden bg-white lg:flex">
      <img
        src={BibleBotLogo}
        alt="Bible Chat Bot"
        className="absolute left-4 top-4 z-20 h-auto w-36 sm:w-44 lg:w-56"
      />
      <div className="flex min-h-[42vh] flex-col items-center justify-center px-6 pt-24 text-center sm:px-10 lg:min-h-screen lg:flex-1 lg:items-start lg:px-16 lg:pt-0 lg:text-left">
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

      <img
        src={Blob}
        alt="Blob"
        className="pointer-events-none absolute -bottom-36 -left-36 hidden h-auto w-[20rem] opacity-90 sm:block lg:-bottom-52 lg:-left-64 lg:w-136"
      />

      {/* Background Screen */}
      <div className="flex min-h-[58vh] flex-col justify-center gap-y-5 px-6 pb-8 pt-4 sm:px-10 lg:min-h-screen lg:flex-1 lg:px-16 lg:py-0">
        {/*Header*/}
        <div className="flex w-full">
          <p className="text-left text-2xl font-bold text-special underline sm:text-3xl">
            Sign In
          </p>
        </div>

        {/*Body*/}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col gap-y-4 sm:gap-y-5">
            <div>
              <Input
                className="mt-3 py-6 font-bold border-3 border-primary bg-secondary placeholder:text-secondary-foreground sm:mt-5 sm:py-7"
                placeholder="Email"
                {...register("email")}
              />
            </div>
            <div>
              <Input
                className="mt-3 py-6 font-bold border-3 border-primary bg-secondary placeholder:text-secondary-foreground sm:mt-5 sm:py-7"
                placeholder="Password"
                {...register("password")}
              />
            </div>
          </div>

          <div className="w-full">
            <Button
              className="w-full py-5 rounded-lg bg-primary text-white"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
        <div className="w-full">
          <hr className="w-full border border-t border-primary" />
        </div>
        <div className="w-full text-center lg:text-left">
          <p className="text-primary">
            Don't have an account? <span className="text-special">Sign Up</span>
          </p>
        </div>
      </div>

      <img
        src={Blob2}
        alt="Blob2"
        className="pointer-events-none absolute -right-28 -top-20 h-auto w-56 opacity-80 sm:-right-36 sm:-top-28 sm:w-[18rem] lg:-right-64 lg:-top-36 lg:w-md"
      />
    </div>
  );
};

export default AuthPage;
