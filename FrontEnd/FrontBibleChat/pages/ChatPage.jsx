import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { chatSchema } from "../src/schemas/ChatSchema";
import { chatServices } from "../services/ChatServices";
import TextType from "../plugins/textTypeAnim";

const ChatPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(chatSchema),
  });

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    const userMessage = data.prompt;
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    try {
      setIsLoading(true);
      const response = await chatServices.submitChat(userMessage, history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response?.answer ?? "" },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-row h-full min-h-screen">
      <section className="bg-amber-400 w-full flex-1"></section>

      <section className="flex flex-col bg-green-200 w-full flex-[6_6_0%]">
        {/* Upper Part */}
        <div className=" bg-white w-full p-6">
          <Label className="text-3xl">Bible Chat Bot</Label>
        </div>

        {/* Chat Part */}
        {messages.length > 0 ? (
          <div className="flex-[3_4_0%] min-h-0 flex flex-col overflow-y-auto py-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`border border-black px-5 mx-5 my-5 rounded-2xl  ${
                  message.role === "user"
                    ? "self-end bg-gray-200"
                    : "self-start bg-blue-200"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="border border-black px-5 mx-5 my-5 rounded-2xl self-start bg-blue-200">
                Thinking...
              </div>
            )}
          </div>
        ) : (
          <div className="flex-[4_4_0%] flex w-full items-center justify-center px-4">
            <TextType
              className="text-3xl"
              text={[
                "Hi I am BibleBot",
                "Your Personal Bible Chat Bot",
                "Happy Reading!",
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              deletingSpeed={50}
              variableSpeedEnabled={false}
              variableSpeedMin={60}
              variableSpeedMax={120}
              cursorBlinkDuration={0.5}
            />
          </div>
        )}

        {/* Prompt Part */}
        <div className="flex-[1_1_0%]">
          <form
            className="flex h-full justify-center items-center bg-white w-full max-w-full py-5 px-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Textarea
              className="border-black me-3 w-9/12 resize-none"
              placeholder="Type your message here"
              {...register("prompt")}
            />

            <Button type="submit" className="py-5 px-5" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ChatPage;
