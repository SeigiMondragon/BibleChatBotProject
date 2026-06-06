import ReactMarkdown from "react-markdown";
import TextType from "../../../../plugins/textTypeAnim";

const ConversationComponent = ({ messages, isLoading }) => {
  if (messages.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center px-4">
        <TextType
          className="text-3xl text-primary bg-primary-foreground"
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
          cursorBlinkDuration={0.5}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto py-5 flex flex-col">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`border border-primary px-5 mx-5 my-5 rounded-2xl   ${
            message.role === "user"
              ? "self-end text-primary-foreground bg-primary"
              : "self-start text-primary bg-primary-foreground"
          }`}
        >
          <ReactMarkdown>{message.message}</ReactMarkdown>
        </div>
      ))}
      {isLoading && (
        <div className="border border-black px-5 mx-5 my-5 rounded-2xl self-start ">
          <TextType
            className="text-primary bg-primary-foreground"
            text={["Looking for the Verses", "Aligning Answers with the Bible"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            cursorBlinkDuration={0.5}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationComponent;
