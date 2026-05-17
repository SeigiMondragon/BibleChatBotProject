import { Outlet } from "react-router-dom";

const AuthLayout = () => {
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

      <Outlet />
    </div>
  );
};

export default AuthLayout;
