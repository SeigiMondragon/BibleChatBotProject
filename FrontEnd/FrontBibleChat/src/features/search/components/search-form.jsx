import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchForm = ({ handleSubmit, register, onSearch, isSearching }) => {
  return (
    <form
      className="shrink-0 bg-primary/5 border-b border-primary/10 p-6"
      onSubmit={handleSubmit(onSearch)}
    >
      <div className="flex gap-3 max-w-3xl">
        <Input
          {...register("search")}
          placeholder="Search conversation title..."
          className="bg-white border-secondary-foreground text-primary"
        />
        <Button
          type="submit"
          disabled={isSearching}
          className="border border-secondary bg-secondary text-white"
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
