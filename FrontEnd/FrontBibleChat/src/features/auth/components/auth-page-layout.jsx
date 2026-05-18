const AuthPageLayout = ({
  children,
  footerText,
  footerActionText,
  onFooterAction,
}) => {
  return (
    <div className="flex min-h-[58vh] flex-col justify-center gap-y-5 px-6 pb-8 pt-4 sm:px-10 lg:min-h-screen lg:flex-1 lg:px-16 lg:py-0">
      {children}

      <div className="w-full flex justify-center">
        <hr className="w-[70%] border border-t border-primary" />
      </div>

      <div className="w-full flex justify-center lg:text-left">
        <p className="text-primary">
          {footerText}{" "}
          <span
            className="text-special cursor-pointer hover:underline"
            onClick={onFooterAction}
          >
            {footerActionText}
          </span>
        </p>
      </div>

      <p className="text-center text-muted-foreground text-xs">
        Copyright 2026 Bible Chat Bot | All rights reserved
      </p>
    </div>
  );
};

export default AuthPageLayout;
