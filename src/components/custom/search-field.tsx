import { Search } from "lucide-react";
import SearchInput from "./search-input";

interface SearchFieldProps {
  placeholder?: string;
  className?: string;
  onSearch: (value: string) => void;
}

export const SearchField = ({
  placeholder = "Search...",
  onSearch,
  className = "",
}: SearchFieldProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <SearchInput
        placeholder={placeholder}
        onSearch={onSearch}
        className={`pl-9 ${className}`}
      />
    </div>
  );
};
