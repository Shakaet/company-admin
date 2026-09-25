import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useRef, useState } from "react";

interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  delay?: number;
  placeholder?: string;
  className?: string;
  onSearch: (value: string) => void;
}

const SearchInput = ({
  value: controlledValue,
  defaultValue = "",
  delay = 300,
  placeholder = "Search...",
  className = "",
  onSearch,
}: SearchInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  const inputValue = controlledValue ?? value;
  const debouncedValue = useDebounce(inputValue, delay);

  useEffect(() => {
    onSearchRef.current(debouncedValue.trim());
  }, [debouncedValue]);

  return (
    <Input
      value={inputValue}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default SearchInput;
