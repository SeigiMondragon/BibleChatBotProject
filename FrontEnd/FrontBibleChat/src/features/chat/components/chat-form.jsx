import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ChatForm = ({ handleSubmit, onSubmit, register, isLoading }) => {
  return (
    <form
      className="flex justify-center items-center bg-primary w-full max-w-full py-5 px-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Textarea
        className="border-secondary-foreground bg-white placeholder:text-primary font-bold me-3 w-9/12 resize-none"
        placeholder="Type your message here..."
        {...register("prompt")}
      />

      <Button
        type="submit"
        className={`py-5 px-5 ${isLoading ? "bg-primary text-special" : " border border-secondary bg-secondary text-white"}`}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
};

export default ChatForm;
